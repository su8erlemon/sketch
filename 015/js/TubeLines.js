const glsl = require('glslify');

export default class TubeLines{

    constructor() {
        this.container;
    }

    init( scene ){


        const len = 3;
        for( let i = 0 ; i < len ; i++ ) {

            let arr = [];
            for (let k = 0; k < 5; k++) {
                arr.push(new THREE.Vector3(
                    Math.random() - 0.5 + Math.sin(i / len * 6.28) * 1,
                    k / 4 * 12.0 - 6.0,
                    Math.random() - 0.5 + Math.cos(i / len * 6.28) * 1))
            }

            var curve = new THREE.CatmullRomCurve3(arr);

            var geometry = new THREE.TubeGeometry(curve, 20, 0.04, 3, false);
            var material = new THREE.MeshBasicMaterial({color: 0x111111});
            var mesh = new THREE.Mesh(geometry, material);

            scene.add(mesh);
        }

    }


    update(){

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/60;
        }
    }
}