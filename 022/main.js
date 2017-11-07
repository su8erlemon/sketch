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

/*
const phongCustomFrag= glsl.file('./shader/PhongCustomShader.frag');
const phongCustomVert = glsl.file('./shader/PhongCustomShader.vert');

// material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
var texture = new THREE.TextureLoader().load( "img/download_normal.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 4, 4 );

var uuuu = THREE.UniformsUtils.merge( [
    THREE.ShaderLib[ 'phong' ].uniforms,
    {
        heightmap: { value: null }
    }
] );
var material = new THREE.ShaderMaterial( {
    // uniforms: uuuu,
    uniforms: THREE.ShaderLib[ 'phong' ].uniforms,
    // vertexShader: phongCustomVert,//THREE.ShaderChunk[ 'meshphong_frag' ]THREE.ShaderChunk.meshphong_vert
    // fragmentShader: phongCustomFrag,//THREE.ShaderChunk[ 'meshphong_frag' ]
    vertexShader: THREE.ShaderChunk[ 'meshphong_vert' ],//THREE.ShaderChunk[ 'meshphong_frag' ]THREE.ShaderChunk.meshphong_vert
    fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ]
} );

material.lights = true;
// Material attributes from MeshPhongMaterial
material.color = new THREE.Color( 0xff0000 );
// material.specular = new THREE.Color( 0x111111 );
// material.shininess = 50;
// Sets the uniforms with the material values
//  material.uniforms.diffuse.value = material.color;
// material.uniforms.specular.value = material.specular;
// material.uniforms.shininess.value = Math.max( material.shininess, 1e-4 );
// material.uniforms.opacity.value = material.opacity;
material.uniforms.bumpMap = THREE.ImageUtils.loadTexture( 'img/download_normal.jpg' );


// uuuu.map = texture;
// console.log(uuuu)

var mat22 = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    // map: texture
});
console.log("mat22",mat22)
//
// console.log(mat22.map)
// mat22.map = texture;

// material.uniforms.bumpScale= 12;
// console.log(material.uniforms)
// Defines
// material.defines.WIDTH = 256;
// material.defines.BOUNDS = 256;
// waterUniforms = material.uniforms;
// waterMesh = new THREE.Mesh( geometry, material );
var box111 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 5), material);
// var box111 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 5), mat22);

console.log(material)
// box111.material.uniforms.bumpMap.value = texture;


// box111.matrixAutoUpdate = false;
// box111.updateMatrix();
scene.add( box111 );
 */






THREE.Texture1 = {
    uniforms: {
        "tDiffuse": { value: null },
        "tDiffusePrev": { value: null },
        "mouseX": { value: 1.0 },
        "mouseY": { value: 1.0 },
        "time": { value: 1.0 },
        "opacity":  { value: 1.0 }
    },
    vertexShader:texVert,
    fragmentShader:texFrag,
};


var tex1 = new THREE.WebGLRenderTarget( 1024, 1024);
tex1.texture.wrapS = THREE.MirroredRepeatWrapping;
tex1.texture.wrapT = THREE.MirroredRepeatWrapping;

var tex1Composer = new THREE.EffectComposer( renderer, tex1 );
var tex1Shader = new THREE.ShaderPass( THREE.Texture1 );
tex1Composer.addPass( tex1Shader );



// console.log(simpleFrag)
// console.log(simpleVert)

function replaceThreeChunkFn(a, b) {
    return THREE.ShaderChunk[b] + '\n';
}

function shaderParse(glsl) {
    return glsl.replace(/\/\/\s?chunk\(\s?(\w+)\s?\);/g, replaceThreeChunkFn);
}

const SHADOW_WIDTH = 512;

var light1 = new THREE.SpotLight( 0xffffff );
light1.position.set(1, -.5, 0.2);
light1.target.position.set( 0, 0, 0 );
var spotLightHelper1 = new THREE.SpotLightHelper( light1 );
// scene.add( spotLightHelper1 );

var light2 = new THREE.SpotLight( 0xffffff );
light2.position.set(-2, 2, 0);
light2.target.position.set( 0, 0, 0 );
var spotLightHelper2 = new THREE.SpotLightHelper( light2 );
// scene.add( spotLightHelper2 );

