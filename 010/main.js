const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader1.frag');
const simpleVert = glsl.file('./shader/shader1.vert');

const simpleFrag2 = glsl.file('./shader/shader2.frag');
const simpleVert2 = glsl.file('./shader/shader2.vert');

camera.position.set(1, 1, 3);
camera.lookAt(new THREE.Vector3());

var texture;
window.texture2 = texture;
import {SoundCloud} from './lib/SoundCloud.js';
const soundCloud = new SoundCloud();
soundCloud.init("https://soundcloud.com/floatingpoints/for-marmish-part-ii",
    (menuElement, debugCanvas) => {
        document.body.appendChild( menuElement );
        document.body.appendChild( debugCanvas );

        texture = new THREE.DataTexture(soundCloud.getBytes(), 8, 8, THREE.RGBFormat );
        texture.needsUpdate = true;
        window.texture2 = texture

        soundCloud.play();
        window.soundCloud = soundCloud;
    }
);


// Create a different scene to hold our buffer objects
var bufferScene = new THREE.Scene();
// Create the texture that will store our result
var bufferTexture = new THREE.WebGLRenderTarget(
    8,
    8,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter
    }
);



var shaderMaterial2 =
    new THREE.ShaderMaterial({
        vertexShader:   simpleVert2,
        fragmentShader: simpleFrag2
    });
var boxGeometry =  new THREE.BoxBufferGeometry( 1, 1, 1, 2,  2 );
// var boxGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
// var boxGeometry = new THREE.ParametricBufferGeometry( THREE.ParametricGeometries.klein, 25, 25 );
// var boxGeometry = new THREE.TorusBufferGeometry( 0.1, 0.4, 43, 10 );
// var boxGeometry =  new THREE.BoxGeometry( 5, 5, 5 );

var PARTICLES = boxGeometry.attributes.position.array.length/3;
var indexs = new Float32Array( PARTICLES );
for ( var i = 0; i < PARTICLES ; i++ ) {
    indexs[i] = i;
}
boxGeometry.addAttribute( 'index1', new THREE.BufferAttribute( indexs, 1 ) );

var boxObject = new THREE.Points( boxGeometry, shaderMaterial2 );
bufferScene.add(boxObject);





var uniforms = {
    texture1:     { type: "t", value: null },
    audioTexture: { type: "t", value: null },
};

var shaderMaterial = new THREE.ShaderMaterial({
    uniforms:uniforms,
    vertexShader:   simpleVert,
    fragmentShader: simpleFrag
});
var box1 = new THREE.Points(boxGeometry, shaderMaterial)
scene.add(box1);







///And a blue plane behind it
var debugMaterial = new THREE.MeshBasicMaterial({map:bufferTexture.texture});
var plane1 = new THREE.PlaneBufferGeometry( 1,1);
var planeObject1 = new THREE.Mesh(plane1,debugMaterial);
planeObject1.position.x = 2.0;
planeObject1.position.y = 2.0;
scene.add(planeObject1);

var debugMaterial2 = new THREE.MeshBasicMaterial({map:null});
var plane2 = new THREE.PlaneBufferGeometry( 1,1);
var planeObject2 = new THREE.Mesh(plane2,debugMaterial2);
planeObject2.position.x = 2.0;
planeObject2.position.y = 0.0;
scene.add(planeObject2);




function render() {
    requestAnimationFrame( render );

    soundCloud.update();

    // Render onto our off-screen texture
    renderer.render(bufferScene, camera, bufferTexture);

    uniforms.texture1.value = bufferTexture.texture;

    if( texture ) {
        texture.image.data = soundCloud.getBytes();
        texture.needsUpdate = true;
        debugMaterial2.map = texture;
        debugMaterial2.needsUpdate = true;
        uniforms.audioTexture.value = texture;
    }


    //Make the box rotate on box axises
    boxObject.rotation.y += 0.01;
    boxObject.rotation.x += 0.01;

    // Finally, draw to the screen
    renderer.render( scene, camera );

}

render(); // Render everything!