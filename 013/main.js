const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

let geo = new THREE.IcosahedronGeometry(1.,5);
// console.log("geo",geo)
// console.log("geo",geo.vertices)
// geo.vertices.forEach((value)=>{
//
//     console.log("--------------------------------")
//
//     let r = Math.sqrt(value.x*value.x + value.y*value.y + value.z*value.z);
//     let theta =  Math.acos(value.z/r)
//     let phai = (value.y>=0?1:-1) * Math.acos(value.x/Math.sqrt(value.x*value.x + value.y*value.y))
//
//     let x = r * Math.sin(theta) * Math.cos(phai);
//     let y = r * Math.sin(theta) * Math.sin(phai);
//     let z = r * Math.cos(theta);
//     console.log(value)
//     console.log(x,y,z)
//     console.log("--------------------------------")
//
// })

// instantiate a loader
let loader = new THREE.TextureLoader();

let uniforms = {};
let box1, box2;


// Make cube texture
var path = './img/SwedishRoyalCastle/';
var urls = [
    path + "nx.jpg",
    path + "ny.jpg",
    path + "nz.jpg",
    path + "px.jpg",
    path + "py.jpg",
    path + "pz.jpg",
];
var textureCube = THREE.ImageUtils.loadTextureCube( urls );



// load a resource
loader.load(
    // resource URL
    // 'img/disturb.jpg',
    // 'img/ss1.jpg',
    // 'img/ss2.png',
    // 'img/border.png',
    // 'img/border1.png',
    'img/border5.png',
    // 'img/border6.png',
    // 'img/border7.png',
    // 'img/border8.png',
    // 'img/border5.png',
    // 'img/border3.png',
    // Function when resource is loaded
    function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        uniforms = {
            time : { type: "f", value: 0 },
            texture1: { type: "t", value: texture },
            tMatCap: { type: "t", value: THREE.ImageUtils.loadTexture( 'img/matcap2_.jpg' ) },
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

        shaderMaterial.extensions.derivatives = true;
        shaderMaterial.extensions.drawBuffers = true;

        box1 = new THREE.Mesh(geo, shaderMaterial)
        scene.add(box1);

        // box2 = new THREE.Mesh(geo, shaderMaterial)
        // box2.position.x = 2.0;
        // scene.add(box2);

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

    //box1.rotation.z = Math.sin(rl)*5;

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}