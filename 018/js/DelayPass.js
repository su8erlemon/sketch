/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.DelayShader = {

    uniforms: {

        "tDiffuse": { value: null },
        "tDiffusePrev": { value: null },
        "opacity":  { value: 1.0 }

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join( "\n" ),

    fragmentShader: [

        "uniform float opacity;",

        "uniform sampler2D tDiffuse;",

        "uniform sampler2D tDiffusePrev;",

        "varying vec2 vUv;",

        "void main() {",

        "vec4 texel = texture2D( tDiffuse, vUv );",

        "vec4 texel2 = texture2D( tDiffusePrev, vUv );",

        // "gl_FragColor = opacity * (texel*0.5 + texel2*0.5);",
        // "gl_FragColor = texel + texel2*0.5;",
        // "gl_FragColor = texel + vec4(0.0,0.0,0.0,1.0);",
        "gl_FragColor = 1.0 * texel2;",
        // "gl_FragColor = 1.0 * texel;",
        // "gl_FragColor = opacity * texel;",
        // "gl_FragColor = vec4(1.0,0.0,0.0,0.5);",

        "}"

    ].join( "\n" )

};
