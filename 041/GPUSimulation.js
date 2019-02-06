import * as THREE from "three";

module.exports = init;

function init(_renderer, _width, _height, _simulationMaterial) {
  let fbos = [];
  let scene;
  let mesh;
  let renderer;
  let camera;
  let current;
  let simulationMaterial;

  let width = _width;
  let height = _height;

  renderer = _renderer;
  simulationMaterial = _simulationMaterial;
  current = 0;

  const options = {
    minFilter: THREE.NearestFilter, // important as we want to sample square pixels
    magFilter: THREE.NearestFilter, //
    format: THREE.RGBAFormat, // could be RGBFormat
    type: /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
      ? THREE.HalfFloatType
      : THREE.FloatType
  };

  fbos = [
    new THREE.WebGLRenderTarget(width, height, options),
    new THREE.WebGLRenderTarget(width, height, options)
  ];

  const geometry = new THREE.PlaneBufferGeometry(2, 2);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  mesh = new THREE.Mesh(geometry, simulationMaterial);
  scene.add(mesh);

  this.render = function() {
    current = 1 - current;
    renderer.render(scene, camera, fbos[current], true);
  };

  this.getTarget = function() {
    return fbos[current];
  };
}
