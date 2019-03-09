import * as THREE from "three";

const OrbitControls = require("three-orbit-controls")(THREE);
module.exports = init;

function init(dpr) {
  let width, height;

  width = window.innerWidth;
  height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    antialias: true // default false
  });

  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();

  // const camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 1, 1000 )
  // camera.position.set(0, 0, 1)

  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
  camera.position.set(0, 1, 3);
  camera.lookAt(new THREE.Vector3());

  const controls = new OrbitControls(camera, document.getElementById("canvas"));

  window.addEventListener("resize", resize);

  return {
    renderer,
    scene,
    controls,
    camera
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    if (!renderer) return;

    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}
