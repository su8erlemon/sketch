var pngStream = require('three-png-stream')

var Util = {
getNormalMap: function ( image, depth ) {

    // Adapted from http://www.paulbrunt.co.uk/lab/heightnormal/

    function cross( a, b ) {

        return [ a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ], a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ], a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ] ];

    }

    function subtract( a, b ) {

        return [ a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ] ];

    }

    function normalize( a ) {

        var l = Math.sqrt( a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 1 ] + a[ 2 ] * a[ 2 ] );
        return [ a[ 0 ] / l, a[ 1 ] / l, a[ 2 ] / l ];

    }

    depth = depth | 1;

    var width = image.width;
    var height = image.height;

    var canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    var data = context.getImageData( 0, 0, width, height ).data;
    var imageData = context.createImageData( width, height );
    var output = imageData.data;

    for ( var x = 0; x < width; x ++ ) {

        for ( var y = 0; y < height; y ++ ) {

            var ly = y - 1 < 0 ? 0 : y - 1;
            var uy = y + 1 > height - 1 ? height - 1 : y + 1;
            var lx = x - 1 < 0 ? 0 : x - 1;
            var ux = x + 1 > width - 1 ? width - 1 : x + 1;

            var points = [];
            var origin = [ 0, 0, data[ ( y * width + x ) * 4 ] / 255 * depth ];
            points.push( [ - 1, 0, data[ ( y * width + lx ) * 4 ] / 255 * depth ] );
            points.push( [ - 1, - 1, data[ ( ly * width + lx ) * 4 ] / 255 * depth ] );
            points.push( [ 0, - 1, data[ ( ly * width + x ) * 4 ] / 255 * depth ] );
            points.push( [ 1, - 1, data[ ( ly * width + ux ) * 4 ] / 255 * depth ] );
            points.push( [ 1, 0, data[ ( y * width + ux ) * 4 ] / 255 * depth ] );
            points.push( [ 1, 1, data[ ( uy * width + ux ) * 4 ] / 255 * depth ] );
            points.push( [ 0, 1, data[ ( uy * width + x ) * 4 ] / 255 * depth ] );
            points.push( [ - 1, 1, data[ ( uy * width + lx ) * 4 ] / 255 * depth ] );

            var normals = [];
            var num_points = points.length;

            for ( var i = 0; i < num_points; i ++ ) {

                var v1 = points[ i ];
                var v2 = points[ ( i + 1 ) % num_points ];
                v1 = subtract( v1, origin );
                v2 = subtract( v2, origin );
                normals.push( normalize( cross( v1, v2 ) ) );

            }

            var normal = [ 0, 0, 0 ];

            for ( var i = 0; i < normals.length; i ++ ) {

                normal[ 0 ] += normals[ i ][ 0 ];
                normal[ 1 ] += normals[ i ][ 1 ];
                normal[ 2 ] += normals[ i ][ 2 ];

            }

            normal[ 0 ] /= normals.length;
            normal[ 1 ] /= normals.length;
            normal[ 2 ] /= normals.length;

            var idx = ( y * width + x ) * 4;

            output[ idx ] = ( ( normal[ 0 ] + 1.0 ) / 2.0 * 255 ) | 0;
            output[ idx + 1 ] = ( ( normal[ 1 ] + 1.0 ) / 2.0 * 255 ) | 0;
            output[ idx + 2 ] = ( normal[ 2 ] * 255 ) | 0;
            output[ idx + 3 ] = 255;

        }

    }

    context.putImageData( imageData, 0, 0 );

    return canvas;

},

generateDataTexture: function ( width, height, color ) {

    var size = width * height;
    var data = new Uint8Array( 3 * size );

    var r = Math.floor( color.r * 255 );
    var g = Math.floor( color.g * 255 );
    var b = Math.floor( color.b * 255 );

    for ( var i = 0; i < size; i ++ ) {

        data[ i * 3 ] 	   = r;
        data[ i * 3 + 1 ] = g;
        data[ i * 3 + 2 ] = b;

    }

    var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
    texture.needsUpdate = true;

    return texture;

}



}
window.Util = Util;






