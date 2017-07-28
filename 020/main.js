const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

const glsl = require('glslify');
const simpleFrag = glsl.file('./shader/shader.frag');
const simpleVert = glsl.file('./shader/shader.vert');

import { assetsInit } from './AssetsController';


assetsInit(init)

function init() {

    var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
    var FLOOR = - 250;

    let ambient = new THREE.AmbientLight( 0x444444 );
    scene.add( ambient );
    let light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
    light.position.set( 500, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add( light );


    var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
    var ground = new THREE.Mesh( geometry, planeMaterial );
    ground.position.set( 0, FLOOR, 0 );
    ground.rotation.x = - Math.PI / 2;
    ground.scale.set( 100, 100, 100 );
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add( ground );



    let geo = new THREE.PlaneGeometry(100,100,300,300);
    // let mat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })
    let mat = new THREE.MeshBasicMaterial({ color: 0xffffff })

    let uniforms = {
        time: {type: "f", value: 0},
        texture1: {type: "t", value: ASSETS.japan},
    };

    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms:       uniforms,
        vertexShader:   simpleVert,
        fragmentShader: simpleFrag,
        // side:THREE.DoubleSide,
        // wireframe: true,
        transparent: true,
    });
    // let box1 = new THREE.Mesh(geo, mat)
    let box1 = new THREE.Mesh(new THREE.BoxGeometry( 100, 100, 100, 100, 100 ), shaderMaterial)
    box1.position.y = FLOOR + 50;
    box1.castShadow = true;
    box1.receiveShadow = true;
    scene.add(box1);


    // var mesh = new THREE.Mesh( new THREE.BoxGeometry( 1500, 220, 150 ), planeMaterial );
    // mesh.position.y = FLOOR - 50;
    // mesh.position.z = 20;
    // mesh.castShadow = true;
    // mesh.receiveShadow = true;
    // scene.add( mesh );

    render();

    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }

}
