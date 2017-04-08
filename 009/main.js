
const threeApp = require('./lib/createThree');

const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');


const mmdSaveToTextureFrag = glsl.file('./shader/mmdSaveToTexture.frag');
const mmdSaveToTextureVert = glsl.file('./shader/mmdSaveToTexture.vert');

const debugMMDFrag = glsl.file('./shader/debugMMD.frag');
const debugMMDVert = glsl.file('./shader/debugMMD.vert');

const particleFragmentShader = glsl.file('./shader/particleFragmentShader.frag');
const particleVertexShader = glsl.file('./shader/particleVertexShader.vert');

const bodyFragmentShader = glsl.file('./shader/bodyFragmentShader.frag');
const bodyVertexShader = glsl.file('./shader/bodyVertexShader.vert');

const computeShaderPosition     = glsl.file('./shader/computeShaderPosition.frag');
const computeShaderVelocity     = glsl.file('./shader/computeShaderVelocity.frag');
const computeShaderAcceleration = glsl.file('./shader/computeShaderAcceleration.frag');


//for debug
window.scene = scene;
window.THREE = THREE;


var mesh;
var helper;
var clock = new THREE.Clock();

// Texture width for simulation (each texel is a debris particle)
var WIDTH = 36*10;

var geometry;
var PARTICLES = WIDTH * WIDTH;

var gpuCompute;
var velocityVariable;
var positionVariable;
var accelerationVariable;

var positionUniforms;
var velocityUniforms;
var accelerationUniforms;

var particleUniforms;
var bodyUniforms;

var dtDance;


var gridHelper = new THREE.PolarGridHelper( 1, 1 );
scene.add( gridHelper );

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
var bufferTexture2 = new THREE.WebGLRenderTarget(
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

    camera.position.z = 1.5;
    camera.position.x = -1;
    camera.position.y = 1.0;
    camera.lookAt(new THREE.Vector3(0,0.4,0));


    initComputeRenderer();

    initProtoplanets();
}

function initComputeRenderer() {

    gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

    var dtPosition = gpuCompute.createTexture();
    var dtVelocity = gpuCompute.createTexture();
    var dtAcceleration = gpuCompute.createTexture();

    fillTextures( dtPosition, dtVelocity, dtAcceleration );

    velocityVariable     = gpuCompute.addVariable( "textureVelocity",     computeShaderVelocity,     dtVelocity     );
    positionVariable     = gpuCompute.addVariable( "texturePosition",     computeShaderPosition,     dtPosition     );
    accelerationVariable = gpuCompute.addVariable( "textureAcceleration", computeShaderAcceleration, dtAcceleration );

    // danceVariable    = gpuCompute.addVariable( "textureDance"   , computeShaderDance   , dtDance    );

    gpuCompute.setVariableDependencies( velocityVariable,     [ positionVariable, velocityVariable, accelerationVariable ] );
    gpuCompute.setVariableDependencies( positionVariable,     [ positionVariable, velocityVariable, accelerationVariable ] );
    gpuCompute.setVariableDependencies( accelerationVariable, [ positionVariable, velocityVariable, accelerationVariable ] );
    // gpuCompute.setVariableDependencies( danceVariable   , [ positionVariable, velocityVariable, danceVariable ] );

    positionUniforms     = positionVariable.material.uniforms;
    velocityUniforms     = velocityVariable.material.uniforms;
    accelerationUniforms = accelerationVariable.material.uniforms;
    //danceUniforms    = danceVariable.material.uniforms;

    positionVariable.material.uniforms.time = {
        value:0
    };

    velocityVariable.material.uniforms.time = {
        value:0
    };

    accelerationVariable.material.uniforms.time = {
        value:0
    };

    positionVariable.material.uniforms.texture1     = { type: "t", value: null };
    velocityVariable.material.uniforms.texture1     = { type: "t", value: null };
    accelerationVariable.material.uniforms.texture1 = { type: "t", value: null };
    accelerationVariable.material.uniforms.texture2 = { type: "t", value: null };

    // danceVariable.material.uniforms.time = {
    //     value:0
    // };

    gpuCompute.init();

}


