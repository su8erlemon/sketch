/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

const glsl = require('glslify');
const simpleFrag = glsl.file('./PostProcessing.frag');
const simpleVert = glsl.file('./PostProcessing.vert');

THREE.PostProcessing = {

    uniforms: {
        "tDiffuse": { value: null },
        // "tDiffusePrev": { value: null },
        "tex1": { type: 't', value: null },
        "tex2": { type: 't',value: null },
        "mouseX": { value: 1.0 },
        "mouseY": { value: 1.0 },
        "time": { value: 1.0 },
        "v": { value: 1.0 },
        "opacity":  { value: 1.0 }
    },
    vertexShader:simpleVert,
    fragmentShader:simpleFrag,
};
