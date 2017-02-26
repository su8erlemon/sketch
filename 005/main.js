const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader1.frag');
const simpleVert = glsl.file('./shader/shader1.vert');

const simpleFrag2 = glsl.file('./shader/shader2.frag');
const simpleVert2 = glsl.file('./shader/shader2.vert');

camera.position.set(1, 1, 3);
camera.lookAt(new THREE.Vector3());


// Create a different scene to hold our buffer objects
var bufferScene = new THREE.Scene();
// Create the texture that will store our result
var bufferTexture = new THREE.WebGLRenderTarget(
    128,
    128,
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
var boxGeometry =  new THREE.BoxBufferGeometry( 1, 1, 1, 4, 4 );
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
    texture1: { type: "t", value: null }
};

var shaderMaterial = new THREE.ShaderMaterial({
    uniforms:uniforms,
    vertexShader:   simpleVert,
    fragmentShader: simpleFrag
});
var box1 = new THREE.Line(boxGeometry, shaderMaterial)
scene.add(box1);







///And a blue plane behind it
var debugMaterial = new THREE.MeshBasicMaterial({map:bufferTexture.texture});
var plane1 = new THREE.PlaneBufferGeometry( 1,1);
var planeObject1 = new THREE.Mesh(plane1,debugMaterial);
planeObject1.position.x = 2.0;
planeObject1.position.y = 2.0;
scene.add(planeObject1);




function render() {
    requestAnimationFrame( render );

    // Render onto our off-screen texture
    renderer.render(bufferScene, camera, bufferTexture);

    uniforms.texture1.value = bufferTexture.texture;

    //Make the box rotate on box axises
    boxObject.rotation.y += 0.01;
    boxObject.rotation.x += 0.01;

    // Finally, draw to the screen
    renderer.render( scene, camera );

}

render(); // Render everything!