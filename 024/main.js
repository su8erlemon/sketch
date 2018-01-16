const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');

const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

const RGBShiftShader = require('./lib/RGBShiftShader')
require('./lib/SSAARenderPass.js')



require('./pass/Pass1');
require('./pass/Pass2');


var depthScene = new THREE.Scene();

var geoPlane = new THREE.PlaneGeometry(5,8);
var matPlane = new THREE.MeshBasicMaterial({ 
    map:THREE.ImageUtils.loadTexture( 'test.png' )
})
var matDepth2 = new THREE.MeshDepthMaterial();
matDepth2.side = THREE.DoubleSide;
matPlane.side = THREE.DoubleSide;
var planeDepth = new THREE.Mesh(geoPlane, matDepth2)
var plane = new THREE.Mesh(geoPlane, matPlane)
planeDepth.position.x = plane.position.x = -5;
planeDepth.position.y = plane.position.y = 0;
planeDepth.position.z = plane.position.z = 4.0;

// scene.add(plane);
// depthScene.add(planeDepth);

window.setZ = function( v ){
    planeDepth.position.z = plane.position.z = v;
}

// var geo = new THREE.BoxGeometry(.1,.1,1);
// var mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
// var matDepth = new THREE.MeshDepthMaterial();
// var box99 = new THREE.Mesh(geo, mat);
// scene.add(box99);

// var shaderMaterial =
//     new THREE.ShaderMaterial({
//         vertexShader:   simpleVert,
//         fragmentShader: simpleFrag
    // });
// var box1 = new THREE.Mesh(geo, shaderMaterial)


let Params = function () {
    this.f1 = 572;
    this.f2 = 0.00085;
    this.f3 = 0.0;

    this.lineWidth = 0.1;
};
let params = new Params();
let gui = new dat.GUI();
window._params = params;


gui.add(params, 'f1', 0.0 ,1000.0);
gui.add(params, 'f2', 0.0 ,0.008);
gui.add(params, 'f3', -1.0 ,1.0);
gui.add(params, 'lineWidth', 0.0 ,1.0);

var boxes = [];
var boxes11 = [];

var rl = 1.0;

// var NUM = 25;
// // for( var i = 0 ; i < 100; i++ ){
//     for( var j = 0 ; j < NUM; j++ ){
//         // for( var j = 0 ; j < 10; j++ ){
//             var box1 = new THREE.Mesh(geo, mat)
//             var box11 = new THREE.Mesh(geo, matDepth)
//             box11.position.x = box1.position.x = Math.sin(j*rl)*2.0;// * parseInt(j/10) * 3.0;//parseInt(i%10)*2.0 - 10.0;
//             box11.position.y = box1.position.y = Math.cos(j*rl)*2.0;//parseInt(i/10)*2.0 - 10.0;
//             // boxes[j].position.y = Math.cos(j*rl);
//             box11.position.z = box1.position.z = parseInt(j%25) * 0.8 - 3.0;
//             // box1.rotation.x = 3.14/12*j;
//             // box1.rotation.x = 3.14/8;
//             // box1.rotation.y = 3.14/4*j
//             // scene.add(box1);
//             // depthScene.add(box11);
            

//             // boxes.push(box1);
//             // boxes11.push(box11);
//         // }
//     }
// // }





// //create a material using a basic shader
// // var mat222 = new THREE.ShaderMaterial(BasicShader({
// //     side: THREE.DoubleSide,
// //     diffuse: 0xffffff,
// //     thickness: 0.3
// // }));
// var mat222 = new THREE.LineBasicMaterial({
//     color: 0xffffff, 
//     linewidth: 10,
//     // lineWidth:10,
//     // wireframe: true,
// });
// var matDepth2222 = new THREE.MeshDepthMaterial();

// // mat222.side       = THREE.DoubleSide;
// // matDepth2222.side = THREE.DoubleSide;

