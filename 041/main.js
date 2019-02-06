import * as THREE from "three";

const dat = require("dat.gui");

var Params = function() {
  this.width = 0.03;
  this.wireframe = false;
  this.drawUV = false;
  this.drawTexture = false;
};

var params = new Params();
var gui = new dat.GUI();
gui.add(params, "width", 0, 1.0);
gui.add(params, "wireframe").onChange(v => {
  shaderMaterial.wireframe = v;
});
gui.add(params, "drawUV").onChange(v => {
  shaderMaterial.uniforms.drawuv.value = v ? 1.0 : 0.0;
});
gui.add(params, "drawTexture").onChange(v => {
  shaderMaterial.uniforms.drawTexture.value = v ? 1.0 : 0.0;
});

const Stats = require("stats-js");
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);

// Scale for retina
const DPR = Math.min(1.5, window.devicePixelRatio);

const threeApp = require("./lib/createThree");
const { camera, scene, renderer, controls } = threeApp(DPR);

const glsl = require("glslify");
const simpleFrag = glsl.file("./shader/shader.frag");
const simpleVert = glsl.file("./shader/shader.vert");
const posSimFrag = glsl.file("./shader/pos-sim.frag");
function createSimpleVert() {
  return `varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
}

const GPUSimulation = require("./GPUSimulation");

//==============================================================
// data zeros texture for texture initial value
//==============================================================
const TEXTURE_SIZE = 16;
const LINE_LENGTH = TEXTURE_SIZE * TEXTURE_SIZE;
let line = [];
const dd = 0.2;
Array(LINE_LENGTH)
  .fill(0)
  .map((item, index) => {
    line[index] = [
      index * dd - (LINE_LENGTH * dd) / 2,
      (Math.random() - 0.5) * 0.1
    ];
    // line[index] = [index * 0.3, (index % 3) * 0.2];
  });

const zeroData = new Float32Array(TEXTURE_SIZE * TEXTURE_SIZE * 4);
const len = TEXTURE_SIZE * TEXTURE_SIZE;
for (let i = 0; i < len; i++) {
  const i3 = i * 4;
  zeroData[i3 + 0] = line[i][0];
  zeroData[i3 + 1] = line[i][1];
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
zeroData;
dataZeroTexture.needsUpdate = true;

//==============================================================
let shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: simpleVert,
  fragmentShader: simpleFrag,
  // wireframe: true,
  transparent: true,
  uniforms: {
    posTexture: { value: dataZeroTexture },
    lineTexture: {
      // value: new THREE.TextureLoader().load("tex-line.png")
      value: new THREE.TextureLoader().load("Texture_SteamBrush.png")
    },
    texSize: { value: TEXTURE_SIZE },
    width: { value: 0.01 },
    time: { value: 0.0 },
    drawuv: { value: 0.0 },
    drawTexture: { value: 0.0 }
  }
});

shaderMaterial.uniforms.lineTexture.value.wrapS = shaderMaterial.uniforms.lineTexture.value.wrapT =
  THREE.RepeatWrapping;

//==============================================================
const posSimMat = new THREE.ShaderMaterial({
  uniforms: {
    posTexture: { value: dataZeroTexture },
    time: { value: 0.0 }
  },
  vertexShader: createSimpleVert(),
  fragmentShader: posSimFrag
});
const posSim = new GPUSimulation(
  renderer,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
  posSimMat
);
posSim.render();

//==============================================================

var geometry = new THREE.BufferGeometry();
var vertices = new Float32Array(18 * line.length);

for (var i = 0; i < line.length - 1; i++) {
  vertices[i * 18 + 0] = 0;
  vertices[i * 18 + 1] = 0;
  vertices[i * 18 + 2] = i;

  vertices[i * 18 + 3] = 1;
  vertices[i * 18 + 4] = 0;
  vertices[i * 18 + 5] = i;

  vertices[i * 18 + 6] = 2;
  vertices[i * 18 + 7] = 0;
  vertices[i * 18 + 8] = i;

  vertices[i * 18 + 9] = 3;
  vertices[i * 18 + 10] = 0;
  vertices[i * 18 + 11] = i;

  vertices[i * 18 + 12] = 4;
  vertices[i * 18 + 13] = 0;
  vertices[i * 18 + 14] = i;

  vertices[i * 18 + 15] = 5;
  vertices[i * 18 + 16] = 0;
  vertices[i * 18 + 17] = i;
}

// itemSize = 3 because there are 3 values (components) per vertex
geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));

Array(1)
  .fill(0)
  .map((item, index) => {
    var mesh = new THREE.Mesh(geometry, shaderMaterial);
    // mesh.position.y = index - 5;
    // mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.frustumCulled = false;
    scene.add(mesh);
  });

var geoPlane = new THREE.PlaneGeometry(1, 1);
var matPlane = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map: posSim.getTarget().texture
});
var planeMesh = new THREE.Mesh(geoPlane, matPlane);
planeMesh.position.y = 2;
scene.add(planeMesh);

render();

function render() {
  stats.begin();

  shaderMaterial.uniforms.posTexture.value = posSim.getTarget().texture;
  shaderMaterial.uniforms.width.value = params.width;
  shaderMaterial.uniforms.time.value += 0.01;

  requestAnimationFrame(render);
  renderer.render(scene, camera);

  // posSimMat.uniforms.posTexture.value = posSim.getTarget().texture;
  posSimMat.uniforms.time.value += 0.01;
  posSim.render();

  stats.end();
}
