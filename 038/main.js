import * as THREE from "three";

const threeApp = require("./lib/createThree");
const { camera, scene, renderer, controls } = threeApp();

const glsl = require("glslify");
const simpleFrag = glsl.file("./shader/shader.frag");
const simpleVert = glsl.file("./shader/shader.vert");

// let geo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
let geo = new THREE.SphereGeometry(0.5, 32, 32);

// const lights = {};
// lights.directional = new THREE.DirectionalLight(0xffffff, 1.0);
// lights.directional.position.set(5, 5, 0);
// lights.directionalHelper = new THREE.DirectionalLightHelper(
//   lights.directional,
//   1.0
// );xwxxxxx
// lights.point = new THREE.PointLight(0xff0000, 1, 5.0);
// lights.pointHelper = new THREE.PointLightHelper(lights.point, 1.0);
// lights.spot = new THREE.SpotLight(
//   0x00ff00,
//   1.0,
//   10.0,
//   30 * THREE.Math.DEG2RAD,
//   1
// );
// lights.spot.position.set(0, 5, 5);
// lights.spotHelper = new THREE.SpotLightHelper(lights.spot, 1.0);

// scene.add(lights.directional);
// scene.add(lights.directionalHelper);
// scene.add(lights.point);
// scene.add(lights.pointHelper);
// scene.add(lights.spot);
// scene.add(lights.spotHelper);

const uniforms = {
  //   metallic: { value: 0.5 },
  //   roughness: { value: 0.5 },
  //   albedo: { value: new THREE.Color(1, 1, 1) },
  metallic: { value: new THREE.TextureLoader().load("Metal07_met.jpg") },
  roughness: { value: new THREE.TextureLoader().load("Metal07_rgh.jpg") },
  albedo: { value: new THREE.TextureLoader().load("Metal07_col.jpg") },
  pointLights: { value: [] },
  spotLights: { value: [] },
  directionalLights: { value: [] },
  numPointLights: { value: 0 },
  numSpotLights: { value: 0 },
  numDirectionalLights: { value: 1 },
  time: { value: 0.0 }
};

for (var i = 0; i < 4; ++i) {
  uniforms.pointLights.value.push({
    position: new THREE.Vector3(i, 0, i),
    color: new THREE.Color(1, 1, 1),
    distance: 1000.0,
    decay: 1.0
  });
  uniforms.spotLights.value.push({
    position: new THREE.Vector3(1, 1, 1),
    color: new THREE.Color(1, 1, 1),
    direction: new THREE.Vector3(0, 0, 1),
    distance: 10.0,
    decay: 1.0,
    coneCos: 0.3,
    pnumbraCos: 0.0
  });
  uniforms.directionalLights.value.push({
    direction: new THREE.Vector3(1, 1, 1),
    color: new THREE.Color(1, 1, 1)
  });
}

let shaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: simpleVert,
  fragmentShader: simpleFrag
});

let boxes = [];
Array(1)
  .fill(0)
  .map((item, index) => {
    let box1 = new THREE.Mesh(geo, shaderMaterial);
    // box1.scale.x = box1.scale.y = box1.scale.z = 0.2 + Math.random() * 0.5;
    scene.add(box1);
    boxes.push(box1);
  });

let rad = 0.0;
render();

function render() {
  rad += 0.003;

  uniforms.directionalLights.value;
  uniforms.time.value += 0.01;
  boxes.forEach((box1, index) => {
    // box1.position.y =
    //   Math.cos(index * 0.3 + rad * 20.0 + (index * 3.14) / 10.0) * 0.5;
    // box1.position.x =
    //   Math.sin(index * 0.3 + rad * 15.0 + (index * 3.14) / 10.0) * 0.5;
    // box1.position.z =
    // Math.sin(index * 0.3 + rad * 10.0 + (index * 3.14) / 10.0) * 0.5;
    // box1.rotation.x = Math.sin(rad + index) * 6.28;
    // box1.rotation.y = Math.sin(3 * rad) * 6.28;
    // box1.rotation.z = Math.sin(2 * rad) * 6.28;
  });
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
