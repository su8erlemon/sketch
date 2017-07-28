// const THREE = require('three')

window.ASSETS = {};

const loadTexture = (url, label) => {
    return (comp)=>{
        let loader = new THREE.TextureLoader();
        loader.load(url, (texture) => {
            ASSETS[label] = texture;
            comp();
        });
    }
}

export const assetsInit = (callback) => {

    let compCount = 0;
    function comp(){
        compCount++;
        if( compCount >= loads.length ){
            callback();
        }
    }

    let loads = [];
    loads.push(loadTexture("japan.png", "japan"));

    loads.forEach((startFunc) => {
        startFunc(comp);
    });

}





