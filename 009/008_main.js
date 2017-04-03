const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

import {Physical} from './Physical';

var NUM = 300;

var geo = new THREE.BoxGeometry(1,1,1);
var mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })

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

render();

function render() {

    for( let i = 0 ; i < NUM; i++ ){

        physicals[i].applyForce(physicals[i].initAcc);
        physicals[i].update();

        boxs[i].position.x = physicals[i].location.x;
        boxs[i].position.y = physicals[i].location.y;
        boxs[i].position.z = physicals[i].location.z;

    }

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}