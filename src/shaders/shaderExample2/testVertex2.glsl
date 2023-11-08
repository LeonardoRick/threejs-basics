
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;

// defined in the javascript
uniform vec2 uFrequency;
uniform float uTime;

attribute vec2 uv;
varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // elevation will be used to create shadows as well on fragment
    float elevation = sin(modelPosition.x * uFrequency.x - (uTime * 3.0)) * 0.1;
    // multiplying the uTime seems sto speed up the flag wave
    modelPosition.z += sin(modelPosition.x * uFrequency.x - (uTime * 3.0)) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vUv = uv;
    vElevation = elevation;
}