function initProtoplanets() {


    // var debugMaterial = new THREE.MeshBasicMaterial({map:bufferTexture.texture});
    // var plane1 = new THREE.PlaneBufferGeometry( 1,1);
    // var planeObject1 = new THREE.Mesh(plane1,debugMaterial);
    // planeObject1.position.x = 1.5;
    // planeObject1.position.y = 1.0;
    // scene.add(planeObject1);
    //
    // var debugMaterial2 = new THREE.MeshBasicMaterial({map:bufferTexture2.texture});
    // var plane2 = new THREE.PlaneBufferGeometry( 1,1);
    // var planeObject2 = new THREE.Mesh(plane2,debugMaterial2);
    // planeObject2.position.x = 2.9;
    // planeObject2.position.y = 1.0;
    // scene.add(planeObject2);



    // Create light
    var light = new THREE.PointLight(0xffffff, 1.0);
    light.position.set(1,1,1);
    scene.add(light);



    // make particle

    var particleGeometry = new THREE.BufferGeometry();
    var particlePositions = new Float32Array( PARTICLES * 3 );

    var ww = 0.001;
    var hh = 0.001;
    var zz = 0.001;

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
        randomSize = 0.1 + Math.random()*2.0;
        randomSizeH = 0.1 + Math.random()*2.0;

        for( var k = 0; k < 3*3*12; k+=3 ){
            particlePositions[i + k + 0] = BOX_ARRAY[k+0]*ww*randomSize*randomSize*randomSize;
            particlePositions[i + k + 1] = BOX_ARRAY[k+1]*hh*randomSizeH*randomSize*randomSizeH;
            particlePositions[i + k + 2] = BOX_ARRAY[k+2]*zz*randomSizeH*randomSizeH*randomSizeH;
            //positions[i + k + 2] = BOX_ARRAY[k+2]*zz*3.;//randomSizeH*randomSizeH*randomSizeH;
            // console.log(i,i + k)
        }

    }


    var particleUVs = new Float32Array( PARTICLES * 2 );
    var p = 0;
    for ( var j = 0; j < WIDTH; j++ ) {
        for ( var i = 0; i < WIDTH; i++ ) {
            particleUVs[ p++ ] = i / ( WIDTH - 1 );
            particleUVs[ p++ ] = j / ( WIDTH - 1 );
        }
    }

    var particleIndexs = new Float32Array( PARTICLES );
    for ( var i = 0; i < PARTICLES ; i++ ) {
        particleIndexs[i] = i;
    }

    particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ) );
    particleGeometry.addAttribute( 'uv',       new THREE.BufferAttribute( particleUVs, 2 ) );
    particleGeometry.addAttribute( 'index2',   new THREE.BufferAttribute( particleIndexs, 1 ) );

    particleUniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            texture1: { type: "t", value: null },
            texturePosition:     { value: null },
            textureVelocity:     { value: null },
            textureAcceleration: { value: null },
            cameraConstant: { value: getCameraConstant( camera ) },
            invMatrix: { value: new THREE.Matrix4() },
        },
    ]);

    // // ShaderMaterial
    var particleMaterial = new THREE.ShaderMaterial( {
        uniforms:       particleUniforms,
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        side:           THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        transparent: true,
        lights: true,
    } );

    particleMaterial.extensions.derivatives = true;
    particleMaterial.extensions.drawBuffers = true;

    var particles = new THREE.Mesh( particleGeometry, particleMaterial );
    // var particles = new THREE.Line( particleGeometry, particleMaterial );
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();
    scene.add( particles );

    var m = new THREE.Matrix4();
    m.copy( particles.matrixWorld );
    m.multiply( camera.matrixWorldInverse );
    var i = new THREE.Matrix4().getInverse( m );
    particleMaterial.uniforms.invMatrix.value = i;















    // make particle
    const BODY_NUM = 36*2000;
    var bodyGeometry = new THREE.BufferGeometry();
    var bodyPositions = new Float32Array( BODY_NUM * 3 );

    var ww = 0.005;
    var hh = 0.01;
    var zz = 0.005;

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
    for ( var i = 0; i < BODY_NUM * 3; i+= 3 * 3 * 12 ) {
        randomSize = (Math.random()+Math.random()+Math.random()+Math.random()+Math.random())/5.0;
        randomSizeH = 1.0 + Math.random()*2.0;
        for( var k = 0; k < 3*3*12; k+=3 ){
            bodyPositions[i + k + 0] = BOX_ARRAY[k+0]*ww*randomSizeH*1.0;
            bodyPositions[i + k + 1] = BOX_ARRAY[k+1]*hh*(randomSizeH/2.0);
            bodyPositions[i + k + 2] = BOX_ARRAY[k+2]*zz*randomSize*4.0;
        }
    }

    var bodyUVs = new Float32Array( BODY_NUM * 2 );
    var p = 0;
    for ( var j = 0; j < WIDTH; j++ ) {
        for ( var i = 0; i < WIDTH; i++ ) {
            bodyUVs[ p++ ] = i / ( WIDTH - 1 );
            bodyUVs[ p++ ] = j / ( WIDTH - 1 );
        }
    }

    var bodyIndex = new Float32Array( BODY_NUM );
    for ( var i = 0; i < BODY_NUM ; i++ ) {
        bodyIndex[i] = i;
    }

    bodyGeometry.addAttribute( 'position', new THREE.BufferAttribute( bodyPositions, 3 ) );
    bodyGeometry.addAttribute( 'uv', new THREE.BufferAttribute( bodyUVs, 2 ) );
    bodyGeometry.addAttribute( 'bodyIndex', new THREE.BufferAttribute( bodyIndex, 1 ) );


    bodyUniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            texture1: { type: "t", value: null },
            texturePosition:     { value: null },
            textureVelocity:     { value: null },
            textureAcceleration: { value: null },
            cameraConstant: { value: getCameraConstant( camera ) },
            invMatrix: { value: new THREE.Matrix4() },
        }
    ]);

    // // ShaderMaterial
    var bodyMaterial = new THREE.ShaderMaterial( {
        uniforms:       bodyUniforms,
        vertexShader:   bodyVertexShader,
        fragmentShader: bodyFragmentShader,
        side:           THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        transparent: true,
        lights: true,
    });

    bodyMaterial.extensions.derivatives = true;
    bodyMaterial.extensions.drawBuffers = true;

    var bodyMarticles = new THREE.Mesh( bodyGeometry, bodyMaterial );
    bodyMarticles.matrixAutoUpdate = false;
    bodyMarticles.updateMatrix();
    scene.add( bodyMarticles );

    var m = new THREE.Matrix4();
    m.copy( bodyMarticles.matrixWorld );
    m.multiply( camera.matrixWorldInverse );
    var i = new THREE.Matrix4().getInverse( m );
    bodyMaterial.uniforms.invMatrix.value = i;































    // model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };

    var modelFile = 'models/mmd/miku/kyozai.pmx';
    var vmdFiles = [ 'models/mmd/vmds/wavefile_v2.vmd' ];

    helper = new THREE.MMDHelper();

    var loader = new THREE.MMDLoader();
    loader.load( modelFile, vmdFiles, function ( mmdMesh ) {

        // console.log(mmdMesh)

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
        mesh.scale.set(0.4,0.4,0.4);
        // mesh.position.y = -12;

        //scene.add( mesh );
        bufferScene.add( mesh );

        helper.add( mesh );
        helper.setAnimation( mesh );



        //debug ==================================================
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
        // // var mat22 = new THREE.MeshBasicMaterial( { color: 0xffaa00} );
        // // var mat33 = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading, });
        //
        // var box1 = new THREE.Points(mmdMesh.geometry, shaderMaterial)
        // // var box1 = new THREE.Mesh(mmdMesh.geometry, shaderMaterial)
        // // var box1 = new THREE.Line(mmdMesh.geometry, shaderMaterial)
        // scene.add(box1);
        //debug ==================================================


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

function fillTextures( texturePosition, textureVelocity, textureAcceleration ) {

    var posArray   = texturePosition.image.data;
    var velArray   = textureVelocity.image.data;
    var accArray   = textureAcceleration.image.data;

    console.log("pos",posArray.length)
    console.log("vel",velArray.length)

    var count = 0;
    for ( var k = 0, kl = posArray.length; k < kl; k += 4*3*12 ) {
        count++;
        // console.log("num",count)
        // Position
        var x, y, z;
        var posrX = Math.random() - .5;
        var posrY = Math.random() + 0.3;// - .5;
        var posrZ = Math.random() - 0.5;
        var w = Math.random()*23000;

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
        var velX = 0;
        var velY = 0;
        var velZ = 0;

        w = Math.random();

        for( var k2 = 0; k2 < 4*3*12; k2 += 4 ){
            velArray[ k + k2+0 ] = velX;
            velArray[ k + k2+1 ] = velY;
            velArray[ k + k2+2 ] = velZ;
            velArray[ k + k2+3 ] = w;
        }


        var accX = Math.random() * 0.0001 - 0.00005;
        var accY = -0.001;//-0.0001 - Math.random()*0.001;
        var accZ = Math.random() * 0.0001 - 0.00005 - 0.0005;

        for( var k2 = 0; k2 < 4*3*12; k2 += 4 ){
            accArray[ k + k2+0 ] = accX;
            accArray[ k + k2+1 ] = accY;
            accArray[ k + k2+2 ] = accZ;
            accArray[ k + k2+3 ] = 0.0;
        }

    }


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
    // draw mmd skinned mesh data to bufferTexture
    renderer.render(bufferScene, camera, bufferTexture);

    if( uniforms2 ){
        // pass to DebugMMD shader ?
        uniforms2.texture1.value = bufferTexture.texture;
    }

    gpuCompute.compute();

    velocityVariable.material.uniforms.time.value     += 1/60;
    positionVariable.material.uniforms.time.value     += 1/60;
    accelerationVariable.material.uniforms.time.value += 1/60;

    //pass mmd skineed mesh data to computeShaderVelocity shader to calculate particle velocity
    velocityVariable.material.uniforms.texture1.value = bufferTexture.texture;
    //pass mmd skineed mesh data to computeShaderVelocity shader to calculate particle position
    positionVariable.material.uniforms.texture1.value = bufferTexture.texture;

    accelerationVariable.material.uniforms.texture1.value = bufferTexture.texture;
    accelerationVariable.material.uniforms.texture2.value = bufferTexture2.texture;

    //pass mmd skineed mesh data to particle shader to calculate final particle position
    particleUniforms.texture1.value = bufferTexture.texture;
    bodyUniforms.texture1.value = bufferTexture.texture;



    /* getCurrentRenderTarget function would pass the previous position to myself, then calculating next position using the previous position */
    //pass calculated particle velocity to partticle shader
    particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;

    //pass calculated particle position to partticle shader
    particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

    particleUniforms.textureAcceleration.value = gpuCompute.getCurrentRenderTarget( accelerationVariable ).texture;


    bodyUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    bodyUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;
    bodyUniforms.textureAcceleration.value = gpuCompute.getCurrentRenderTarget( accelerationVariable ).texture;




    // renderer.setMode( _gl.POINTS );
    renderer.render( scene, camera );


    renderer.render(bufferScene, camera, bufferTexture2);
}