var OrbitControls = require('three-orbit-controls')(THREE);
module.exports = init;

function init() {

    var width, height;

    width = window.innerWidth;
    height = window.innerHeight;

    // Scale for retina
    const dpr = Math.min(1.5, window.devicePixelRatio);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true, // default enabled
        alpha: true
    });

    renderer.setClearColor(0xcccccc, 0.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();

    // camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 1, 1000 )
    // camera.position.set(0, 0, -1)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
    // camera.position.set(1, 1, -1.);
    camera.position.set(0, 0, -1.);
    camera.lookAt(new THREE.Vector3());

    const controls = new OrbitControls(camera);

    window.addEventListener('resize', resize);

    return {
        renderer,
        scene,
        controls,
        camera
    }

    function resize() {

        width = window.innerWidth;
        height = window.innerHeight;

        if (!renderer)return;

        renderer.setSize(width, height);
        renderer.setViewport(0, 0, width, height);

        camera.aspect = width/height;
        camera.updateProjectionMatrix();

    }
}

