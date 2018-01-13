const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

var geo = new THREE.BoxGeometry(1,1,1);
var mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })
var matDepth = new THREE.MeshDepthMaterial();
// var box = new THREE.Mesh(geo, mat);
// scene.add(box);

var shaderMaterial =
    new THREE.ShaderMaterial({
        vertexShader:   simpleVert,
        fragmentShader: simpleFrag
    });
// var box1 = new THREE.Mesh(geo, shaderMaterial)


let Params = function () {
    this.f1 = 2.05;
    this.f2 = 0.037;
    this.f3 = 0.018;
};
let params = new Params();
let gui = new dat.GUI();
window._params = params;


gui.add(params, 'f1', 0.0 ,5.0);
gui.add(params, 'f2', 0.0 ,0.1);
gui.add(params, 'f3', 0.0 ,0.1);


for( var i = 0 ; i < 100; i++ ){
    for( var j = 0 ; j < 100; j++ ){
        // for( var j = 0 ; j < 10; j++ ){
            var box1 = new THREE.Mesh(geo, matDepth)
            box1.position.x = parseInt(i%10)*2.0 - 10.0;
            box1.position.y = parseInt(i/10)*2.0 - 10.0;
            box1.position.z = j*1.4 - 1.4*50.0;
            scene.add(box1);
        // }
    }
}


var mainComposer = new THREE.EffectComposer( renderer );

// var ren = new THREE.RenderPass( scene2, camera,null, new THREE.Color().setHex( 0xffffff ) )
let ren = new THREE.RenderPass( scene, camera);
// ren.clear = false;

let width = $(window).width();
let height = $(window).height();
const dpr = Math.min(1.5,window.devicePixelRatio);
mainComposer.addPass( ren );
mainComposer.setSize( width*dpr, height*dpr );

let bokehPass = new THREE.BokehPass( scene, camera, {
    focus: 		0.0,
    aperture:	0.325,
    maxblur:	2.0,
    width: width,
    height: height
} );
mainComposer.addPass(bokehPass);
bokehPass.renderToScreen = true;

// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
//copyShader.clear = false;
// copyShader.renderToScreen = true;
// mainComposer.addPass(copyShader);


render();

function render() {
    requestAnimationFrame(render);

    bokehPass.uniforms['focus'].value    = _params.f1;
    bokehPass.uniforms['aperture'].value = _params.f2;
    bokehPass.uniforms['maxblur'].value  = _params.f3;

    mainComposer.render();
    // renderer.render(scene, camera)
}