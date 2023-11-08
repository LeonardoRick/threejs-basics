precision mediump float;
// this was defined in the vertex shader
// and can be used here straight away
varying float vRandom;
void main() {
    // gl_FragColor = vec4(vRandom, vRandom * 0.5, 1.0, 1.0);
    gl_FragColor = vec3(1.0, 1.0, 1.0);
}
