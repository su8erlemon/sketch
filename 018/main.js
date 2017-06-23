const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

import LiquidSphere from './js/LiquidSphere';
import LiquidSphere2 from './js/LiquidSphere2';
import CircleBoxes from './js/CircleBoxes';
import CirclePanels from './js/CirclePanels';
import ThinLines from './js/ThinLines';
import TubeLines from './js/TubeLines';
import SkySphere from './js/SkySphere';
import DelayPass from './js/DelayPass'

let displayObjList = [];


console.log(DelayPass)


let container = new THREE.Group();
scene.add( container );

// let skySphere = new SkySphere();
// skySphere.init( container);
// displayObjList.push(skySphere);


const fog = {
    color: new THREE.Color(0xb0c8d7),
    near: 0.1,
    far: 8.0,
};
scene.fog = new THREE.Fog(fog.color,fog.near,fog.far)

let liquidSphere = new LiquidSphere();
liquidSphere.init( container, fog);
displayObjList.push(liquidSphere);

let liquidSphere2 = new LiquidSphere(true);
liquidSphere2.init( container, fog);
displayObjList.push(liquidSphere2);
// liquidSphere2.container.position.y = -1.0;
// liquidSphere2.container.rotation.x = -1.0;
liquidSphere2.container.rotation.z = 3.14;
//
//
let liquidSphere3 = new LiquidSphere();
liquidSphere3.init( container, fog);
displayObjList.push(liquidSphere3);
liquidSphere3.container.rotation.z = 3.14 + 3.14/2;
// liquidSphere3.container.position.x = 5.0;
// liquidSphere3.container.rotation.y = -1.0;

let liquidSphere4 = new LiquidSphere();
liquidSphere4.init( container, fog);
displayObjList.push(liquidSphere4);
liquidSphere4.container.rotation.z = 3.14/2;
// liquidSphere4.container.position.x = 5.0;
// liquidSphere4.container.rotation.y = -1.0;




let liquidSphere0 = new LiquidSphere2();
liquidSphere0.init( container, fog);
displayObjList.push(liquidSphere0);

let liquidSphere02 = new LiquidSphere2(true);
liquidSphere02.init( container, fog);
displayObjList.push(liquidSphere02);
liquidSphere02.container.rotation.z = 3.14;

// let liquidSphere03 = new LiquidSphere2();
// liquidSphere03.init( container, fog);
// displayObjList.push(liquidSphere03);
// liquidSphere03.container.rotation.z = 3.14 + 3.14/2;


// let liquidSphere04 = new LiquidSphere2();
// liquidSphere04.init( container, fog);
// displayObjList.push(liquidSphere04);
// liquidSphere04.container.rotation.z = 3.14/2;



//
// let circleBoxes = new CircleBoxes({num:40, r:1.5, size:{x:0.1, y:0.1, z:0.1 }});
// circleBoxes.init( container, fog);
// displayObjList.push(circleBoxes);
//
//
// let circleBoxes2 = new CircleBoxes({
//     num:5,
//     r:1.0,
//     size:{x:0.1, y:4., z:0.1 }
// });
// circleBoxes2.init( container, fog);
// displayObjList.push(circleBoxes2);
//
//
// let circleBoxes3 = new CircleBoxes({
//     num:30,
//     r:2.0,
//     size:{x:0.1, y:0.1, z:0.1 }
// });
// circleBoxes3.init( container, fog);
// displayObjList.push(circleBoxes3);
//
//
// let circleBoxes4 = new CircleBoxes({
//     num:10,
//     r:2.8,
//     size:{x:0.8, y:0.8, z:0.03 }
// });
// circleBoxes4.init( container, fog);
// displayObjList.push(circleBoxes4);
//
// let circlePanels = new CirclePanels(
//     1.0,
//     {x:0.1, y:1, z:0.8 }
// );
// circlePanels.init( container, fog);
// displayObjList.push(circlePanels);
//
// let circlePanels2 = new CirclePanels(
//     1.5,
//     {x:0.3, y:0.3, z:0.3 }
// );
// circlePanels2.init( container, fog);
// displayObjList.push(circlePanels2);

//
// let thinLines = new ThinLines();
// thinLines.init( container );
// displayObjList.push(thinLines);
//
//
// let tubeLines = new TubeLines();
// tubeLines.init( container, fog);
// displayObjList.push(tubeLines);
//







var composer = new THREE.EffectComposer( renderer );


var ren = new THREE.RenderPass( scene, camera )
// ren.clear = false;
// ren.clearColor = 0xff0000;
// ren.clearAlpha = 0.4;

composer.addPass( ren );



// var delayShader = new THREE.ShaderPass( THREE.DelayShader );
// // delayShader.clear = false;
// delayShader.needsSwap = true;
// composer.addPass( delayShader );


var RGBShiftShader = new THREE.ShaderPass( THREE.RGBShiftShader );
RGBShiftShader.uniforms[ 'amount' ].value = 0.0010;
composer.addPass( RGBShiftShader );

var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.1,
    20.4,
    0.95
);//1.0, 9, 0.5, 512);
composer.addPass(bloomPass);

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
copyShader.renderToScreen = true;
composer.addPass( copyShader );


var guiData = {
    enableCameraMove:false
};
var gui = new dat.GUI();

