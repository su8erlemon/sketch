const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

var mesh;
var helper, ikHelper;
var clock = new THREE.Clock();

init();
animate();

function init() {

    camera.position.z = 30;
    camera.lookAt(new THREE.Vector3());

    var gridHelper = new THREE.PolarGridHelper( 30, 10 );
    gridHelper.position.y = -10;
    scene.add( gridHelper );

    // model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };

    var modelFile = 'models/mmd/miku/miku_v2.pmd';
    var vmdFiles = [ 'models/mmd/vmds/wavefile_v2.vmd' ];

    helper = new THREE.MMDHelper();

    var loader = new THREE.MMDLoader();
    loader.load( modelFile, vmdFiles, function ( object ) {

        var array = [];
        for ( var i = 0, il = object.material.materials.length; i < il; i ++ ) {
            var m = new THREE.ShaderMaterial({
                vertexShader:   simpleVert,
                fragmentShader: simpleFrag,
                skinning:true
            });
            array.push( m );
        }

        var shaderMaterials = new THREE.MultiMaterial( array );
        object.material = shaderMaterials;

        mesh = object;
        mesh.position.y = -10;

        scene.add( mesh );

        helper.add( mesh );
        helper.setAnimation( mesh );

        /*
         * Note: create CCDIKHelper after calling helper.setAnimation()
         */
        ikHelper = new THREE.CCDIKHelper( mesh );
        ikHelper.visible = false;
        scene.add( ikHelper );

        initGui();

    }, onProgress, onError );


    function initGui () {
        var api = {
            'animation': true,
            'ik': true,
            'physics': true,
            'show IK bones': false,
        };
        var gui = new dat.GUI();
        gui.add( api, 'animation' ).onChange( function () {
            helper.doAnimation = api[ 'animation' ];
        } );
        gui.add( api, 'ik' ).onChange( function () {
            helper.doIk = api[ 'ik' ];
        } );
        gui.add( api, 'physics' ).onChange( function () {
            helper.enablePhysics( api[ 'physics' ] );
        } );
        gui.add( api, 'show IK bones' ).onChange( function () {
            ikHelper.visible = api[ 'show IK bones' ];
        } );
    }
}

function animate() {
    requestAnimationFrame( animate );
    render();
}


function render() {
    helper.animate( clock.getDelta() );

    if ( ikHelper !== undefined && ikHelper.visible )ikHelper.update();

    renderer.render( scene, camera );
}