import * as THREE from 'three';


const dat = require('dat.gui');

var Params = function() {
    this.p1 = -0.226;
    this.p2 = -1;
    this.p3 = 0.001;
    this.p4 = 1;
};
  
var params = new Params();
var gui = new dat.GUI();
gui.add(params, 'p1', -3.14, 3.14);
gui.add(params, 'p2', -1, 1);
gui.add(params, 'p3', -0.001, 0.001);
gui.add(params, 'p4', -1, 1);


const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

let geo = new THREE.ConeGeometry(0.5,1,8,8)
// let geo = new THREE.BoxGeometry(0.5,2.0,0.5);


var geoBox1 = new THREE.BoxGeometry(100,0.01,0.01);
var matBox1 = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    side: THREE.DoubleSide
})
var boxMesh1 = new THREE.Mesh(geoBox1, matBox1);
scene.add(boxMesh1);

var geoBox1 = new THREE.BoxGeometry(0.01,100,0.01);
var matBox1 = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    side: THREE.DoubleSide
})
var boxMesh1 = new THREE.Mesh(geoBox1, matBox1);
scene.add(boxMesh1);

var geoBox1 = new THREE.BoxGeometry(0.01,0.01,100);
var matBox1 = new THREE.MeshBasicMaterial({ 
    color: 0x0000ff,
    side: THREE.DoubleSide
})
var boxMesh1 = new THREE.Mesh(geoBox1, matBox1);
scene.add(boxMesh1);



var uniforms = {
    texture1: { type: 't', value: null },
    value: { type: 'f', value: 0.0 },
    time: { type: 'f', value: 0.0 },
    p: { type: '4fv', value: new THREE.Vector4(0,0,0,0) },
};

var shaderMaterial = new THREE.ShaderMaterial({
    uniforms:uniforms,
    vertexShader:   simpleVert,
    fragmentShader: simpleFrag,
    // wireframe:true,
});

let box1 = new THREE.Mesh(geo, shaderMaterial)
// box1.position.x = 1.5;
// box1.scale.x = 0.1;
scene.add(box1);

render();

function render() {
    uniforms.time.value += 0.01;

    uniforms.p.value.x = params.p1;
    uniforms.p.value.y = params.p2;
    uniforms.p.value.z = params.p3;
    uniforms.p.value.w = params.p4;

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}