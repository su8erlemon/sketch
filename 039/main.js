import * as THREE from "three";

const glsl = require("glslify");

const particleFrag = glsl.file("./shader/shader.frag");
const particleVert = glsl.file("./shader/shader.vert");

const positionSimFrag = glsl.file("./shader/position-sim.frag");
const velocitySimFrag = glsl.file("./shader/velocity-sim.frag");
function createSimpleVert() {
  return `varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
}
const OrbitControls = require("three-orbit-controls")(THREE);
const GPUSimulation = require("./GPUSimulation");

//==============================================================
// threejs setup
//==============================================================
let width = window.innerWidth;
let height = window.innerHeight;

// Scale for retina
const dpr = Math.min(1.5, window.devicePixelRatio);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true // default false
});
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(width, height);
renderer.setPixelRatio(dpr);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, width / height, 0.01, 1000);
camera.position.set(20, 10, 30);
camera.lookAt(new THREE.Vector3());

// OrbitControls
const controls = new OrbitControls(camera, document.getElementById("canvas"));

//==============================================================
// data zeros texture for texture initial value
//==============================================================
const TEXTURE_SIZE = 64;
const zeroData = new Float32Array(TEXTURE_SIZE * TEXTURE_SIZE * 4);
const len = TEXTURE_SIZE * TEXTURE_SIZE;
for (let i = 0; i < len; i++) {
  const i3 = i * 4;
  zeroData[i3 + 0] = 0;
  zeroData[i3 + 1] = 0;
  zeroData[i3 + 2] = 0;
  zeroData[i3 + 3] = Math.random();
}

const dataZeroTexture = new THREE.DataTexture(
  zeroData,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
  THREE.RGBAFormat,
  THREE.FloatType
);
dataZeroTexture.needsUpdate = true;

//==============================================================
// velocity calculation texture
//==============================================================
const velSimMat = new THREE.ShaderMaterial({
  uniforms: {
    velTexture: { value: dataZeroTexture },
    posTexture: { value: dataZeroTexture },
    time: { value: 0.0 }
  },
  vertexShader: createSimpleVert(),
  fragmentShader: velocitySimFrag
});
const velSim = new GPUSimulation(
  renderer,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
  velSimMat
);
velSim.render();

//==============================================================
// position calculation texture
//==============================================================
const posSimMat = new THREE.ShaderMaterial({
  uniforms: {
    velTexture: { value: dataZeroTexture },
    posTexture: { value: dataZeroTexture },
    time: { value: 0.0 }
  },
  vertexShader: createSimpleVert(),
  fragmentShader: positionSimFrag
});
const posSim = new GPUSimulation(
  renderer,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
  posSimMat
);
posSim.render();

//==============================================================
// texture debug plane
//==============================================================
const testPlaneGeo = new THREE.PlaneGeometry(1, 1);
const testPlaneMat = new THREE.MeshBasicMaterial({
  map: posSim.getTarget().texture
});
const testPlaneMesh1 = new THREE.Mesh(testPlaneGeo, testPlaneMat);
testPlaneMesh1.position.x = 2;
testPlaneMesh1.position.y = 3;
scene.add(testPlaneMesh1);
const testPlaneVelMat = new THREE.MeshBasicMaterial({
  map: velSim.getTarget().texture
});
const testPlaneMesh2 = new THREE.Mesh(testPlaneGeo, testPlaneVelMat);
testPlaneMesh2.position.x = 3;
testPlaneMesh2.position.y = 3;
scene.add(testPlaneMesh2);
var gridHelper = new THREE.PolarGridHelper(10, 10, 8, 64, 0x999999, 0x666666);
scene.add(gridHelper);
var axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//==============================================================
// particle
//==============================================================
var PARTICLE_NUM = 50; // could be incresed by TEXTURE_SIZE * TEXTURE_SIZE
var vertices = [];
var indexes = [];
const geometry = new THREE.BufferGeometry();
for (var i = 0; i < PARTICLE_NUM; i++) {
  vertices.push(Math.random());
  vertices.push(Math.random());
  vertices.push(Math.random());
  indexes.push(i);
}
geometry.addAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(vertices), 3)
);
geometry.addAttribute(
  "indexes",
  new THREE.BufferAttribute(new Float32Array(indexes), 1)
);
let particleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    texture1: { type: "t", value: posSim.getTarget().texture },
    time: { type: "f", value: 0.0 }
  },
  vertexShader: particleVert,
  fragmentShader: particleFrag
});
var particlePoints = new THREE.Points(geometry, particleMaterial);
scene.add(particlePoints);

//==============================================================
// handle resieze
//==============================================================
window.addEventListener("resize", resize);
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  renderer.setViewport(0, 0, width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

//==============================================================
// render loop
//==============================================================
render();
function render() {
  requestAnimationFrame(render);

  particleMaterial.uniforms.texture1.value = posSim.getTarget().texture;
  particleMaterial.uniforms.time.value += 0.01;

  renderer.render(scene, camera);

  velSimMat.uniforms.posTexture.value = posSim.getTarget().texture;
  velSimMat.uniforms.velTexture.value = velSim.getTarget().texture;
  velSim.render();

  posSimMat.uniforms.posTexture.value = posSim.getTarget().texture;
  posSimMat.uniforms.velTexture.value = velSim.getTarget().texture;
  posSimMat.uniforms.time.value += 0.01;
  posSim.render();
}
