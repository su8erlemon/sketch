const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

window.renderer = renderer;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

const texFrag = glsl.file('./shader/Texture1.frag');
const texVert = glsl.file('./shader/Texture1.vert');

THREE.Texture1 = {
    uniforms: {
        "tDiffuse": { value: null },
        "tDiffusePrev": { value: null },
        "mouseX": { value: 1.0 },
        "mouseY": { value: 1.0 },
        "time": { value: 1.0 },
        "opacity":  { value: 1.0 },
        "tex": {type: "t", value: null },
        "id": {value: 1.0},
    },
    vertexShader:texVert,
    fragmentShader:texFrag,
};



const SHADOW_WIDTH = 512;

var tex1 = new THREE.WebGLRenderTarget( SHADOW_WIDTH, SHADOW_WIDTH);
tex1.texture.wrapS = THREE.MirroredRepeatWrapping;
tex1.texture.wrapT = THREE.MirroredRepeatWrapping;
var tex1Composer = new THREE.EffectComposer( renderer, tex1 );
var tex1Shader = new THREE.ShaderPass( THREE.Texture1 );
tex1Composer.addPass( tex1Shader );

var tex2 = new THREE.WebGLRenderTarget( SHADOW_WIDTH, SHADOW_WIDTH);
tex2.texture.wrapS = THREE.MirroredRepeatWrapping;
tex2.texture.wrapT = THREE.MirroredRepeatWrapping;
var tex2Composer = new THREE.EffectComposer( renderer, tex2 );
var tex2Shader = new THREE.ShaderPass( THREE.Texture1 );
tex2Composer.addPass( tex2Shader );


var uniforms = {
    time : { type: "f", value: 0 },
    tMatCap: { type: "t", value: THREE.ImageUtils.loadTexture( 'img/matcap.jpg' ) },
    tMatCap2: {type: "t", value: tex1 },
    mtex1: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/download.jpg' ) },
    // mtex2: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/download_normal.jpg' ) },
    mtex2: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/small_metal_debris_Displacement.jpg' ) },
}

uniforms.mtex2.value.wrapS = uniforms.mtex2.value.wrapT = THREE.RepeatWrapping;

var shaderMaterial =
    new THREE.ShaderMaterial({
        uniforms:       uniforms,
        vertexShader:   simpleVert,
        fragmentShader: simpleFrag,
        transparent: true,
        side:THREE.DoubleSide,
    });
shaderMaterial.extensions.derivatives = true;
shaderMaterial.extensions.drawBuffers = true;

// var box1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,128,128), shaderMaterial)
// var box1 = new THREE.Mesh(new THREE.BoxGeometry(15,0.01,15), shaderMaterial)
// var box1 = new THREE.Mesh(new THREE.BoxGeometry(15,0.01,15), mat)
// var box1 = new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0,256*2,256*2), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 4), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,32,32), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,128,128), shaderMaterial);
var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,512,512), shaderMaterial);
box1.position.x = -.6;
scene.add(box1);



// let material = new THREE.MeshLambertMaterial({ map : this.tex1 });
let material2 = new THREE.MeshBasicMaterial({ map : tex1.texture });
// let material = new THREE.MeshBasicMaterial({color: 0xff0000});
let plane = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), material2);
plane.material.side = THREE.DoubleSide;
plane.position.x = .6;
scene.add(plane);

// let material3 = new THREE.MeshBasicMaterial({ map : tex2.texture });
// // let material = new THREE.MeshBasicMaterial({color: 0xff0000});
// let plane3 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), material3);
// plane3.material.side = THREE.DoubleSide;
// plane3.position.x = 1.5 + 0.1;
// scene.add(plane3);


render();

var rl = 0.0;

function render() {

    tex1Composer.render();
    tex2Composer.render();

    tex1Shader.uniforms[ 'id' ].value = 0.0;
    tex2Shader.uniforms[ 'id' ].value = 1.0;

    tex1Shader.uniforms[ 'tex' ].value = tex2.texture;
    tex2Shader.uniforms[ 'tex' ].value = tex1.texture;

    rl += 0.04;
    if( rl < 6.28 )rl -= 6.28;

    uniforms.time.value += 1/60;
    tex1Shader.uniforms[ 'time' ].value += 1/60;
    tex2Shader.uniforms[ 'time' ].value += 1/60;

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}

console.log("asasas")