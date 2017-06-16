var OrbitControls = require('three-orbit-controls')(THREE);
module.exports = init;

function init() {

    var width, height;

    width = window.innerWidth;
    height = window.innerHeight;

    // Scale for retina
    const dpr = Math.min(1.5, window.devicePixelRatio);
    // const dpr = 0.5;//Math.min(1.5, window.devicePixelRatio);
    // const dpr = 2.0;//Math.min(1.5, window.devicePixelRatio);

    const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer:true,
        canvas: document.getElementById("canvas"),
        antialias: true, // default enabled
        alpha: true,
    });

    renderer.autoClearColor = false; //  これも必須

    // renderer.setClearColor(0x12121, 1.0);
    renderer.setClearColor(0x222222, 1.0);
    // renderer.setClearColor(0x111111, 1.0);
    // renderer.setClearColor(0xEFD0B4, 1.0);
    // renderer.setClearColor(0x395F8F, 1.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    // renderer.autoClear = false;

    const scene = new THREE.Scene();

    // camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 1, 1000 )
    // camera.position.set(0, 0, -1)

    const camera = new THREE.PerspectiveCamera(95, width / height, 0.01, 1000);
    camera.position.set(0, 0, 2.5);
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

