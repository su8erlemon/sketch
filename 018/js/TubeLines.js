const glsl = require('glslify');

const simpleFrag = glsl.file('./TubeLines.frag');
const simpleVert = glsl.file('./TubeLines.vert');

export default class TubeLines{

    constructor() {
        this.container;
    }

    init( scene, fog ){


        this.container = new THREE.Group();
        //let geo = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        // load a resource

        // instantiate a loader
        let loader = new THREE.TextureLoader();
        loader.load( 'img/border4.png', ( texture )=>{

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            this.uniforms = {
                time: {type: "f", value: 0},
                texture1: {type: "t", value: texture},
                tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_+.png')},
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

            // const len = 6;
            // for( let i = 0 ; i < len ; i++ ){
            //     let mesh = new THREE.Mesh(geo, shaderMaterial);
            //     this.container.add(mesh);
            //     mesh.position.x = this.r * Math.sin(i/len * 6.28);
            //     mesh.position.z = this.r * Math.cos(i/len * 6.28);
            //     mesh.rotation.y = 6.28 * i/len;
            // }


            const len = 2;
            for( let i = 0 ; i < len ; i++ ) {

                let arr = [];
                for (let k = 0; k < 5; k++) {
                    arr.push(new THREE.Vector3(
                        Math.random() - 0.5 + Math.sin(i / len * 6.28) * 0.8,
                        k / 4 * 12.0 - 6.0,
                        Math.random() - 0.5 + Math.cos(i / len * 6.28) * 0.8
                    ));

                }

                var curve = new THREE.CatmullRomCurve3(arr);

                var geometry = new THREE.TubeGeometry(curve, 20, 0.02, 3, false);
                // var material = new THREE.MeshBasicMaterial({color: 0x111111});
                var mesh = new THREE.Mesh(geometry, shaderMaterial);

                this.container.add(mesh);
            }


            scene.add( this.container );


        });





    }


    update(){

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/60;
        }
    }
}