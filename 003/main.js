const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const particleFragmentShader = glsl.file('./shader/particleFragmentShader.frag');
const particleVertexShader = glsl.file('./shader/particleVertexShader.vert');
const computeShaderPosition = glsl.file('./shader/computeShaderPosition.frag');
const computeShaderVelocity = glsl.file('./shader/computeShaderVelocity.vert');


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
var material;

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

    var ww = 0.7;
    var hh = 0.1;
    var zz = 0.1;

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
    for ( var i = 0; i < PARTICLES * 3; i+= 3 * 3 * 12 ) {
        randomSize = 0.01 + Math.random()*2.0;
        randomSizeH = 0.01 + Math.random()*2.0;
        for( var k = 0; k < 3*3*12; k+=3 ){
            positions[i + k + 0] = BOX_ARRAY[k+0]*ww*randomSize*randomSize*randomSize;
            positions[i + k + 1] = BOX_ARRAY[k+1]*hh*randomSizeH*randomSizeH*randomSizeH;
            positions[i + k + 2] = BOX_ARRAY[k+2]*zz;
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

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

    particleUniforms = {
        texturePosition: { value: null },
        textureVelocity: { value: null },
        cameraConstant: { value: getCameraConstant( camera ) },
        invMatrix: { value: new THREE.Matrix4() },
    };

    // Create light
    var light = new THREE.PointLight(0xffffff, 1.0);
    // We want it to be very close to our character
    light.position.set(0,0,0);
    scene.add(light);

    var obj = THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        particleUniforms,
    ]);

    // ShaderMaterial
    material = new THREE.ShaderMaterial( {
        uniforms: obj,
        // uniforms:particleUniforms,
        vertexShader:   particleVertexShader,
        fragmentShader: particleFragmentShader,
        side:           THREE.DoubleSide,
        vertexColors: THREE.VertexColors,
        transparent: true,
        lights: true,
    } );
    material.extensions.derivatives = true;
    material.extensions.drawBuffers = true;

    // var particles0 = new THREE.Points( geometry, material );
    // particles0.matrixAutoUpdate = false;
    // particles0.updateMatrix();
    // scene.add( particles0 );

    var particles = new THREE.Mesh( geometry, material );
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();
    scene.add( particles );

    var m = new THREE.Matrix4();
    m.copy( particles.matrixWorld );
    m.multiply( camera.matrixWorldInverse );
    var i = new THREE.Matrix4().getInverse( m );
    material.uniforms.invMatrix.value = i;

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

    var count = 0;
    for ( var k = 0, kl = posArray.length; k < kl; k += 4*3*12 ) {
        count++;
        // console.log("num",count)
        // Position
        var x, y, z;
        var posrX = Math.random()*200 - 100;
        var posrY = Math.random()*200 - 100;
        var posrZ = Math.random()*200 - 100;
        var w = Math.random()*1.0 > 0.5?1.0:0.0;

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
        var velX = 0.1;//(Math.random()*1.0);
        var velY = 0.;//(Math.random()*2.0);
        var velZ = 0.;//(Math.random()*2.0);

        w = 0.5+Math.random()*0.5;

        for( var k2 = 0; k2 < 4*3*12; k2 += 4 ){
            velArray[ k + k2+0 ] = posrX;
            velArray[ k + k2+1 ] = posrY;
            velArray[ k + k2+2 ] = posrZ;
            velArray[ k + k2+3 ] = w;
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





    material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
    material.uniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

    renderer.render( scene, camera );





}