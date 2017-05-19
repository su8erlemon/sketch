const glsl = require('glslify');

export default class ThinLines{

    constructor() {
        this.container;
    }

    init( scene ){

        var material = new THREE.LineBasicMaterial( { color : 0x333333 } );

        for( let i = 0 ; i < 10 ; i++ ){

            let arr = [];
            for( let k = 0; k < 5; k++ ){
                arr.push(new THREE.Vector3( Math.random() - 0.5 + Math.sin(i/10*6.28)*.5, k/4 * 8.0 - 4.0, Math.random() -  0.5 + Math.cos(i/10*6.28)*.5 ))
            }
            var curve = new THREE.CatmullRomCurve3(arr);

            var geometry = new THREE.Geometry();
            geometry.vertices = curve.getPoints( 50 );

            var curveObject = new THREE.Line( geometry, material );
            scene.add( curveObject );
        }

    }


    update(){

        if( this.uniforms != null ){
            this.uniforms.time.value += 1/60;
        }

    }
}