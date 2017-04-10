
const threeApp = require('./lib/createThree');

const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');

let soundCloudTexture;
import {SoundCloud} from './lib/SoundCloud.js';
const soundCloud = new SoundCloud();
// soundCloud.init("https://soundcloud.com/aoki-1/sswb-aoki-takamasa-remix-excerpt",
soundCloud.init("https://soundcloud.com/gradesofficial/king-chris-lake-remix",
    (menuElement, debugCanvas) => {
        document.body.appendChild( menuElement );
        document.body.appendChild( debugCanvas );

        soundCloudTexture = new THREE.DataTexture(soundCloud.getBytes(), 8, 8, THREE.RGBFormat );
        soundCloudTexture.needsUpdate = true;
        window.soundCloudTexture = soundCloudTexture;

        soundCloud.setPoint("low",32);
        soundCloud.setPoint("high",13);

        // soundCloud.debugShow();

        soundCloud.play();
        window.soundCloud = soundCloud;
    }
);

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


var motionObj;
var mesh;
var helper;
var clock = new THREE.Clock();

// Texture width for simulation (each texel is a debris particle)
var WIDTH = 36*20;

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

    // camera.position.z = 1.5;
    // camera.position.x = -1;
    // camera.position.y = 1.0;
    // camera.lookAt(new THREE.Vector3(0,0.4,0));
    camera.position.z = -2.0;
    camera.position.x = .0;
    camera.position.y = 0.3;
    camera.lookAt(new THREE.Vector3(0,0.3,0));


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
    var light = new THREE.PointLight(0xffffff,1.0,100,100);
    light.position.set(0,0.8,-2);
    // light.position.set(camera.position);
    scene.add(light);

    var light2 = new THREE.DirectionalLight( 0xFFFFFF );
    console.log(light2.position)
    // var helper = new THREE.DirectionalLightHelper( light2, 5 );
    scene.add( light2 );




    // make particle

    var particleGeometry = new THREE.BufferGeometry();
    var particlePositions = new Float32Array( PARTICLES * 3 );

    var ww = 0.002;
    var hh = 0.002;
    var zz = 0.002;

    var BOX_ARRAY = [
        0.0, -1.0,-1.0,
        0.0, 1.0, 0.0,
        0.866025, -1.0, 0.5,

        0.866025, -1.0, 0.5,
        0.0, 1.0, 0.0,
        -0.866025, -1.0, 0.5,

        -0.866025, -1.0, 0.5,
        0.0, 1.0, 0.0,
        0.0, -1.0,-1.0,

        0.0, -1.0,-1.0,
        0.866025, -1.0, 0.5,
        -0.866025, -1.0, 0.5,

        // // Front face
        // -1.0, -1.0,  1.0,
        // 1.0, -1.0,  1.0,
        // 1.0,  1.0,  1.0,
        //
        // -1.0, -1.0,  1.0,
        // 1.0,  1.0,  1.0,
        // -1.0,  1.0,  1.0,
        //
        // // Back face
        // -1.0, -1.0,  -1.0,
        // 1.0, -1.0,  -1.0,
        // 1.0,  1.0,  -1.0,
        //
        // -1.0, -1.0,  -1.0,
        // 1.0,  1.0,  -1.0,
        // -1.0,  1.0,  -1.0,
        //
        // // Top face
        // -1.0,  1.0, -1.0,
        // -1.0,  1.0,  1.0,
        // 1.0,  1.0,  1.0,
        //
        // -1.0,  1.0, -1.0,
        // 1.0,  1.0,  1.0,
        // 1.0,  1.0, -1.0,
        //
        // // Bottom face
        // -1.0,  -1.0, -1.0,
        // -1.0,  -1.0,  1.0,
        // 1.0,  -1.0,  1.0,
        //
        // -1.0,  -1.0, -1.0,
        // 1.0,  -1.0,  1.0,
        // 1.0,  -1.0, -1.0,
        //
        //
        // // Right face
        // 1.0, -1.0, -1.0,
        // 1.0,  1.0, -1.0,
        // 1.0,  1.0,  1.0,
        //
        // 1.0, -1.0, -1.0,
        // 1.0,  1.0,  1.0,
        // 1.0, -1.0,  1.0,
        //
        // // Left face
        // -1.0, -1.0, -1.0,
        // -1.0,  1.0, -1.0,
        // -1.0,  1.0,  1.0,
        //
        // -1.0, -1.0, -1.0,
        // -1.0,  1.0,  1.0,
        // -1.0, -1.0,  1.0,
    ];

    var randomSize;
    var randomSizeH;
    var ccc = 0;
    for ( var i = 0; i < PARTICLES * 3; i+= 3 * 3 * 4 ) {
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
        {},
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
    const BODY_NUM = 36*90;
    var bodyGeometry = new THREE.BufferGeometry();
    var bodyPositions = new Float32Array( BODY_NUM * 3 );

    var ww = 0.04;
    var hh = 0.04;
    var zz = 0.04;

    /*
    0.0, -1.0,-1.0,
    0.0, 1.0, 0.0,
    0.866025, -1.0, 0.5,
    -0.866025, -1.0, 0.5,
     */

    var BOX_ARRAY = [
        0.0, -1.0,-1.0,
        0.0, 1.0, 0.0,
        0.866025, -1.0, 0.5,

        0.866025, -1.0, 0.5,
        0.0, 1.0, 0.0,
        -0.866025, -1.0, 0.5,

        -0.866025, -1.0, 0.5,
        0.0, 1.0, 0.0,
        0.0, -1.0,-1.0,

        0.0, -1.0,-1.0,
        0.866025, -1.0, 0.5,
        -0.866025, -1.0, 0.5,
    ];

    var randomSize;
    // var randomSizeH;
    for ( var i = 0; i < BODY_NUM * 3; i+= 3 * 3 * 4 ) {
        randomSize  = 0.8+(i%22==0?1.0:0.0);//Math.random()*3.0-1.0;
        // randomSizeH = (Math.random()+Math.random()+Math.random()+Math.random()+Math.random())/5.0;
        for( var k = 0; k < 3*3*12; k+=3 ){
            bodyPositions[i + k + 0] = BOX_ARRAY[k+0]*ww*randomSize;// * randomSize*2.;//*randomSize*40.0;
            bodyPositions[i + k + 1] = BOX_ARRAY[k+1]*ww*randomSize;// * randomSizeH*3.;//*randomSize*40.0;
            bodyPositions[i + k + 2] = BOX_ARRAY[k+2]*ww*randomSize;// * randomSizeH*2.;//*randomSizeH*50.0;
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

    var bodyRotation = new Float32Array( BODY_NUM * 3 );
    for ( var i = 0; i < BODY_NUM * 3; i+= 3 ) {
        bodyRotation[i+0] = Math.random()*2.0-1.0;
        bodyRotation[i+1] = Math.random()*2.0-1.0;
        bodyRotation[i+2] = Math.random()*2.0-1.0;
    }

    var bodyIndex = new Float32Array( BODY_NUM );
    for ( var i = 0; i < BODY_NUM ; i++ ) {
        bodyIndex[i] = i;
    }

    bodyGeometry.addAttribute( 'position', new THREE.BufferAttribute( bodyPositions, 3 ) );
    bodyGeometry.addAttribute( 'uv', new THREE.BufferAttribute( bodyUVs, 2 ) );
    bodyGeometry.addAttribute( 'bodyRotation', new THREE.BufferAttribute( bodyRotation, 3 ) );
    bodyGeometry.addAttribute( 'bodyIndex', new THREE.BufferAttribute( bodyIndex, 1 ) );


    bodyUniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            texture1:            { type: "t", value: null },
            soundCloudTexture:   { type: "t", value: null },
            soundCloudHigh : { type: "f", value: 0 }, // single float
            soundCloudLow : { type: "f",  value: 0 }, // single float
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
        // linewidth : 5,
    });

    bodyMaterial.extensions.derivatives = true;
    bodyMaterial.extensions.drawBuffers = true;


    var bodyMarticles = new THREE.Mesh( bodyGeometry, bodyMaterial );
    // var bodyMarticles2 = new THREE.Line( bodyGeometry, bodyMaterial );
    bodyMarticles.matrixAutoUpdate = false;
    bodyMarticles.updateMatrix();
    scene.add( bodyMarticles );
    // scene.add( bodyMarticles2 );

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

    //https://bowlroll.net/file/23365
    var modelFile = 'models/mmd/miku/ki1.pmd';
    // var modelFile = 'models/mmd/miku/miku_v2.pmd';
    // var vmdFiles = [ 'models/mmd/vmds/wavefile_v2.vmd' ];
    // var vmdFiles = [ 'models/mmd/vmds/dance.vmd' ];
    // var vmdFiles = [ 'models/mmd/vmds/dance2.vmd', 'models/mmd/vmds/dance.vmd' ];

    helper = new THREE.MMDHelper();

    var loader = new THREE.MMDLoader();
    loader.loadModel( modelFile, function ( mmdMesh ) {

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
        window.mmdMesh = mmdMesh;

        mesh = mmdMesh;
        mesh.scale.set(0.4,0.4,0.4);
        // mesh.position.y = -12;

        //scene.add( mesh );
        bufferScene.add( mesh );

        helper.add( mesh );
        // helper.setAnimation( mesh );


        // window.mmdMesh.mixer.timeScale = 1.14814814815;

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
        // // var box1 = new THREE.Points(mmdMesh.geometry, shaderMaterial)
        // var box1 = new THREE.Mesh(mmdMesh.geometry, shaderMaterial)
        // // var box1 = new THREE.Line(mmdMesh.geometry, shaderMaterial)
        // scene.add(box1);
        //debug ==================================================




        var vmdFiles = [
            {name: 'dance1', file: 'models/mmd/vmds/dance.vmd'},
            {name: 'dance2', file: 'models/mmd/vmds/dance2.vmd'},
        ];

        var vmdIndex = 0;
        var loadVmd = function () {
            var vmdFile = vmdFiles[vmdIndex].file;
            loader.loadVmd(vmdFile, function (vmd) {
                loader.createAnimation(mmdMesh, vmd, vmdFiles[vmdIndex].name);
                vmdIndex++;
                if (vmdIndex < vmdFiles.length) {
                    loadVmd();
                } else {
                    helper.setAnimation(mesh);

                    mesh.mixer.stopAllAction();


                    motionObj = {};
                    for (var i = 0; i < mesh.geometry.animations.length; ++i) {
                        var clip = mesh.geometry.animations[i];
                        var action = mesh.mixer.clipAction(clip);
                        motionObj[mesh.geometry.animations[i].name] = {
                            action: action,
                            weight: 0
                        }
                    }
                    window.motionObj = motionObj;

                    // helper.setPhysics(mesh);
                    // helper.unifyAnimationDuration({afterglow: 1.0});

                    // console.log(mesh.geometry.animations.length);

                    initGui();

                }
            }, onProgress, onError);
        };
        loadVmd();








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
        var w = count;//Math.random()*9000;

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
    soundCloud.update();

    if( motionObj ){
        for( var key in motionObj ){
            if( key == window.animationState ){
                motionObj[key].weight += ( 1 - motionObj[key].weight )/3;
            }else{
                motionObj[key].weight += ( 0 - motionObj[key].weight )/3;
            }
            motionObj[key].action.weight = motionObj[key].weight;
        }
    }

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

    if( soundCloudTexture ) {
        soundCloudTexture.image.data = soundCloud.getBytes();
        soundCloudTexture.needsUpdate = true;
        bodyUniforms.soundCloudTexture.value = soundCloudTexture;
        bodyUniforms.soundCloudHigh.value = 1.0;//soundCloud.getGain("high");
        bodyUniforms.soundCloudLow.value = 0.5+( Math.pow(soundCloud.getGain("low"), 3)*0.00000001);
    }


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


var changeAnimation = function (name, loop) {
    var clip, action;

    for (var i = 0; i < mesh.geometry.animations.length; ++i) {
        if (mesh.geometry.animations[i].name === name) {
            clip = mesh.geometry.animations[i];
            action = mesh.mixer.clipAction(clip);
        }
    }

    if (loop) {
        action.repetitions = 'Infinity';
    } else {
        action.repetitions = 0;
    }

    // mesh.mixer.stopAllAction();
    action.play();
};
window.changeAnimation = changeAnimation;

window.animationState = "dance1";

