const glsl = require('glslify');

const simpleFrag = glsl.file('./CircleBoxes.frag');
const simpleVert = glsl.file('./CircleBoxes.vert');

export default class CircleBoxes{

    constructor(param) {

        this.num  = param.num;
        this.r    = param.r;
        this.size = param.size;

        this.uniforms = null;
        this.container;
    }

    init( scene, fog ){

        this.container = new THREE.Group();
        let geo = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        // load a resource

        // instantiate a loader
        let loader = new THREE.TextureLoader();
        loader.load( 'img/border1.png', ( texture )=>{

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            this.uniforms = {
                time: {type: "f", value: 0},
                texture1: {type: "t", value: texture},
                tMatCap: {type: "t", value: THREE.ImageUtils.loadTexture('img/matcap2_.jpg')},
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
                // wireframe: true,
            });

            shaderMaterial.extensions.derivatives = true;
            shaderMaterial.extensions.drawBuffers = true;

            const len = this.num;
            for( let i = 0 ; i < len ; i++ ){
                let mesh = new THREE.Mesh(geo, shaderMaterial);
                this.container.add(mesh);
                mesh.position.x = this.r * Math.sin(6.28 * i/len);
                mesh.position.z = this.r * Math.cos(6.28 * i/len);
                mesh.rotation.y = 6.28 * i/len;
            }

            scene.add( this.container );

        });


        // $(window).keypress((e) =>{
        //
        //     switch (true){
        //         case e.which == 97:
        //             console.log("A!")
        //             const now = this.container.rotation.y;
        //             TweenMax.killTweensOf( this.container.rotation );
        //             TweenMax.to(this.container.rotation,1.0,{
        //                 x:0,
        //                 y:now+6.28/16,
        //                 z:0,
        //                 ease:Elastic.easeOut.config(1.2, 0.3),
        //             });
        //             break;
        //
        //         case e.which == 115:
        //             console.log("S!")
        //             TweenMax.killTweensOf( this.container.rotation );
        //             TweenMax.to(this.container.rotation,0.5,{x:1,y:3,z:0, ease:Expo.easeOut});
        //             break;
        //
        //         case e.which == 100:
        //             console.log("D!")
        //             TweenMax.to(this.container.rotation,0.5,{x:Math.random()*5,y:Math.random()*5,z:Math.random()*5, ease:Expo.easeOut});
        //             break;
        //     }
        // })

    }


    update(){

        this.container.rotation.y += 0.001 * this.r;

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/60;
        }

    }
}