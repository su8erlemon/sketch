const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const soundCloud = require('./lib/SoundCloud');
soundCloud.init("https://soundcloud.com/8bit-records-mannheim/mihalis-safras-bahamas?in=8bit-records-mannheim/sets/mihalis-safras-hello-ep",function(){
    soundCloud.play();
    // soundCloud.debugShow();
});

soundCloud.setPoint("high",35);


const EffectComposer = require('three-effectcomposer')(THREE)
      ,RGBShiftShaderClass = require('./shader/RGBShiftShader')
        // ,UnrealBloomPass = require('./lib/UnrealBloomPass')

require('./lib/EffectComposer');
require('./shader/CopyShader');
require('./shader/LuminosityHighPassShader');
require('./lib/UnrealBloomPass');

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

var guiData = {
    enableCameraMove:false
};

var gui = new dat.GUI();

controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;

renderer.setClearColor(0xffffff, 1.0);
//====================================================================
// scene
//====================================================================

var voronoi = d3.voronoi();//.extent([[-width/2, -height/2], [width/2, height/2]]);

var geometry = new THREE.BufferGeometry();

var data = createGeometryData( 57 );

geometry.addAttribute('position', new THREE.BufferAttribute( data.positions, 3));
geometry.addAttribute('color', new THREE.BufferAttribute( data.colors, 3));

var uniforms = {
    time: {value: 1.0},
    gain: {value: 0.0},
    resolution: { value: new THREE.Vector2() },
    invMatrix: { value: new THREE.Matrix4() },
    colorContrast: {value:0.5},
};

// Create light
var light = new THREE.PointLight(0xffffff, 1.0);
// We want it to be very close to our character
light.position.set(0,0,10);
scene.add(light);

var material = new THREE.ShaderMaterial( {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        uniforms
    ]),
    vertexShader:   simpleVert,
    fragmentShader: simpleFrag,
    side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors,
    transparent:true,
    lights: true
} );

material.extensions.derivatives = true;

//var material = new THREE.MeshBasicMaterial( {
//    side: THREE.DoubleSide, vertexColors: THREE.VertexColors
//} );

var square = new THREE.Mesh(geometry, material);
scene.add(square);
square.position.z = 1000;

//square.rotation.y = 10;
square.rotation.x = -6.28/2;
square.rotation.y = -6.28/2;


var m = new THREE.Matrix4();
m.copy( square.matrixWorld );
m.multiply( camera.matrixWorldInverse );
var i = new THREE.Matrix4().getInverse( m );
material.uniforms.invMatrix.value = i;


camera.position.set(0,0,1600);
camera.up = new THREE.Vector3(0,1,0);
camera.lookAt(new THREE.Vector3(0,0,0));





var copyShader = new EffectComposer.ShaderPass(EffectComposer.CopyShader);
copyShader.renderToScreen = true;

var composer = new EffectComposer( renderer );
composer.addPass( new EffectComposer.RenderPass( scene, camera ) );

var RGBShiftShader = new EffectComposer.ShaderPass( RGBShiftShaderClass );
//RGBShiftShader.uniforms[ 'amount' ].value = 0.0010;
composer.addPass( RGBShiftShader );

var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.1, 20.4, 0.95);//1.0, 9, 0.5, 512);
composer.addPass(bloomPass);

composer.addPass( copyShader );


bloomPass.threshold = guiData.bloomThreshold = 0.0;
gui.add( guiData, 'bloomThreshold', 0.0, 1.0 ).onChange( function(value) {
    bloomPass.threshold = Number(value);
});
bloomPass.strength = guiData.bloomStrength = 0.0;
gui.add( guiData, 'bloomStrength', 0.0, 3.0 ).onChange( function(value) {
    bloomPass.strength = Number(value);
});
bloomPass.radius = guiData.bloomRadius = 0.0;
gui.add( guiData, 'bloomRadius', 0.0, 1.0 ).onChange( function(value) {
    bloomPass.radius = Number(value);
});

guiData.colorContrast = material.uniforms.colorContrast.value
gui.add( guiData, 'colorContrast', 0.0, 1.0 ).onChange( function(value) {
    material.uniforms.colorContrast.value = value;
});

guiData.speed = -0.011;
gui.add( guiData, 'speed', -0.1, 0.1 );

guiData.RGBShift = RGBShiftShader.uniforms[ 'amount' ].value = 0.0018;
gui.add( guiData, 'RGBShift', 0.0, 0.01 ).onChange( function(value) {
    RGBShiftShader.uniforms[ 'amount' ].value = value;
});

guiData.enableCameraMove = false;
gui.add(guiData,"enableCameraMove").onChange( function(value) {
    controls.enableZoom = value;
    controls.enablePan = value;
    controls.enableRotate = value;
});

