import * as THREE from "three";

// Scale for retina
const DPR = Math.min(1.5, window.devicePixelRatio);

const threeApp = require("./lib/createThree");
const { camera, scene, renderer, controls } = threeApp(DPR);

const glsl = require("glslify");
const simpleFrag = glsl.file("./shader/shader.frag");
const simpleVert = glsl.file("./shader/shader.vert");

let geo = new THREE.PlaneGeometry(1, 1);
// let mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
// let box = new THREE.Mesh(geo, mat);
// scene.add(box);

let shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: "f", value: 0.0 }
  },
  vertexShader: simpleVert,
  fragmentShader: simpleFrag
});
let box1 = new THREE.Mesh(geo, shaderMaterial);
scene.add(box1);

render();

function render() {
  shaderMaterial.uniforms.time.value += 0.01;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
