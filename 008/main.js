const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

import {Physical} from './Physical';


let rl = 0.0;
let rl2 = 0.0;
var NUM = 2000;

var geo = new THREE.BoxGeometry(1,1,1);
var mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
var box3 = new THREE.Mesh(geo, mat);
box3.scale.set( 0.1, 0.1, 0.1);
scene.add( box3 );


var shaderMaterial =
    new THREE.ShaderMaterial({
        vertexShader:   simpleVert,
        fragmentShader: simpleFrag,
        transparent: true,
    });

let physicals = [];
let boxs = [];
for( let i = 0 ; i < NUM; i++ ){
    physicals.push( new Physical
        ({
            x:Math.random()*2 - 1.0,
            y:Math.random() + 1.0,
            z:Math.random()*2 - 1.0,
        },
        0.1+Math.random()*.3)
    );

    let box1 = new THREE.Mesh(geo, mat)
    box1.scale.set( 0.01, 0.01, 0.01 )
    boxs.push( box1 );

    scene.add(box1);
}


var gridHelper = new THREE.PolarGridHelper( 3, 3 , 8, 64, 0x999999, 0x666666);
scene.add( gridHelper );



// let box1 = new THREE.Mesh(geo, shaderMaterial)
// box1.position.x = 1.5;
// box1.scale.set( 0.2, 0.2, 0.2 )
// scene.add(box1);

render();

let xxx = 0;
let zzz = 0;
function render() {

    rl += 0.007 + Math.random()*0.01;
    if( rl > 6.28 )rl -= 6.28;

    rl2 += 0.004;
    if( rl2 > 6.28 )rl2 -= 6.28;

    // camera.position.set(Math.sin(rl2)*3.0, 1.5 + Math.cos(rl2)*0.1, Math.cos(rl2)*3.0);
    // camera.lookAt(new THREE.Vector3());

    xxx = Math.sin(2*rl) * 1.0;
    zzz = Math.cos(3*rl) * 1.0;

    for( let i = 0 ; i < NUM; i++ ){

        physicals[i].applyForce(physicals[i].initAcc);
        physicals[i].update();

        physicals[i].xx = Math.sin(2*rl) * 1.0;
        physicals[i].zz = Math.cos(3*rl) * 1.0;

        boxs[i].position.x = physicals[i].location.x;
        boxs[i].position.y = physicals[i].location.y;
        boxs[i].position.z = physicals[i].location.z;

    }

    box3.position.x = xxx;
    box3.position.z = zzz;
    box3.position.y = 1.05;

    box3.rotation.set( Math.sin(30*rl), Math.sin(20*rl),Math.cos(40*rl))





    requestAnimationFrame(render);
    renderer.render(scene, camera)
}