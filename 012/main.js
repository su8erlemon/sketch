const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

let geo = new THREE.IcosahedronGeometry(1,6);

// instantiate a loader
let loader = new THREE.TextureLoader();

let uniforms = {};
let box1, box2;

// load a resource
loader.load(
    // resource URL
    // 'img/disturb.jpg',
    // 'img/ss1.jpg',
    // 'img/ss2.png',
    // 'img/border.png',
    // 'img/border1.png',
    // 'img/border5.png',
    // 'img/border6.png',
    // 'img/border7.png',
    'img/border8.png',
    // 'img/border5.png',
    // 'img/border3.png',
    // Function when resource is loaded
    function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        uniforms = {
            time : { type: "f", value: 0 },
            texture1: { type: "t", value: texture }
        }

        let shaderMaterial =
            new THREE.ShaderMaterial({
                uniforms:       uniforms,
                vertexShader:   simpleVert,
                fragmentShader: simpleFrag,
                transparent: true,
                side:THREE.DoubleSide,
                // wireframe: true,
            });
        box1 = new THREE.Mesh(geo, shaderMaterial)
        scene.add(box1);

        // let geo2 = new THREE.IcosahedronGeometry(0.7,1);
        // var meshMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x999999,
        //     wireframe: true,
        // });
        // box2 = new THREE.Mesh(geo2, meshMaterial)
        // scene.add(box2);

        render();

    },
    // Function called when download progresses
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    function ( xhr ) {
        console.log( 'An error happened' );
    }
);


let rl = 0.0;
function render() {

    rl += 0.01;
    if( rl > 6.28 )rl -= 6.28;

    uniforms.time.value += 1/60;

    // box1.rotation.z = Math.sin(rl);

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}