/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

const glsl = require('glslify');
const simpleFrag = glsl.file('./DelayPass.frag');
const simpleVert = glsl.file('./DelayPass.vert');

THREE.DelayShader = {

    uniforms: {
        "tDiffuse": { value: null },
        "tDiffusePrev": { value: null },
        "mouseX": { value: 1.0 },
        "mouseY": { value: 1.0 },
        "time": { value: 1.0 },
        "opacity":  { value: 1.0 }
    },
    vertexShader:simpleVert,
    fragmentShader:simpleFrag,
};