guiData.voronoiNum = 57;
gui.add(guiData,"voronoiNum", 1, 100 ).onChange( function(value) {
    guiData.voronoiNum = value;
    resizeHandler();
});


function animate() {

    soundCloud.update();

    material.uniforms.time.value += guiData.speed;
    material.uniforms.gain.value = 50;

    requestAnimationFrame( animate );

    // controls.update();
    composer.render();
}

//render();
animate();




//====================================================================
// resize
//====================================================================
$(window).on( "resize", resizeHandler);
var setTimeoutId = 0;
function resizeHandler(){

    if( setTimeoutId )clearTimeout( setTimeoutId );
    setTimeoutId = setTimeout(function(){

        var data = createGeometryData( guiData.voronoiNum );

        geometry.attributes.position.array = null;
        geometry.attributes.color.array = null;

        geometry.attributes.position.array = data.positions;
        geometry.attributes.position.count = data.positions.length / 3;
        geometry.attributes.position.needsUpdate = true;

        geometry.attributes.color.array = data.colors;
        geometry.attributes.color.count = data.colors.length / 3;
        geometry.attributes.color.needsUpdate = true;

        data.positions = null;
        data.colors = null;
        data = null;

    },200)

}




//====================================================================
// create position
//====================================================================

var width,height,cp,diagram,polygons,triangles,color;
function createGeometryData( NUM ){


    width = $(window).width();
    height = $(window).height();

    cp = [];
    for( var ix = 0; ix < NUM ; ix++ ){
        for( var iy = 0; iy < NUM ; iy++ ){
            cp.push([
                ix/NUM*width + Math.random()*300-150  - width/2,
                iy/NUM*height + Math.random()*300-150 - height/2
            ]);
        }
    }

    diagram = voronoi(cp);
    polygons = diagram.triangles();

    var positions = new Float32Array( polygons.length * 9 * 3 * 3 );
    var colors = new Float32Array( polygons.length * 9 * 3 * 3 );

    color = new THREE.Color();

    var ii = 0;
    for ( var i = 0; i < polygons.length; i++ ) {

        var x1 = polygons[i][0][0];
        var y1 = polygons[i][0][1];
        var x2 = polygons[i][1][0];
        var y2 = polygons[i][1][1];
        var x3 = polygons[i][2][0];
        var y3 = polygons[i][2][1];

        var xc = (x1+x2+x3)/3;
        var yc = (y1+y2+y3)/3;

        var hh = 1;//4.0 + Math.random()*10;
        // var hh = 4.0;

        //I know these will make two triangles at same position, but i want to see them appear first..
        positions[ii + 0 ] = x1; // x
        positions[ii + 1 ] = y1; // y
        positions[ii + 2 ] = 0; // z

        positions[ii + 3 ] = x2;
        positions[ii + 4 ] = y2;
        positions[ii + 5 ] = 0;

        positions[ii + 6 ] = xc;
        positions[ii + 7 ] = yc;
        positions[ii + 8 ] = hh;


        positions[ii + 9 ]  = x2; // x
        positions[ii + 10 ] = y2; // y
        positions[ii + 11 ] = 0; // z

        positions[ii + 12 ] = x3;
        positions[ii + 13 ] = y3;
        positions[ii + 14 ] = 0;

        positions[ii + 15 ] = xc;
        positions[ii + 16 ] = yc;
        positions[ii + 17 ] = hh;


        positions[ii + 18 ] = x3; // x
        positions[ii + 19 ] = y3; // y
        positions[ii + 20 ] = 0; // z

        positions[ii + 21 ] = x1;
        positions[ii + 22 ] = y1;
        positions[ii + 23 ] = 0;

        positions[ii + 24 ] = xc;
        positions[ii + 25 ] = yc;
        positions[ii + 26 ] = hh;




        var col = Math.random();
        //color.setRGB(Math.random(), Math.random(), Math.random());
        //color.setRGB(col, col, col);
        // color.setRGB(col*0.4, 0.1, 0.0);
        color.setRGB(1.0,1.0,1.0);
        for( var i4 = 0; i4 < 3; i4++){
            colors[i4*9 + ii+0] = color.r;
            colors[i4*9 + ii+1] = color.g;
            colors[i4*9 + ii+2] = color.b;

            colors[i4*9 + ii+3] = color.r;
            colors[i4*9 + ii+4] = color.g;
            colors[i4*9 + ii+5] = color.b;

            colors[i4*9 + ii+6] = color.r;
            colors[i4*9 + ii+7] = color.g;
            colors[i4*9 + ii+8] = color.b;
        }


        ii += 9*3;

    }


    return{
        positions: positions,
        colors: colors
    }

}