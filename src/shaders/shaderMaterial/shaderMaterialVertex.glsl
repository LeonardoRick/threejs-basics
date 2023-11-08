
// aRandom is the same name we used in the JS code
// defining the attribute of the geometry
attribute float aRandom;

// we cannot use attributes inside the fragment shader
// so we define a varying here to access it there on fragment.glsl
varying float vRandom;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
    modelPosition.z += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vRandom = aRandom;
}
