const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');


const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

const simpleFrag1 = glsl.file('./shader/shader1.frag');
const simpleVert1 = glsl.file('./shader/shader1.vert');

const particleFragmentShader = glsl.file('./shader/particleFragmentShader.frag');
const particleVertexShader = glsl.file('./shader/particleVertexShader.vert');

const computeShaderPosition = glsl.file('./shader/computeShaderPosition.frag');
const computeShaderVelocity = glsl.file('./shader/computeShaderVelocity.frag');


var mesh;
var helper, ikHelper;
var clock = new THREE.Clock();

// Texture width for simulation (each texel is a debris particle)
var WIDTH = 128;

var geometry;
var PARTICLES = WIDTH * WIDTH;

var gpuCompute;
var velocityVariable;
var positionVariable;

var positionUniforms;
var velocityUniforms;

var particleUniforms;

var dtDance;


// Create a different scene to hold our buffer objects
var bufferScene = new THREE.Scene();
// Create the texture that will store our result
var bufferTexture = new THREE.WebGLRenderTarget(
    128,
    128,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter
    }
);
var uniforms2;




init();
animate();


function init() {

    camera.position.z = 30;
    camera.lookAt(new THREE.Vector3());


    initComputeRenderer();

    initProtoplanets();
}

function initComputeRenderer() {

    gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

    var dtPosition = gpuCompute.createTexture();
    var dtVelocity = gpuCompute.createTexture();


    fillTextures( dtPosition, dtVelocity, dtDance );

    velocityVariable = gpuCompute.addVariable( "textureVelocity", computeShaderVelocity, dtVelocity );
    positionVariable = gpuCompute.addVariable( "texturePosition", computeShaderPosition, dtPosition );
    // danceVariable    = gpuCompute.addVariable( "textureDance"   , computeShaderDance   , dtDance    );

    gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );
    // gpuCompute.setVariableDependencies( danceVariable   , [ positionVariable, velocityVariable, danceVariable ] );

    positionUniforms = positionVariable.material.uniforms;
    velocityUniforms = velocityVariable.material.uniforms;
    //danceUniforms    = danceVariable.material.uniforms;

    positionVariable.material.uniforms.time = {
        value:0
    };

    velocityVariable.material.uniforms.time = {
        value:0
    };

    positionVariable.material.uniforms.texture1 = { type: "t", value: null };
    velocityVariable.material.uniforms.texture1 = { type: "t", value: null };



    // danceVariable.material.uniforms.time = {
    //     value:0
    // };

    gpuCompute.init();

}


function initProtoplanets() {

    geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( PARTICLES * 3 );

    for ( var i = 0; i < PARTICLES * 3; i+= 3 * 3 ) {
        positions[ i+0 ] = 0;//Math.random() * 1;
        positions[ i+1 ] = 0;//Math.random() * 1;
        positions[ i+2 ] = 0;//Math.random() * 1;

        positions[ i+3 ] = 0;//Math.random() * 1;
        positions[ i+4 ] = 0;//Math.random() * 1;
        positions[ i+5 ] = 0;//Math.random() * 1;

        positions[ i+6 ] = 0;//Math.random() * 1;
        positions[ i+7 ] = 0;//Math.random() * 1;
        positions[ i+8 ] = 0;//Math.random() * 1;
    }

    var indexs2 = new Float32Array( PARTICLES );
    for ( var i = 0; i < PARTICLES ; i++ ) {
        indexs2[i] = i;
    }

    var uvs = new Float32Array( PARTICLES * 2 );
    var p = 0;
    for ( var j = 0; j < WIDTH; j++ ) {
        for ( var i = 0; i < WIDTH; i++ ) {
            uvs[ p++ ] = i / ( WIDTH - 1 );
            uvs[ p++ ] = j / ( WIDTH - 1 );
        }
    }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    geometry.addAttribute( 'index2', new THREE.BufferAttribute( indexs2, 1 ) );

    particleUniforms = {
        texture1: { type: "t", value: null },
        texturePosition: { value: null },
        textureVelocity: { value: null },
        textureDance:    { value: null },
        cameraConstant: { value: getCameraConstant( camera ) },
    };

    // // ShaderMaterial
    var material = new THREE.ShaderMaterial( {
        uniforms:       particleUniforms,
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        side:           THREE.DoubleSide,
        transparent: true,
    } );

    material.extensions.drawBuffers = true;

    var particles = new THREE.Points( geometry, material );
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();
    scene.add( particles );









    // model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };

    var modelFile = 'models/mmd/miku/miku_v2.pmd';
    var vmdFiles = [ 'models/mmd/vmds/wavefile_v2.vmd' ];

    helper = new THREE.MMDHelper();

    var loader = new THREE.MMDLoader();
    loader.load( modelFile, vmdFiles, function ( object ) {

        console.log(object)
        console.log(object.isPoints = true)
        var indexs = new Float32Array( object.geometry.attributes.position.count );
        for ( var i = 0; i < object.geometry.attributes.position.count; i++ ) {
            indexs[i] = i;
        }
        object.geometry.addAttribute( 'index2', new THREE.BufferAttribute( indexs, 1 ) );

        var array = [];
        for ( var i = 0, il = object.material.materials.length; i < il; i ++ ) {
            var m = new THREE.ShaderMaterial({
                vertexShader:   simpleVert,
                fragmentShader: simpleFrag,
                skinning:true,
                wireframe:true,
            });
            array.push( m );
        }

        var shaderMaterials = new THREE.MultiMaterial( array );
        object.material = shaderMaterials;

        mesh = object;
        mesh.position.y = -12;

        //scene.add( mesh );
        bufferScene.add( mesh );

        helper.add( mesh );
        helper.setAnimation( mesh );

        /*
         * Note: create CCDIKHelper after calling helper.setAnimation()
         */
        ikHelper = new THREE.CCDIKHelper( mesh );
        ikHelper.visible = false;
        scene.add( ikHelper );





        uniforms2 = {
            texture1: { type: "t", value: null }
        };

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms:uniforms2,
            vertexShader:   simpleVert1,
            fragmentShader: simpleFrag1
        });
        var box1 = new THREE.Points(object.geometry, shaderMaterial)
        scene.add(box1);






        ///And a blue plane behind it
        // var debugMaterial = new THREE.MeshBasicMaterial({map:bufferTexture.texture});
        // var plane1 = new THREE.PlaneBufferGeometry( 100,100);
        // var planeObject1 = new THREE.Mesh(plane1,debugMaterial);
        // planeObject1.position.x = 2.0;
        // planeObject1.position.y = 2.0;
        // scene.add(planeObject1);






        initGui();

    }, onProgress, onError );

    function initGui () {
        var api = {
            'animation': true,
            'ik': true,
            'physics': true,
            'show IK bones': false,
        };
        var gui = new dat.GUI();
        gui.add( api, 'animation' ).onChange( function () {
            helper.doAnimation = api[ 'animation' ];
        } );
        gui.add( api, 'ik' ).onChange( function () {
            helper.doIk = api[ 'ik' ];
        } );
        gui.add( api, 'physics' ).onChange( function () {
            helper.enablePhysics( api[ 'physics' ] );
        } );
        gui.add( api, 'show IK bones' ).onChange( function () {
            ikHelper.visible = api[ 'show IK bones' ];
        } );
    }





}

