var OrbitControls = require('three-orbit-controls')(THREE);
module.exports = init;

function init() {

    var width, height;

    width = window.innerWidth;
    height = window.innerHeight;

    // Scale for retina
    const dpr = Math.min(2.0, window.devicePixelRatio);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        alpha: true,
        // premultipliedAlpha:true,
        antialias: false // default enabled
    });

    renderer.setClearColor(0x000022, 1.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();

    // camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 1, 1000 )
    // camera.position.set(0, 0, -1)

    const camera = new THREE.PerspectiveCamera(55, width / height, .9, 10000);
    // camera.position.set(0, 0, -2);
    // camera.position.set(1.0, -1.0, -2.0);
    camera.position.set(0.4281834255072691, -3.2440919366235637, -0.6294706491847175);
    
    camera.lookAt(new THREE.Vector3());
    window.camera = camera;
    // camera.rotation.x = -1.2

    const controls = new OrbitControls(camera,document.getElementById("canvas"));
    // const controls = {};

    // camera.rotation.x = -1.2

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

