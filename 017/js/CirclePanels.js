const glsl = require('glslify');

const simpleFrag = glsl.file('./CirclePanels.frag');
const simpleVert = glsl.file('./CirclePanels.vert');

export default class CirclePanels{

    constructor( r, size ) {
        this.uniforms;
        this.container;

        this.r = r;
        this.size = size;

        this.rl = 0.0;
    }

    init( scene, fog ){

        this.container = new THREE.Group();
        let geo = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        // load a resource

        // instantiate a loader
        let loader = new THREE.TextureLoader();
        loader.load( 'img/border2.png', ( texture )=>{

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            this.uniforms = {
                time: {type: "f", value: 0},
                texture1: {type: "t", value: texture},
                tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_.jpg')},
                tMatCap2: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_.jpg')},
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
                // wireframe: true,
            });

            shaderMaterial.extensions.derivatives = true;
            shaderMaterial.extensions.drawBuffers = true;

            const len = 6;
            for( let i = 0 ; i < len ; i++ ){
                let mesh = new THREE.Mesh(geo, shaderMaterial);
                this.container.add(mesh);
                mesh.position.x = this.r * Math.sin(i/len * 6.28);
                mesh.position.z = this.r * Math.cos(i/len * 6.28);
                mesh.rotation.y = 6.28 * i/len;
            }

            scene.add( this.container );

        });
    }


    update(){

        // this.rl += 0.01;
        // if( this.rl > 6.28 )this.rl-=6.28;

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/60;
        }

    }
}