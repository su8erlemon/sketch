const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');


const mmdSaveToTextureFrag = glsl.file('./shader/mmdSaveToTexture.frag');
const mmdSaveToTextureVert = glsl.file('./shader/mmdSaveToTexture.vert');

const debugMMDFrag = glsl.file('./shader/debugMMD.frag');
const debugMMDVert = glsl.file('./shader/debugMMD.vert');

const particleFragmentShader = glsl.file('./shader/particleFragmentShader.frag');
const particleVertexShader = glsl.file('./shader/particleVertexShader.vert');

const computeShaderPosition = glsl.file('./shader/computeShaderPosition.frag');
const computeShaderVelocity = glsl.file('./shader/computeShaderVelocity.frag');


var mesh;
var helper;
var clock = new THREE.Clock();

// Texture width for simulation (each texel is a debris particle)
var WIDTH = 1024;

var geometry;
var PARTICLES = WIDTH * WIDTH;

var gpuCompute;
var velocityVariable;
var positionVariable;

var positionUniforms;
var velocityUniforms;

var particleUniforms;
var particleUniforms2;

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

    camera.position.z = 2;
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

    // var positions = new Float32Array( PARTICLES * 3 );
    //
    // var dr = 0.0;
    // for ( var i = 0; i < PARTICLES * 3; i+= 3 * 3 ) {
    //     positions[ i+0 ] = Math.random() * dr;
    //     positions[ i+1 ] = Math.random() * dr;
    //     positions[ i+2 ] = Math.random() * dr;
    //
    //     positions[ i+3 ] = Math.random() * dr;
    //     positions[ i+4 ] = Math.random() * dr;
    //     positions[ i+5 ] = Math.random() * dr;
    //
    //     positions[ i+6 ] = Math.random() * dr;
    //     positions[ i+7 ] = Math.random() * dr;
    //     positions[ i+8 ] = Math.random() * dr;
    // }
    //
    // var indexs2 = new Float32Array( PARTICLES );
    // for ( var i = 0; i < PARTICLES ; i++ ) {
    //     indexs2[i] = i;
    // }

    var positions = new Float32Array( PARTICLES * 3 );
    console.log("aaaaa",positions.length);

    var ww = 0.08;
    var hh = 0.02;
    var zz = 0.02;

    var BOX_ARRAY = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,

        -1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0,  -1.0,
        1.0, -1.0,  -1.0,
        1.0,  1.0,  -1.0,

        -1.0, -1.0,  -1.0,
        1.0,  1.0,  -1.0,
        -1.0,  1.0,  -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,

        -1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0,  -1.0, -1.0,
        -1.0,  -1.0,  1.0,
        1.0,  -1.0,  1.0,

        -1.0,  -1.0, -1.0,
        1.0,  -1.0,  1.0,
        1.0,  -1.0, -1.0,


        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,

        1.0, -1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0,
    ];

    var randomSize;
    var randomSizeH;
    var ccc = 0;
    for ( var i = 0; i < PARTICLES * 3; i+= 3 * 3 * 12 ) {
        // console.log( ++ccc );
        randomSize = 0.01 + 1.8*(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())/5.0;
        randomSizeH = 0.01 + 1.8*(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())/5.0;
        for( var k = 0; k < 3*3*12; k+=3 ){
            positions[i + k + 0] = BOX_ARRAY[k+0]*ww*randomSizeH*randomSize;
            positions[i + k + 1] = BOX_ARRAY[k+1]*hh*randomSizeH*randomSizeH*randomSizeH;
            positions[i + k + 2] = BOX_ARRAY[k+2]*zz*randomSize*randomSize*randomSize;
            // console.log(i,i + k)
        }

        //left x
        // positions[ i+0 ] = 0.0;//Math.random() * 1;
        // positions[ i+1 ] = -0.1;//Math.random() * 1;
        // positions[ i+2 ] = 0.0;//Math.random() * 1;
        //
        // positions[ i+3 ] = 0.0;//Math.random() * 1;
        // positions[ i+4 ] = 0.1;//Math.random() * 1;
        // positions[ i+5 ] = 0.0;//Math.random() * 1;
        //
        // positions[ i+6 ] = 2.0;//Math.random() * 1;
        // positions[ i+7 ] = 0.0;//Math.random() * 1;
        // positions[ i+8 ] = 0.0;//Math.random() * 1;


    }


    var uvs = new Float32Array( PARTICLES * 2 );
    var p = 0;
    for ( var j = 0; j < WIDTH; j++ ) {
        for ( var i = 0; i < WIDTH; i++ ) {
            uvs[ p++ ] = i / ( WIDTH - 1 );
            uvs[ p++ ] = j / ( WIDTH - 1 );
        }
    }

    var indexs2 = new Float32Array( PARTICLES );
    for ( var i = 0; i < PARTICLES ; i++ ) {
        indexs2[i] = i;
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
        invMatrix: { value: new THREE.Matrix4() },
    };

    // Create light
    var light = new THREE.PointLight(0xffffff, 1.0);
    // We want it to be very close to our character
    light.position.set(1,1,1);
    scene.add(light);

    particleUniforms2 = THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        particleUniforms,
    ]);

    // // ShaderMaterial
    var material = new THREE.ShaderMaterial( {
        uniforms:       particleUniforms2,
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        side:           THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        transparent: true,
        lights: true,
    } );

    material.extensions.derivatives = true;
    material.extensions.drawBuffers = true;

    var particles = new THREE.Mesh( geometry, material );
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();
    scene.add( particles );

    var m = new THREE.Matrix4();
    m.copy( particles.matrixWorld );
    m.multiply( camera.matrixWorldInverse );
    var i = new THREE.Matrix4().getInverse( m );
    material.uniforms.invMatrix.value = i;








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
    loader.load( modelFile, vmdFiles, function ( mmdMesh ) {

        console.log(mmdMesh)

        var indexs = new Float32Array( mmdMesh.geometry.attributes.position.count );
        for ( var i = 0; i < mmdMesh.geometry.attributes.position.count; i++ ) {
            indexs[i] = i;
        }
        mmdMesh.geometry.addAttribute( 'index2', new THREE.BufferAttribute( indexs, 1 ) );

        var array = [];
        for ( var i = 0, il = mmdMesh.material.materials.length; i < il; i ++ ) {
            var m = new THREE.ShaderMaterial({
                vertexShader:   mmdSaveToTextureVert,
                fragmentShader: mmdSaveToTextureFrag,
                skinning:true,
                wireframe:true,
            });
            array.push( m );
        }

        var shaderMaterials = new THREE.MultiMaterial( array );
        mmdMesh.material = shaderMaterials;

        mesh = mmdMesh;
        mesh.position.y = -12;

        //scene.add( mesh );
        bufferScene.add( mesh );

        helper.add( mesh );
        helper.setAnimation( mesh );


        // uniforms2 = {
        //     texture1: { type: "t", value: null }
        // };
        //
        // var shaderMaterial = new THREE.ShaderMaterial({
        //     uniforms:uniforms2,
        //     fragmentShader: debugMMDFrag,
        //     vertexShader:   debugMMDVert,
        //     transparent: true,
        // });
        //
        // var mat22 = new THREE.MeshBasicMaterial( { color: 0xffaa00} );
        // var mat33 = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading, });
        //
        // // var box1 = new THREE.Points(mmdMesh.geometry, shaderMaterial)
        // // var box1 = new THREE.Mesh(mmdMesh.geometry, shaderMaterial)
        // var box1 = new THREE.Line(mmdMesh.geometry, shaderMaterial)
        // scene.add(box1);


        initGui();

    }, onProgress, onError );


    function initGui () {
        var api = {
            'animation': true,
        };
        var gui = new dat.GUI();
        // gui.add( api, 'animation' ).onChange( function () {
        //     helper.doAnimation = api[ 'animation' ];
        // } );
    }





}