// light.target.position.set( 0, 0, 0 );
// light.castShadow = true;
// light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 40, 1, 0.001, 2500 ) );
// light.shadow.mapSize.width = SHADOW_WIDTH;
// light.shadow.mapSize.height = SHADOW_WIDTH;
// scene.add( light );


// var geo = new THREE.BoxGeometry(1,1,1);
var mat = new THREE.MeshPhongMaterial({ color: 0xffffff })
var matb = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// var box = new THREE.Mesh(geo, mat);
// box.castShadow = true;
// box.receiveShadow = true;
// scene.add(box);

// var box11 = new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.4), mat);
// box11.castShadow = true;
// box11.receiveShadow = true;
// box11.position.x = .7;
// box11.position.y = .5;
// box11.position.z = .5;
// scene.add(box11);

var box2 = new THREE.Mesh(new THREE.BoxGeometry(5,0.1,5), mat);
box2.castShadow = true;
box2.receiveShadow = true;
// box2.position.y = -0.5;

// var box4 = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1), matb);
// scene.add(box4);


var uniforms = {
    time : { type: "f", value: 0 },
    tMatCap: { type: "t", value: THREE.ImageUtils.loadTexture( 'img/matcap.jpg' ) },
    tMatCap2: {type: "t", value: tex1 },
    mtex1: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/download.jpg' ) },
    // mtex2: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/download_normal.jpg' ) },
    mtex2: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/small_metal_debris_Displacement.jpg' ) },
    lightPosition1: {type: 'v3', value: light1.position },
    lightPosition2: {type: 'v3', value: light2.position },
}

console.log();
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

// var box1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), shaderMaterial)
// var box1 = new THREE.Mesh(new THREE.BoxGeometry(15,0.01,15), shaderMaterial)
// var box1 = new THREE.Mesh(new THREE.BoxGeometry(15,0.01,15), mat)
// var box1 = new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0,256*2,256*2), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 6), shaderMaterial);
var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,256*2,256*2), shaderMaterial);
// box1.castShadow = true;
// box1.receiveShadow = true;
// box1.customDepthMaterial = new THREE.ShaderMaterial({
//     vertexShader: simpleVert,
//     fragmentShader: simpleFrag,
//     uniforms: uniforms
// });

scene.add(box1);



// let material = new THREE.MeshLambertMaterial({ map : this.tex1 });
// let material2 = new THREE.MeshBasicMaterial({ map : tex1.texture });
// let material = new THREE.MeshBasicMaterial({color: 0xff0000});
// let plane = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), material2);
// plane.material.side = THREE.DoubleSide;
// plane.position.z = 1.3;
// plane.position.x = 1.4;
// scene.add(plane);


render();

var rl = 0.0;

function render() {

    tex1Composer.render();

    // uuuu.map = texture;
    // material.uniforms.map.value = texture;

    rl += 0.04;
    if( rl < 6.28 )rl -= 6.28;

    uniforms.time.value += 1/60;
    tex1Shader.uniforms[ 'time' ].value += 1/60;

    // light.position.z = Math.sin(rl)*5;
    // light.position.x = Math.cos(rl)*5;
    // light.position.y = 5;

    // spotLightHelper.update();

    // console.log(light.target)
    // light.target.position.set( Math.cos(rl)*3, 0, Math.sin(rl)*3 );


    // box4.position.x = light.position.x;
    // box4.position.y = light.position.y;
    // box4.position.z = light.position.z;

    // light.target.position.set( 0, 0, 0 );

    // light.position.y = Math.sin(rl)*5.0;

    // box11.rotation.x += 1/20;
    // box11.rotation.y += 1/20*.4;
    // box11.rotation.z += 1/20*.8;


    // box1.position.y = Math.sin(rl)*1;
    // box1.rotation.x = Math.sin(rl) * 3.0;
    // box1.rotation.y = Math.cos(rl) * 2.0;
    // box1.rotation.z = Math.sin(rl) * 5.0;

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}

console.log("asasas")