const width = 3;
const height = 3;
const LIFE_MAX = 80;

class Physical {

    constructor( location, mass ) {
        this.location     = location;
        this.velocity     = {x:0,y:0,z:0};
        this.acceleration = {x:0,y:0,z:0};
        this.mass = mass;
        this.initAcc = {
            x: Math.random() * 0.0001 - 0.00005,
            y: -0.004*mass,
            z: Math.random() * 0.0001 - 0.00005,
        };

        this.life = Math.random()* LIFE_MAX;

        this.xx = 0;
        this.yy = 0;
        this.zz = 0;
    }

    test(){
        console.log("aa", height, width);
    }

    update() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.velocity.z += this.acceleration.z;

        this.location.x += this.velocity.x;
        this.location.y += this.velocity.y;
        this.location.z += this.velocity.z;

        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.acceleration.z = 0;

        this.checkEdges();
    }

    applyForce( force ){
        const f = {
            x: force.x/this.mass * this.life/LIFE_MAX,
            y: force.y/this.mass,
            z: force.z/this.mass * this.life/LIFE_MAX,
        };
        this.acceleration.x += f.x;
        this.acceleration.y += f.y;
        this.acceleration.z += f.z;
    }

    checkEdges(){

        // if (this.location.x > width) {
        //     this.velocity.x = 0;
        //     this.location.x = 0;
        //     this.velocity.z = 0;
        //     this.location.z = 0;
        //     this.location.y = Math.random() + 1.0;
        // } else if (this.location.x < -width) {
        //     this.velocity.x = 0;
        //     this.location.x = 0;
        //     this.velocity.z = 0;
        //     this.location.z = 0;
        //     this.location.y = Math.random() + 1.0;
        // }
        //
        // if (this.location.z > width) {
        //     this.velocity.z = 0;
        //     this.location.z = 0;
        //     this.velocity.x = 0;
        //     this.location.x = 0;
        //     this.location.y = Math.random() + 1.0;
        // } else if (this.location.z < -width) {
        //     this.velocity.z = 0;
        //     this.location.z = 0;
        //     this.velocity.x = 0;
        //     this.location.x = 0;
        //     this.location.y = Math.random() + 1.0;
        // }

        if (this.location.y < 0) {
            this.velocity.y *= -0.6;
            this.velocity.x *= 0.4;
            this.velocity.z *= 0.4;
            this.location.y = 0;
        }

        if( this.velocity.y > -0.01 && this.velocity.y < 0.01 )
        {
            this.life--;
        }

        if( this.life < 0 ){
            this.velocity.z = 0;
            this.velocity.x = 0;

            this.location.z = this.zz+Math.random()*0.02-0.01;
            this.location.x = this.xx+Math.random()*0.02-0.01;
            this.location.y = Math.random()*0.2 + 1.0;

            this.life = LIFE_MAX;
        }

    }



}

export{ Physical };
