const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const particleFragmentShader = glsl.file('./shader/particleFragmentShader.frag');
const particleVertexShader = glsl.file('./shader/particleVertexShader.vert');
const computeShaderPosition = glsl.file('./shader/computeShaderPosition.frag');
const computeShaderVelocity = glsl.file('./shader/computeShaderVelocity.vert');


// Texture width for simulation (each texel is a debris particle)
var WIDTH = 1024

var geometry;
var PARTICLES = WIDTH * WIDTH;

var gpuCompute;
var velocityVariable;
var positionVariable;
var positionUniforms;
var velocityUniforms;
var particleUniforms;


let rl = 0.0;
let tt1 = 1;
let tt2 = 1;
var t1 = 3;
var t2 = 2;
var obj = {
    t1:3,
    t2:2
};


init();
animate();



function init() {

    camera.position.y = 0;
    camera.position.x = 0;
    camera.position.z = -150;
    camera.lookAt(new THREE.Vector3());

    initComputeRenderer();

    initProtoplanets();
}

function initComputeRenderer() {

    gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

    var dtPosition = gpuCompute.createTexture();
    var dtVelocity = gpuCompute.createTexture();

    fillTextures( dtPosition, dtVelocity );

    velocityVariable = gpuCompute.addVariable( "textureVelocity", computeShaderVelocity, dtVelocity );
    positionVariable = gpuCompute.addVariable( "texturePosition", computeShaderPosition, dtPosition );

    gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
    gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

    positionUniforms = positionVariable.material.uniforms;
    velocityUniforms = velocityVariable.material.uniforms;

    positionVariable.material.uniforms.time = {
        value:0
    };

    velocityVariable.material.uniforms.time = {
        value:0
    };

    velocityVariable.material.uniforms.t1 = {
        value:obj.t1
    };

    velocityVariable.material.uniforms.t2 = {
        value:obj.t2
    };


    gpuCompute.init();

}


function initProtoplanets() {

    geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( PARTICLES * 3 );
    console.log("aaaaa",positions.length);

    for ( var i = 0; i < PARTICLES * 3; i+= 3 * 3 ) {
        positions[ i+0 ] = Math.random() * 1;
        positions[ i+1 ] = Math.random() * 1;
        positions[ i+2 ] = Math.random() * 1;

        positions[ i+3 ] = Math.random() * 1;
        positions[ i+4 ] = Math.random() * 1;
        positions[ i+5 ] = Math.random() * 1;

        positions[ i+6 ] = Math.random() * 1;
        positions[ i+7 ] = Math.random() * 1;
        positions[ i+8 ] = Math.random() * 1;
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

    particleUniforms = {
        texturePosition: { value: null },
        textureVelocity: { value: null },
        cameraConstant: { value: getCameraConstant( camera ) },
    };

    // ShaderMaterial
    var material = new THREE.ShaderMaterial( {
        uniforms:       particleUniforms,
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        side:           THREE.DoubleSide,
        transparent: true,
    } );

    material.extensions.drawBuffers = true;

    // var particles0 = new THREE.Points( geometry, material );
    // particles0.matrixAutoUpdate = false;
    // particles0.updateMatrix();
    // scene.add( particles0 );

    var particles = new THREE.Mesh( geometry, material );
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();
    scene.add( particles );

    // var particles2 = new THREE.Line( geometry, material );
    // particles2.matrixAutoUpdate = false;
    // particles2.updateMatrix();
    // scene.add( particles2 );
}

function fillTextures( texturePosition, textureVelocity ) {

    var posArray = texturePosition.image.data;
    var velArray = textureVelocity.image.data;

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
        var velX = 0.1;//(Math.random()*1.0);
        var velY = 0.;//(Math.random()*2.0);
        var velZ = 0.;//(Math.random()*2.0);

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


function render() {

    gpuCompute.compute();

    velocityVariable.material.uniforms.time.value += 1/60;

    obj.t1 += (tt1 - obj.t1 )/2000.0;
    obj.t2 += (tt2 - obj.t2 )/2000.0;

    velocityVariable.material.uniforms.t1.value = obj.t1;
    velocityVariable.material.uniforms.t2.value = obj.t2;

    // t1
    // t2 += (tt2 - t2 )/20.0;
    rl += 1;
    if( rl > 120 ){
        rl = 0;
        tt1 = 1 + Math.random() * 10;
        tt2 = 1 + Math.random() * 10;
    }

    // if( velocityVariable.material.uniforms.t1.value ){
    //     console.log("aaaaaaa",velocityVariable.material.uniforms.t1.value,velocityVariable.material.uniforms.t1)
    //     velocityVariable.material.uniforms.t1.value = t1;
    //     console.log("aaaaaaa",velocityVariable.material.uniforms.t1.value,velocityVariable.material.uniforms.t1)
    //
    // }

    // if( velocityVariable.material.uniforms.t2.value ){
    //     velocityVariable.material.uniforms.t2.value = t2;
    // }





    particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

    renderer.render( scene, camera );





}