function fillTextures( texturePosition, textureVelocity ) {

    var posArray   = texturePosition.image.data;
    var velArray   = textureVelocity.image.data;

    console.log("pos",posArray.length)
    console.log("vel",velArray.length)

    var count = 0;
    for ( var k = 0, kl = posArray.length; k < kl; k += 4*3*12 ) {
        count++;
        // console.log("num",count)
        // Position
        var x, y, z;
        var posrX = Math.random() - .5;
        var posrY = Math.random() - .5;
        var posrZ = Math.random() * -4;
        var w = Math.random()*12200;

        // posArrayの実態は一次元配列なので
        // x,y,z,wの順番に埋めていく。
        // wは今回は使用しないが、配列の順番などを埋めておくといろいろ使えて便利
        for( var k2 = 0; k2 < 4*3*12; k2 += 4 ){
            posArray[ k + k2 + 0 ] = posrX;
            posArray[ k + k2 + 1 ] = posrY;
            posArray[ k + k2 + 2 ] = posrZ;
            posArray[ k + k2 + 3 ] = w;
        }

        // 移動する方向はとりあえずランダムに決めてみる。
        // これでランダムな方向にとぶパーティクルが出来上がるはず。
        var rrr = 0.0001;
        var velX = (Math.random()*2.-1.0)*rrr;
        var velY = (Math.random()*2.-1.0)*rrr;
        var velZ = (Math.random()*2.-1.0)*rrr - 0.03;

        w = Math.random();

        for( var k2 = 0; k2 < 4*3*12; k2 += 4 ){
            velArray[ k + k2+0 ] = velX;
            velArray[ k + k2+1 ] = velY;
            velArray[ k + k2+2 ] = velZ;
            velArray[ k + k2+3 ] = w;
        }
    }

    // for ( var k = 0, kl = posArray.length; k < kl; k += 4*3 ) {
    //     // Position
    //     var x, y, z;
    //     var posrX = Math.random()* 6.- 3.;
    //     var posrY = Math.random()* 6.- 3.;
    //     var posrZ = Math.random()* 6.- 3.;
    //     var w = Math.random()*10.0;
    //
    //     // posArrayの実態は一次元配列なので
    //     // x,y,z,wの順番に埋めていく。
    //     // wは今回は使用しないが、配列の順番などを埋めておくといろいろ使えて便利
    //     posArray[ k + 0 ] = posrX;
    //     posArray[ k + 1 ] = posrY;
    //     posArray[ k + 2 ] = posrZ;
    //     posArray[ k + 3 ] = w;
    //
    //     posArray[ k + 4 ] = posrX;
    //     posArray[ k + 5 ] = posrY;
    //     posArray[ k + 6 ] = posrZ;
    //     posArray[ k + 7 ] = w;
    //
    //     posArray[ k + 8 ] = posrX;
    //     posArray[ k + 9 ] = posrY;
    //     posArray[ k + 10 ] = posrZ;
    //     posArray[ k + 11 ] = w;
    //
    //     // 移動する方向はとりあえずランダムに決めてみる。
    //     // これでランダムな方向にとぶパーティクルが出来上がるはず。
    //     var velX = Math.random() - 0.5;
    //     var velY = Math.random() - 0.5;
    //     var velZ = Math.random() - 0.5;
    //
    //     w = 0.5+Math.random()*0.5;
    //
    //     velArray[ k + 0 ] = velX;
    //     velArray[ k + 1 ] = velY;
    //     velArray[ k + 2 ] = velZ;
    //     velArray[ k + 3 ] = w;
    //
    //     velArray[ k + 4 ] = velX;
    //     velArray[ k + 5 ] = velY;
    //     velArray[ k + 6 ] = velZ;
    //     velArray[ k + 7 ] = w;
    //
    //     velArray[ k + 8 ] = velX;
    //     velArray[ k + 9 ] = velY;
    //     velArray[ k + 10 ] = velZ;
    //     velArray[ k + 11 ] = w;
    //
    // }

}


function getCameraConstant( camera ) {
    return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}


function render() {

    helper.animate( clock.getDelta() );

    // Render onto our off-screen texture
    renderer.render(bufferScene, camera, bufferTexture);

    if( uniforms2 ){
        uniforms2.texture1.value = bufferTexture.texture;
    }

    gpuCompute.compute();

    velocityVariable.material.uniforms.time.value += 1/60;
    positionVariable.material.uniforms.time.value += 1/60;

    velocityVariable.material.uniforms.texture1.value = bufferTexture.texture;
    positionVariable.material.uniforms.texture1.value = bufferTexture.texture;

    particleUniforms2.texture1.value = bufferTexture.texture;
    particleUniforms2.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    particleUniforms2.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

    // renderer.setMode( _gl.POINTS );
    renderer.render( scene, camera );

}