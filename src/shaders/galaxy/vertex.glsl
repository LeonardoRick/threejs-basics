uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;
// color and positiona re aready declared on shader material
varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    // we need the angle and the distance from the center to create a nice spin animation
    // where the particles at the middle rotetes more than the ones at the edge
    float angle = atan(modelPosition.x, modelPosition.z); // atan = arch-tangent
    // because everything is centered on the scene, the distance from the center
    // is the length of the vector position
    float distanceToCenter = length(modelPosition.xz);
    // dividing 1.0 with the distance to center makes the particles at the center
    // rotate more than the ones at the edge
    float angleChange = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleChange;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;
    // modelPosition.x += aRandomness.x;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    /**
    * point size
    **/
    gl_PointSize = aScale * uSize;
    // this is like sizeAttenuation: true on PointsMaterial
    gl_PointSize *= ( 1.0 / - viewPosition.z );

    /**
    * VARYINGS
    **/
    vColor = color;
}