function createImageFromTexture(gl, texture, width, height) {
    // Create a framebuffer backed by the texture
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Read the contents of the framebuffer
    var data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.deleteFramebuffer(framebuffer);

    // Create a 2D canvas to store the result
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    // Copy the pixels to a 2D canvas
    var imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);

    var img = new Image();
    img.src = canvas.toDataURL();
    return img;
}









var FizzyText = function() {
    this.height = 0.02;
    this.max1= 75.0;
    this.min1= 21.0;
};

var text = new FizzyText();
window.text = text;
var gui = new dat.GUI();
gui.add(text, 'height', 0.0, 0.08).step(0.01);;
gui.add(text, 'max1', 0.0, 500).step(1);
gui.add(text, 'min1', 0.0, 500).step(1);



const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

window.renderer = renderer;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

const simpleFrag2 = glsl.file('./shader/shader2.frag');
const simpleVert2 = glsl.file('./shader/shader2.vert');

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
        "mtex1": {type: "t", value: null },
    },
    vertexShader:texVert,
    fragmentShader:texFrag,
};


var light1 = new THREE.SpotLight( 0xffffff );
light1.position.set(-5, -5, -4);
light1.target.position.set( 0, 0, 0 );
var spotLightHelper1 = new THREE.SpotLightHelper( light1 );
// scene.add( spotLightHelper1 );

var light2 = new THREE.SpotLight( 0xffffff );
light2.position.set(3, 3, 2.0);
light2.target.position.set( 0, 0, 0 );
var spotLightHelper2 = new THREE.SpotLightHelper( light2 );
// scene.add( spotLightHelper2 );



const SHADOW_WIDTH = 2048/2;
// const SHADOW_WIDTH = 2048;

var tex1 = new THREE.WebGLRenderTarget( SHADOW_WIDTH, SHADOW_WIDTH);
tex1.texture.wrapS = THREE.MirroredRepeatWrapping;
tex1.texture.wrapT = THREE.MirroredRepeatWrapping;
var tex1Composer = new THREE.EffectComposer( renderer, tex1 );
var tex1Shader = new THREE.ShaderPass( THREE.Texture1 );
tex1Composer.addPass( tex1Shader );

// var tex2 = new THREE.WebGLRenderTarget( SHADOW_WIDTH, SHADOW_WIDTH);
// tex2.texture.wrapS = THREE.MirroredRepeatWrapping;
// tex2.texture.wrapT = THREE.MirroredRepeatWrapping;
// var tex2Composer = new THREE.EffectComposer( renderer, tex2 );
// var tex2Shader = new THREE.ShaderPass( THREE.Texture1 );
// tex2Composer.addPass( tex2Shader );

tex1Shader.uniforms[ 'mtex1' ].value = THREE.ImageUtils.loadTexture( 'img/cobblestone_disp.jpg' );
tex1Shader.uniforms.mtex1.value.wrapS = tex1Shader.uniforms.mtex1.value.wrapT = THREE.RepeatWrapping;

var uniforms = {
    time : { type: "f", value: 0 },
    tMatCap: { type: "t", value: THREE.ImageUtils.loadTexture( 'img/rubber_black.png' ) },
    tMatCap2: {type: "t", value: tex1 },
    mtex1: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/cobblestone_disp.jpg' ) },
    // mtex2: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/download_normal.jpg' ) },
    mtex2: {type: "t", value: THREE.ImageUtils.loadTexture( 'img/cobblestone_disp.jpg' ) },
    height: { type: "f", value: 0 },
    max1: { type: "f", value: 0 },
    min1: { type: "f", value: 0 },
    lightPosition1: {type: 'v3', value: light1.position },
    lightPosition2: {type: 'v3', value: light2.position },
}

