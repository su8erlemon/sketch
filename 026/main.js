const threeApp = require('./lib/createThree');

require('./lib/shaders/CopyShader');
require('./lib/postprocessing/EffectComposer');
require('./lib/postprocessing/ShaderPass');
require('./lib/postprocessing/SSAARenderPass');
require('./lib/postprocessing/RenderPass');
require('./lib/PostProcessing');
require('./lib/OBJLoader.js');

const { camera, scene, renderer } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');
const simpleFrag2 = glsl.file('./shader/shader2.frag');
const simpleVert2 = glsl.file('./shader/shader2.vert');
const simpleFrag3 = glsl.file('./shader/shader3.frag');
const simpleVert3 = glsl.file('./shader/shader3.vert');

// var phongShader = THREE.ShaderLib.phong;


var dragon1
var dragon2
var dragon3

var loader = new THREE.OBJLoader();

// load a resource
loader.load(
    'stanford-dragon2.obj',
    function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = shaderMaterial;
            }
        } );
        scene.add( object );
        dragon1 = object;
    }
);


var loader1 = new THREE.OBJLoader();

// load a resource
loader1.load(
    'stanford-dragon2.obj',
    function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = shaderMaterial2;
            }
        } );
        scene2.add( object );
        dragon2 = object;
    }
);


var loader2 = new THREE.OBJLoader();

// load a resource
loader2.load(
    'stanford-dragon2.obj',
    function ( object ) {
        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = shaderMaterial3;
            }
        } );
        scene3.add( object );
        dragon3 = object;
    }
);






var lightHelp = new THREE.SphereGeometry(.1,64,64);
var lightHelpMat = new THREE.MeshBasicMaterial({color: 0xffffff})
var lightSphere = new THREE.Mesh(lightHelp, lightHelpMat)
// scene.add( lightSphere );


var geo = new THREE.SphereGeometry(.4,64,64);
// var geo = new THREE.BoxGeometry(1,1,1);
var posY = -0.6

var uniforms = {
    lightDirection: {value: new THREE.Vector3( -1, 1.4, -1.5 )},
    eyeDirection: {value: camera.position},
    color: {value: new THREE.Vector4( (255-100)/255, (255-100)/255, (255-100)/255, 1.0 )},
    time: {value:0.0}
}
var shaderMaterial =
    new THREE.ShaderMaterial({    
        uniforms,
        vertexShader:   simpleVert,
        fragmentShader: simpleFrag,
    });
var box1 = new THREE.Mesh(geo, shaderMaterial)
scene.add(box1);
box1.position.y = posY

var matOutline = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    side: THREE.BackSide
})
var box1outline = new THREE.Mesh(geo, matOutline)
box1outline.scale.set(1.02,1.02,1.02)
box1outline.position.set(0.02,-0.02,0.02)
// scene.add(box1outline);

var matDepth = new THREE.MeshDepthMaterial()
var box2 = new THREE.Mesh(geo, matDepth)
box2.position.x = 2.0
box2.position.z = 2.0
// scene.add(box2);


var tex1 = new THREE.WebGLRenderTarget( 500, 500);
var tex1Composer = new THREE.EffectComposer( renderer, tex1, 0xff0000, 1.0 );

var ssaaRenderPass = new THREE.SSAARenderPass( scene, camera );
ssaaRenderPass.sampleLevel = 2;
tex1Composer.addPass( ssaaRenderPass );

var postShader = new THREE.ShaderPass(THREE.PostProcessing);
postShader.renderToScreen = true;
tex1Composer.addPass(postShader);


var scene2 = new THREE.Scene();
var shaderMaterial2 =
    new THREE.ShaderMaterial({    
        uniforms,
        vertexShader:   simpleVert2,
        fragmentShader: simpleFrag2,
    });
var box12 = new THREE.Mesh(geo, shaderMaterial2)
scene2.add(box12);
box12.position.y = posY
var tex2 = new THREE.WebGLRenderTarget( 500, 500);
var tex2Composer = new THREE.EffectComposer( renderer, tex2, 0xff0000, 1.0 );

var ssaaRenderPass = new THREE.SSAARenderPass( scene2, camera );
ssaaRenderPass.sampleLevel = 2;
// ssaaRenderPass.renderToScreen = true;
tex2Composer.addPass( ssaaRenderPass );



var scene3 = new THREE.Scene();
var shaderMaterial3 =
    new THREE.ShaderMaterial({    
        uniforms,
        vertexShader:   simpleVert3,
        fragmentShader: simpleFrag3,
    });
var box13 = new THREE.Mesh(geo, shaderMaterial3)
scene3.add(box13);
box13.position.y = posY
var tex3 = new THREE.WebGLRenderTarget( 500, 500);
var tex3Composer = new THREE.EffectComposer( renderer, tex3, 0xff0000, 1.0 );
var ssaaRenderPass = new THREE.SSAARenderPass( scene3, camera );
ssaaRenderPass.sampleLevel = 2;
// ssaaRenderPass.renderToScreen = true;
tex3Composer.addPass( ssaaRenderPass );





window.addEventListener('resize', resize);
resize();
function resize() {
    let width = $(window).width();
    let height = $(window).height();
    const dpr = Math.min(1.0,window.devicePixelRatio);
    tex1Composer.setSize( width*dpr, height*dpr );
    tex2Composer.setSize( width*dpr, height*dpr );
    tex3Composer.setSize( width*dpr, height*dpr );
}

var rl = 0.4;

render();

function render() {

    rl += 0.02;
    if( rl > 6.28 )rl -= 6.28;

    uniforms.time.value += 0.03;
    uniforms.lightDirection.value.x = -1.2 * Math.sin(2*rl);
    uniforms.lightDirection.value.y = 1.0;
    uniforms.lightDirection.value.z = -1.2 * Math.cos(2*rl);

    lightSphere.position.x = uniforms.lightDirection.value.x;
    lightSphere.position.y = uniforms.lightDirection.value.y;
    lightSphere.position.z = uniforms.lightDirection.value.z;

    // camera.position.x = -2.0;
    // camera.position.y = 0.5;
    // camera.position.z = 2.0;
    // camera.lookAt(new THREE.Vector3());

    if( dragon1 && dragon2 && dragon3 ){
    //    dragon3.rotation.y += 0.01;
    //    dragon2.rotation.y += 0.01;
    //    dragon1.rotation.y += 0.01;

    //    box13.position.x = 1.2;
    //    box12.position.x = 1.2;
    //    box1.position.x = 1.2;

    //    box13.position.y = .5;
    //    box12.position.y = .5;
    //    box1.position.y = .5;

    //    box13.rotation.y += 0.01;
    //    box12.rotation.y += 0.01;
    //    box1.rotation.y += 0.01;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera)

    tex2Composer.render();
    tex3Composer.render();

    // postShader.uniforms.time.value += 0.01;
    postShader.uniforms.tex1.value = tex2.texture
    postShader.uniforms.tex2.value = tex3.texture

    // postShader.uniforms.tex1.value.wrapS = postShader.uniforms.tex1.value.wrapT = THREE.RepeatWrapping;
    // postShader.uniforms.tex2.value.wrapS = postShader.uniforms.tex2.value.wrapT = THREE.RepeatWrapping;

    tex1Composer.render();    
}