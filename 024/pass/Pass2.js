/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

const glsl = require('glslify');
const simpleFrag = glsl.file('./Pass2.frag');
const simpleVert = glsl.file('./Pass2.vert');

THREE.Pass2 = {

    uniforms: {
        "tDiffuse": { value: null },
        // "tDiffusePrev": { value: null },
        "tex1": { type: 't', value: null },
        "tex2": { type: 't',value: null },
        "normalScene": { type: 't',value: null },
        "mouseX": { value: 1.0 },
        "mouseY": { value: 1.0 },
        "time": { value: 1.0 },
        "v": { value: 1.0 },
        "v1": { value: 1.0 },
        "weight":  { value: [0] }
    },
    vertexShader:simpleVert,
    fragmentShader:simpleFrag,
};