// var lineGeometry = new THREE.Geometry();
// // lineGeometry.vertices.push(
// // 	new THREE.Vector3( 0, 0, 0 ),
// // 	new THREE.Vector3( 1, 0, 1 ),
	
// // );
// for( var i = 0; i < 100; i++ ){
//     lineGeometry.vertices.push(
//         new THREE.Vector3( Math.sin(i*0.1), Math.cos(i*0.1),i*0.1-2.0 )
//     );
// }
// var mesh22 = new THREE.Line(lineGeometry, mat222);
// scene.add(mesh22);
// depthScene.add(new THREE.Line(lineGeometry, matDepth2222));


function CustomSinCurve( scale ) {

	THREE.Curve.call( this );

	this.scale = ( scale === undefined ) ? 1 : scale;

}

CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
CustomSinCurve.prototype.constructor = CustomSinCurve;
CustomSinCurve.prototype.getPoint = function ( t ) {

	var tx = Math.cos( 2 * Math.PI * t );
	var ty = Math.sin( 2 * Math.PI * t );
	var tz = 0;

	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

};


for( var i = 0 ; i < 5 ; i ++ ){
    var path = new CustomSinCurve( 2.2-i*1.23 );
    var geometry = new THREE.TubeGeometry( path, 100, .006, 3 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    var matDepth2222 = new THREE.MeshDepthMaterial();
    var depthMesh = new THREE.Mesh( geometry, matDepth2222 );
    depthScene.add( depthMesh );
    depthMesh.position.z = mesh.position.z = 0.3*i;
    // depthMesh.position.y = mesh.position.y = 0.4*i;
    // depthMesh.position.y = mesh.position.y = -0.1*i;
}

for( var i = 0 ; i < 5 ; i ++ ){
// var geometrySphere = new THREE.IcosahedronGeometry( 1.0, 1 );
var geometrySphere = new THREE.TorusKnotGeometry( .5 + i * .5, 0.01, 200, 3 );
var materialS = new THREE.MeshBasicMaterial( { wireframe:false, color: 0xffffff } );
var meshS = new THREE.Mesh( geometrySphere, materialS );
scene.add( meshS );
var matDepth12 = new THREE.MeshDepthMaterial();
// matDepth12.wireframe = true;
var meshD = new THREE.Mesh( geometrySphere, matDepth12 );
depthScene.add( meshD );
}




var mainComposer = new THREE.EffectComposer( renderer );

const SIZE = 1024*2;
// var ren = new THREE.RenderPass( scene2, camera,null, new THREE.Color().setHex( 0xffffff ) )
let ren = new THREE.RenderPass( scene, camera);
// ren.clear = false;

let width = $(window).width();
let height = $(window).height();
const dpr = Math.min(2.0,window.devicePixelRatio);
mainComposer.addPass( ren );
mainComposer.setSize( width*dpr, height*dpr );

// var ssaaRenderPass3 = new THREE.SSAARenderPass( scene, camera );
// ssaaRenderPass3.sampleLevel = 4;
// ssaaRenderPass.renderToScreen = true;
// mainComposer.addPass( ssaaRenderPass3 );



let depthRen = new THREE.RenderPass( depthScene, camera);
var tex1 = new THREE.WebGLRenderTarget( SIZE, SIZE,  { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
var tex1Composer = new THREE.EffectComposer( renderer, tex1);
tex1Composer.addPass( depthRen );
tex1Composer.setSize( width*dpr, height*dpr );

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.clear = false;
copyShader.renderToScreen = true;
tex1Composer.addPass(copyShader);



var tex2 = new THREE.WebGLRenderTarget( SIZE, SIZE,  { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
var tex2Composer = new THREE.EffectComposer( renderer, tex2);
// tex2Composer.addPass( ren );

var ssaaRenderPass = new THREE.SSAARenderPass( scene, camera );
ssaaRenderPass.sampleLevel = 2;
// ssaaRenderPass.renderToScreen = true;
tex2Composer.addPass( ssaaRenderPass );

tex2Composer.setSize( width*dpr, height*dpr );

var copyShader2 = new THREE.ShaderPass(THREE.CopyShader);
copyShader2.renderToScreen = true;
tex2Composer.addPass(copyShader2);


// let bokehPass = new THREE.BokehPass( scene, camera, {
//     focus: 		0.0,
//     aperture:	0.325,
//     maxblur:	2.0,
//     width: width,
//     height: height
// } );
// mainComposer.addPass(bokehPass);
// bokehPass.renderToScreen = true;



var pass1 = new THREE.ShaderPass(THREE.Pass1);
mainComposer.addPass(pass1);
// pass1.renderToScreen = true;

var pass2 = new THREE.ShaderPass(THREE.Pass2);
mainComposer.addPass(pass2);
// pass2.renderToScreen = true;



var rGBShiftShader = new THREE.ShaderPass( THREE.RGBShiftShader );
rGBShiftShader.uniforms[ 'amount' ].value = 0.0014;
mainComposer.addPass( rGBShiftShader );
rGBShiftShader.renderToScreen = true;


function aa(){
    var weight = new Array(10);
    var t = 0.0;
    var d = _params.f1;
    for(var i = 0; i < weight.length; i++){
        var r = 1.0 + 2.0 * i;
        var w = Math.exp(-0.5 * (r * r) / d);
        weight[i] = w;
        if(i > 0){w *= 2.0;}
        t += w;
    }
    for(i = 0; i < weight.length; i++){
        weight[i] /= t;
    }

    
    
    return weight;
}

// var pass2 = new THREE.ShaderPass(THREE.Pass2);
// mainComposer.addPass(pass2);
// pass2.renderToScreen = true;

// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
//copyShader.clear = false;
// copyShader.renderToScreen = true;
// mainComposer.addPass(copyShader);


render();
// render();

function render() {

    rl += 0.001;
    if( rl > 6.28 )rl -= 6.28;

    camera.position.x = 2.379618582068291 * Math.sin(rl);
    camera.position.y = -3.2440919366235637 * Math.cos(rl);
    camera.lookAt(new THREE.Vector3());
    // meshD.rotation.x += 0.01;
    // meshS.rotation.x += 0.01;
    // meshD.position.y = Math.sin(rl)*2.0; 
    // meshS.position.y = Math.sin(rl)*2.0;

    // for( var j = 0 ; j < NUM; j++ ){
    //     // boxes[j].position.z += 0.1;//parseInt(i%10)*2.0 - 10.0;
    //     // boxes11[j].position.z += 0.1;//parseInt(i%10)*2.0 - 10.0;
    //     if( boxes[j].position.z > 20.0 )boxes[j].position.z -= 20.0;
    //     if( boxes11[j].position.z > 20.0 )boxes11[j].position.z -= 20.0;
    // //     // boxes[j].position.y = Math.cos(j*rl);//parseInt(i/10)*2.0 - 10.0;
    // }
    requestAnimationFrame(render);
    // setTimeout( render, 1000);

    tex1Composer.render();
    tex2Composer.render();

    pass1.uniforms.weight.value = aa();
    pass2.uniforms.weight.value = aa();

    pass1.uniforms.v.value = _params.f2;
    pass2.uniforms.v.value = _params.f2;

    pass2.uniforms.v1.value = _params.f3;
    
    pass2.uniforms.tex1.value = tex1.texture;
    pass2.uniforms.normalScene.value = tex2.texture;

    pass2.uniforms.time.value += 0.01;
    
    // mesh22.material.uniforms.thickness.value = _params.lineWidth;
    

    // bokehPass.uniforms['focus'].value    = _params.f1;
    // bokehPass.uniforms['aperture'].value = _params.f2;
    // bokehPass.uniforms['maxblur'].value  = _params.f3;

    mainComposer.render();
    // renderer.render(scene, camera)
}