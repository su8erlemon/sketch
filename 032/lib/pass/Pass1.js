/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

const glsl = require('glslify');
const simpleFrag = glsl.file('./Pass1.frag');
const simpleVert = glsl.file('./Pass1.vert');

THREE.Pass1 = {

    uniforms: {
        "tDepth": { type: 't', value: null },
        "tDiffuse2": { type: 't', value: null },
        "kernels": { type: 'v3v', value: null },
        "tNoise": { type: 't',value: null },
        "prjMat": { type: 'm4',value: null },
        "time": { value: 1.0 },
        "uRadius":  { value: 0.0 },
        "uFov":  { value: 0.0 },
        "uFar":  { value: 0.0 },
        "ww":  { value: 0.0 },
        "aspect":  { value: 0.0 }
    },
    vertexShader:simpleVert,
    fragmentShader:simpleFrag,
};
