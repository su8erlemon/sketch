const glsl = require('glslify');

const simpleFrag = glsl.file('./LiquidSphere2.frag');
const simpleVert = glsl.file('./LiquidSphere2.vert');

export default class LiquidSphere2{

    constructor(isReturn) {
        this.uniforms = null;
        this.container;
        this.isReturn = isReturn;
    }

    init( scene, fog ){

        this.container = new THREE.Group();
        let geo = new THREE.IcosahedronGeometry(0.7,5);
        // load a resource

        // instantiate a loader
        let loader = new THREE.TextureLoader();
        loader.load( 'img/border1.png', ( texture )=>{

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            this.uniforms = {
                time: {type: "f", value: 0},
                texture1: {type: "t", value: texture},
                // tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_+_.png')},
                tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_.jpg')},
                // tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_++.png')},
                tMatCap2: {type: "t", value: THREE.ImageUtils.loadTexture('img/nature_ice_furnace.png')},
                // tMatCap: { type: "t", value: THREE.ImageUtils.loadTexture( 'img/matcaps/' + matcappath ) },
                fogColor:    { type: "c", value: fog.color },
                fogFar:      { type: "f", value: fog.far },
                fogNear:     { type: "f", value: fog.near },
            };

            let shaderMaterial = new THREE.ShaderMaterial({
                uniforms:       this.uniforms,
                vertexShader:   simpleVert,
                fragmentShader: simpleFrag,
                transparent: true,
                side:THREE.DoubleSide,
                wireframe: false,
            });

            let material = new THREE.MeshBasicMaterial({color:0xff0000});

            shaderMaterial.extensions.derivatives = true;
            shaderMaterial.extensions.drawBuffers = true;

            let mesh = new THREE.Mesh(geo, shaderMaterial);
            // let mesh = new THREE.Mesh(geo, material);
            this.container.add(mesh);

            scene.add( this.container );
            this.container.rotation.x = 3.14/2
            this.container.scale.x = 0.5;
            this.container.scale.y = 0.5;
            // this.container.scale.z = 0.3;

        });
    }


    update(){

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/100;
            this.container.rotation.z += 0.01
        }

    }
}