const threeApp = require('./lib/createThree');
const { camera, scene, renderer, controls } = threeApp();

import LiquidSphere from './js/LiquidSphere';
import CircleBoxes from './js/CircleBoxes';
import CirclePanels from './js/CirclePanels';
import ThinLines from './js/ThinLines';
import TubeLines from './js/TubeLines';


let displayObjList = [];

let liquidSphere = new LiquidSphere();
liquidSphere.init( scene );
displayObjList.push(liquidSphere);


let circleBoxes = new CircleBoxes({
    num:40,
    r:1.5,
    size:{x:0.1, y:0.1, z:0.1 }
});
circleBoxes.init( scene );
displayObjList.push(circleBoxes);


let circleBoxes2 = new CircleBoxes({
    num:5,
    r:1.0,
    size:{x:0.1, y:4., z:0.1 }
});
circleBoxes2.init( scene );
displayObjList.push(circleBoxes2);


let circleBoxes3 = new CircleBoxes({
    num:30,
    r:2.0,
    size:{x:0.1, y:0.1, z:0.1 }
});
circleBoxes3.init( scene );
displayObjList.push(circleBoxes3);


let circleBoxes4 = new CircleBoxes({
    num:10,
    r:2.8,
    size:{x:0.8, y:0.8, z:0.03 }
});
circleBoxes4.init( scene );
displayObjList.push(circleBoxes4);



let circlePanels = new CirclePanels(
    1.0,
    {x:0.1, y:1, z:0.8 }
);
circlePanels.init( scene );
displayObjList.push(circlePanels);

let circlePanels2 = new CirclePanels(
    1.5,
    {x:0.3, y:0.3, z:0.3 }
);
circlePanels2.init( scene );
displayObjList.push(circlePanels2);

let thinLines = new ThinLines();
thinLines.init( scene );
displayObjList.push(thinLines);

let tubeLines = new TubeLines();
tubeLines.init( scene );
displayObjList.push(tubeLines);

render();

function render() {

    displayObjList.forEach(value=>value.update());

    // circleBoxes.container.position.y = 1.0
    circlePanels.container.position.y = -2.5

    circleBoxes.container.position.y = -0.5
    circleBoxes2.container.position.y = 0.5
    circleBoxes3.container.position.y = 1.0
    circleBoxes4.container.position.y = -1.4

    circlePanels2.container.rotation.y = 3.14/2
    circlePanels2.container.position.y = -1.5

    requestAnimationFrame(render);
    renderer.render(scene, camera)
}