function fillTextures( texturePosition, textureVelocity ) {

    var posArray   = texturePosition.image.data;
    var velArray   = textureVelocity.image.data;

    console.log("pos",posArray.length)
    console.log("vel",velArray.length)

    for ( var k = 0, kl = posArray.length; k < kl; k += 4*3 ) {
        // Position
        var x, y, z;
        var posrX = Math.random()*200 - 100;
        var posrY = Math.random()*200 - 100;
        var posrZ = Math.random()*200 - 100;
        var w = Math.random()*10.0;

        // posArrayの実態は一次元配列なので
        // x,y,z,wの順番に埋めていく。
        // wは今回は使用しないが、配列の順番などを埋めておくといろいろ使えて便利
        posArray[ k + 0 ] = posrX;
        posArray[ k + 1 ] = posrY;
        posArray[ k + 2 ] = posrZ;
        posArray[ k + 3 ] = w;

        posArray[ k + 4 ] = posrX;
        posArray[ k + 5 ] = posrY;
        posArray[ k + 6 ] = posrZ;
        posArray[ k + 7 ] = w;

        posArray[ k + 8 ] = posrX;
        posArray[ k + 9 ] = posrY;
        posArray[ k + 10 ] = posrZ;
        posArray[ k + 11 ] = w;

        // 移動する方向はとりあえずランダムに決めてみる。
        // これでランダムな方向にとぶパーティクルが出来上がるはず。
        var velX = 0.;//(Math.random()*1.0);
        var velY = 0.;//(Math.random()*2.0);
        var velZ = -0.03;//(Math.random()*2.0);

        w = 0.5+Math.random()*0.5;

        velArray[ k + 0 ] = velX;
        velArray[ k + 1 ] = velY;
        velArray[ k + 2 ] = velZ;
        velArray[ k + 3 ] = w;

        velArray[ k + 4 ] = velX;
        velArray[ k + 5 ] = velY;
        velArray[ k + 6 ] = velZ;
        velArray[ k + 7 ] = w;

        velArray[ k + 8 ] = velX;
        velArray[ k + 9 ] = velY;
        velArray[ k + 10 ] = velZ;
        velArray[ k + 11 ] = w;

    }

}


function getCameraConstant( camera ) {
    return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}


var count = 0;
var count1 = 0;
function render() {

    helper.animate( clock.getDelta() );

    // Render onto our off-screen texture
    renderer.render(bufferScene, camera, bufferTexture);

    if( uniforms2 ){
        uniforms2.texture1.value = bufferTexture.texture;
    }

    // console.log(danceVariable);

    count1++;
    if( count1 > 100 ){
        count += 1;
        count1 = 0;

        // console.log(count)
        if( count > 10 ){
            count = 0;
        }
    }


    // for ( var k = 0, kl = dtDance.image.data.length; k < kl; k += 4*3 ) {
    //     dtDance.image.data[k] = count;
    // }


    gpuCompute.compute();

    velocityVariable.material.uniforms.time.value += 1/60;

    velocityVariable.material.uniforms.texture1.value = bufferTexture.texture;
    positionVariable.material.uniforms.texture1.value = bufferTexture.texture;

    // positionVariable.material.uniforms.textureDance = bufferTexture.texture;
    // velocityVariable.material.uniforms.textureDance = bufferTexture.texture;

    particleUniforms.texture1.value = bufferTexture.texture;
    particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

    // renderer.setMode( _gl.POINTS );
    renderer.render( scene, camera );

}