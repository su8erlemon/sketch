const glsl = require('glslify');

const simpleFrag = glsl('./SkySphere.frag');
const simpleVert = glsl('./SkySphere.vert');

export default class SkySphere{

    constructor() {
        this.uniforms = null;
        this.container;
    }

    init( scene ){

        this.container = new THREE.Group();
        let geo = new THREE.IcosahedronGeometry(10.0,1);
        // load a resource

        // instantiate a loader
        let loader = new THREE.TextureLoader();
        loader.load( 'img/border1.png', ( texture )=>{

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            this.uniforms = {
                time: {type: "f", value: 0},
                texture1: {type: "t", value: texture},
                tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_+_.png')},
                tMatCap2: {type: "t", value: THREE.ImageUtils.loadTexture('img/nature_ice_furnace.png')},
                // tMatCap: { type: "t", value: THREE.ImageUtils.loadTexture( 'img/matcaps/' + matcappath ) },
            };

            let shaderMaterial = new THREE.ShaderMaterial({
                uniforms:       this.uniforms,
                vertexShader:   simpleVert,
                fragmentShader: simpleFrag,
                // transparent: true,
                side:THREE.BackSide,
                // wireframe: true,
            });

            let material = new THREE.MeshBasicMaterial({color:0xff0000});

            shaderMaterial.extensions.derivatives = true;
            shaderMaterial.extensions.drawBuffers = true;

            let mesh = new THREE.Mesh(geo, shaderMaterial);
            // let mesh = new THREE.Mesh(geo, material);
            this.container.add(mesh);

            scene.add( this.container );

        });
    }


    update(){

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/100;
        }

    }
}