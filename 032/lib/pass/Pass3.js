/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

const glsl = require('glslify');
const simpleFrag = glsl.file('./Pass3.frag');
const simpleVert = glsl.file('./Pass3.vert');

THREE.Pass3 = {

    uniforms: {
        "tDiffuse": { value: null },
        "tDiffuse2": { value: null },
        "tSSAO": { value: null },
        "tex1": { type: 't', value: null },
        "tex2": { type: 't',value: null },
        "normalScene": { type: 't',value: null },
        "mouseX": { value: 1.0 },
        "mouseY": { value: 1.0 },
        "time": { value: 1.0 },
        "v": { value: 1.0 },
        "v1": { value: 1.0 },
        "blurXY": { value: 1.0 },
        "weight":  { value: [0] }
    },
    vertexShader:simpleVert,
    fragmentShader:simpleFrag,
};
