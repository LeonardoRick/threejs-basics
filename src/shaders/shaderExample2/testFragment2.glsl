precision mediump float;

uniform vec3 uColor;

// sampler2D is the type for 2D textures
uniform sampler2D uTexture;

// we need to get the uv attribute from the vertex shader
// so it can be the second param for texture2D
varying vec2 vUv;
varying float vElevation;
void main() {
    vec4 textureColor = texture2D(uTexture, vUv); // return a vec4
    // we can use xyz or rgb to access the three components
    // of a vec3 or even the first three components of a vec4
    textureColor.rgb *= (vElevation * 2.0 )+ 0.9;
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}
