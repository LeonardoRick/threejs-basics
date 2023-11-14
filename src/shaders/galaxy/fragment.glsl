varying vec3 vColor;
// gl_PointCoord = uv coordinates of the particle

/**
* Helper functions
*/
vec3 circle() {
// 1) how much closer to the center, the distance will be lower, and the color will be black
    float strength = distance(gl_PointCoord, vec2(0.5));
    // 2) we don't want a gradient, so applying a step creates a more solid drawing and division
    strength = step(0.5, strength);
    // 3) we invert the strength, so the center is white and the edges are black, finishing the drawing of the circle
    strength = 1.0 - strength;
    return vec3(strength);
}

vec3 difused_circle() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0; // makes we get closer to 1.0 faster so we cut the value faster
    strength = 1.0 - strength;
    return vec3(strength);
}

vec3 light_point() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0); // pow makes the strength fades really faster
    return vec3(strength);
}

/**
* Main
*/
void main() {
    // since we are working with particles, each particle is actually a full uv plane.
    // so to draw a pattern on the particle we just need to edit the shader variable that
    // holds the particle coordinates, which is gl_PointCoord.

    // 4) we apply the strength to the color
    vec3 strength = light_point();
    vec3 final_color = mix(vec3(0.0), light_point(), vColor);
    gl_FragColor = vec4(final_color, 1.0);

}