bloomPass.threshold = guiData.bloomThreshold = 0.89;//44;
gui.add( guiData, 'bloomThreshold', 0.0, 1.0 ).onChange( function(value) {
    bloomPass.threshold = Number(value);
});
bloomPass.strength = guiData.bloomStrength = 3.;
gui.add( guiData, 'bloomStrength', 0.0, 3.0 ).onChange( function(value) {
    bloomPass.strength = Number(value);
});
bloomPass.radius = guiData.bloomRadius = 0.000;
gui.add( guiData, 'bloomRadius', 0.0, 1.0 ).onChange( function(value) {
    bloomPass.radius = Number(value);
});

guiData.speed = -0.011;
gui.add( guiData, 'speed', -0.1, 0.1 );

guiData.RGBShift = RGBShiftShader.uniforms[ 'amount' ].value = 0.0011;
gui.add( guiData, 'RGBShift', 0.0, 0.01 ).onChange( function(value) {
    RGBShiftShader.uniforms[ 'amount' ].value = value;
});





// var composer2 = new THREE.EffectComposer( renderer );
//
// var delayShader = new THREE.ShaderPass( THREE.DelayShader );
// // delayShader.renderToScreen = true;
// delayShader.clear = false;
// composer2.addPass( delayShader );
//
// // var ren2 = new THREE.RenderPass( scene, camera )
// // // ren2.clear = false;
// // composer2.addPass( ren2 );
//
// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
// copyShader.clear = false;
// copyShader.renderToScreen = true;
// composer2.addPass( copyShader );


// var composer3 = new THREE.EffectComposer( renderer );
// var delayShader3 = new THREE.ShaderPass( THREE.DelayShader );
// delayShader3.uniforms[ 'tDiffusePrev' ].value = composer2.renderTarget2.texture;
// delayShader3.renderToScreen = true;
// composer3.addPass( delayShader3 );

// delayShader0.uniforms[ 'tDiffusePrev' ].value = composer2.readBuffer.texture;






console.log(composer)

$(window).keypress((e) =>{

    rl = Math.random()*6.28;

    switch (true){
        case e.which == 97:
            console.log("A!")
            const nowX = container.rotation.x;
            const nowY = container.rotation.y;
            const nowZ = container.rotation.z;
            TweenMax.killTweensOf( container.rotation );
            TweenMax.to(container.rotation,1.0,{
                x:nowX,
                y:nowY+6.28/4,
                z:nowZ,
                ease:Elastic.easeOut.config(1.2, 0.3),
            });
            break;

        case e.which == 115:
            console.log("S!")
            TweenMax.killTweensOf( container.rotation );
            TweenMax.to(container.rotation,0.5,{x:1,y:3,z:0, ease:Expo.easeOut});
            break;

        case e.which == 100:
            console.log("D!")
            TweenMax.to(container.rotation,0.5,{x:Math.random()*5,y:Math.random()*5,z:Math.random()*5, ease:Expo.easeOut});
            break;
    }
})




$(window).on( "resize", resizeHandler);
var setTimeoutId = 0;
resizeHandler();
function resizeHandler(){

    if( setTimeoutId )clearTimeout( setTimeoutId );
    setTimeoutId = setTimeout(function(){

        var width = $(window).width();
        var height = $(window).height();

        const dpr = Math.min(1.5,window.devicePixelRatio);
        composer.setSize( width*dpr, height*dpr );

    },200)

}



var WIDTH = $(window).width();
var HEIGHT = $(window).height();

var scene_bg = new THREE.Scene();
var camera_bg = new THREE.OrthographicCamera(0, WIDTH, HEIGHT, 0, 0, 1000);
var bg_geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 10, 10);
var bg_material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: .3,
    fog:false,
});
var bg = new THREE.Mesh(bg_geometry, bg_material);

//位置調整して追加
// bg.position.x = WIDTH/2;
// bg.position.y = HEIGHT/2;
bg.position.z = -10;
scene.add(bg);



let rl = 0.0;
render();


function render() {

    rl += 0.002;
    if( rl > 6.28 )rl -= 6.28;

    displayObjList.forEach(value=>value.update());

    // circleBoxes.container.position.y = 1.0
    // circlePanels.container.position.y = -2.5
    //
    // circleBoxes.container.position.y = -0.5
    // circleBoxes2.container.position.y = 0.5
    // circleBoxes3.container.position.y = 1.0
    // circleBoxes4.container.position.y = -1.4
    //
    // circlePanels2.container.rotation.y = 3.14/2
    // circlePanels2.container.position.y = -1.5

    // camera.position.x = Math.sin(3*rl) * 1.5;
    // camera.position.y = Math.cos(2*rl) * 1.5;
    // camera.lookAt(new THREE.Vector3());


    // delayShader.uniforms[ 'tDiffusePrev' ].value = composer.readBuffer.texture;

    requestAnimationFrame(render);

    renderer.render( scene_bg, camera_bg );
    // renderer.render(scene, camera)

    composer.render();

    // delayShader.uniforms[ 'tDiffusePrev' ].value = composer.writeBuffer.texture;
    // delayShader.uniforms[ 'tDiffusePrev' ].value = composer.renderTarget2.texture

    // composer2.render();


    // composer3.render();

}

