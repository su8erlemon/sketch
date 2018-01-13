const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();
// console.log(renderer)

require( "./lib/shaders/CopyShader.js");
require( "./lib/postprocessing/EffectComposer.js");
require( "./lib/postprocessing/RenderPass.js");
require( "./lib/postprocessing/ShaderPass.js");


const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

var geo = new THREE.BoxGeometry(1.0,1.0,1.0);
var mat2 = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 })
var mat = new THREE.MeshDepthMaterial()

var boxDeptj = new THREE.Mesh(new THREE.BoxGeometry(100,100,0.01), mat);
var depthScene = new THREE.Scene();
depthScene.add(boxDeptj);

var tex1 = new THREE.WebGLRenderTarget( 500, 500);
var tex1Composer = new THREE.EffectComposer( renderer, tex1 );
var ren = new THREE.RenderPass( depthScene, camera);
tex1Composer.addPass( ren );

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.clear = false;
copyShader.renderToScreen = true;
tex1Composer.addPass(copyShader);

tex1Composer.render()

var uniforms = {
    mouseX: {type: "f", value: 0},
    mouseY: {type: "f", value: 0},
    xx: {type: "f", value: 0},
    yy: {type: "f", value: 0},
    zz: {type: "f", value: 0},
    texture1:    {type: "t", value: tex1.texture },
    // texture1:    {type: "t", value: THREE.ImageUtils.loadTexture( '1426-normal.jpg' ) },
}

var shaderMaterial =
    new THREE.ShaderMaterial({
        uniforms:uniforms,
        vertexShader:   simpleVert,
        fragmentShader: simpleFrag,
        // wireframe:true
    });
var box1 = new THREE.Mesh(geo, shaderMaterial)
// box1.position.x = 1.5;
scene.add(box1);

var box = new THREE.Mesh(new THREE.BoxGeometry(100,100,0.01), mat2);
scene.add(box);

new THREE.Raycaster

let mouse = {x:0,y:0};

var vector = new THREE.Vector3(0,0,0);
$(window).on( "mousemove", (e)=>{
    // console.log(e.clientX/$(window).width(),e.clientY/$(window).height())
    // mouse.x = (e.clientX/$(window).width()) * 2.0 - 1.0;
    // mouse.y = -(e.clientY/$(window).height()) * 2.0 + 1.0;
    mouse.x = (e.clientX/500) * 2.0 - 1.0;
    mouse.y = -(e.clientY/500) * 2.0 + 1.0;

    
    //projector.unprojectVector( vector, camera );

    // console.log(vector)
});

render();

function render() {

    tex1Composer.render()

    // console.log(mouse,camera.position.z)
    vector.x = mouse.x;
    vector.y = mouse.y;
    vector.z = 0.0;

    vector.unproject(camera);
    
    uniforms[ 'mouseX' ].value = mouse.x;
    uniforms[ 'mouseY' ].value = mouse.y;

    // console.log( (mouse.x + 1.0)/2.0, (mouse.y + 1.0)/2.0);
    uniforms[ 'xx' ].value = vector.x;
    uniforms[ 'yy' ].value = vector.y;
    uniforms[ 'zz' ].value = vector.z;

    // camera.updateMatrix();
    // camera.updateProjectionMatrix()

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}