uniforms.mtex1.value.wrapS = uniforms.mtex1.value.wrapT = THREE.RepeatWrapping;
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
// var box1 = new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0,32,32), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0,512,512), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 4), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,32,32), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.TorusKnotGeometry( .4, .1, 200, 200 ), shaderMaterial);
var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,128,128), shaderMaterial);
// var box1 = new THREE.Mesh(new THREE.SphereGeometry(0.4,512,512), shaderMaterial);
box1.position.x = -.5;
// box1.position.y = -1.0;
// scene.add(box1);


var shaderMaterial2 =
    new THREE.ShaderMaterial({
        uniforms:       uniforms,
        vertexShader:   simpleVert2,
        fragmentShader: simpleFrag2,
        transparent: true,
        side:THREE.DoubleSide,
    });
shaderMaterial2.extensions.derivatives = true;
shaderMaterial2.extensions.drawBuffers = true;

var box2 = new THREE.Mesh(new THREE.PlaneGeometry(7.0,7.0,32,32), shaderMaterial2);
// box2.position.z = .7;
box2.position.y = -0.4;
box2.rotation.x = 3.14/2
box2.position.z = 2
box2.position.x = -2
// scene.add(box2);


// let material = new THREE.MeshLambertMaterial({ map : this.tex1 });
let material2 = new THREE.MeshBasicMaterial({ map : tex1.texture });
// let material = new THREE.MeshBasicMaterial({color: 0xff0000});
let plane = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), material2);
plane.material.side = THREE.DoubleSide;
// plane.position.x = .5;
// scene.add(plane);

// let material3 = new THREE.MeshBasicMaterial({ map : tex2.texture });
// // let material = new THREE.MeshBasicMaterial({color: 0xff0000});
// let plane3 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), material3);
// plane3.material.side = THREE.DoubleSide;
// plane3.position.x = 1.5 + 0.1;
// scene.add(plane3);


tex1Composer.render();

// draw your scene into the target
// renderer.render(scene, camera, tex1)


var img = createImageFromTexture(renderer.getContext(), renderer.properties.get(tex1.texture).__webglTexture, SHADOW_WIDTH,SHADOW_WIDTH)
// document.body.appendChild(img);
img.onload = function () {
    var nmap = Util.getNormalMap(img,5);
    document.body.appendChild(nmap)
    var normapTex = new THREE.Texture( nmap );
    normapTex.needsUpdate = true;

    uniforms.mtex2.value = normapTex;
    uniforms.mtex2.value.wrapS = uniforms.mtex2.value.wrapT = THREE.RepeatWrapping;

    render();

}



// createImageFromTexture()
    // var dataURL = tex1Composer.renderer.domElement.toDataURL();
    // var img = new Image();
    // img.src = dataURL;
    // document.body.appendChild(img);


// window.open(dataURL, "image");








var loader = new THREE.OBJLoader();

// load a resource
loader.load(
    // resource URL
    'stanford-dragon5.obj',
    // called when resource is loaded
    function ( object ) {

        let material333 = new THREE.MeshBasicMaterial({color: 0xff0000});

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {
                console.log(child);
                child.material = shaderMaterial;

            }

        } );
        object.position.x = .5;
        object.position.y = -.5;
        // object.scale.set(0.006,0.006,0.006)
        scene.add( object );

    },
    // called when loading is in progresses
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);




var rl = 0.0;

function render() {


    // tex2Composer.render();

    tex1Shader.uniforms[ 'id' ].value = 0.0;
    // tex2Shader.uniforms[ 'id' ].value = 1.0;

    // tex1Shader.uniforms[ 'tex' ].value = tex2.texture;
    // tex2Shader.uniforms[ 'tex' ].value = tex1.texture;

    rl += 0.01;
    if( rl < 6.28 )rl -= 6.28;

    uniforms.time.value += 1/60;
    uniforms.height.value = text.height * -1;
    uniforms.max1.value = text.max1;
    uniforms.min1.value = text.min1;

    tex1Shader.uniforms[ 'time' ].value += 1/60;
    // tex2Shader.uniforms[ 'time' ].value += 1/60;

    // box1.rotation.z = 10;
    // box1.rotation.y += 1/1600

    requestAnimationFrame(render);
    renderer.render(scene, camera)

    // console.log()
}

console.log("asasas")

