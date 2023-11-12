uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
    // applying vElevation on the color means that when we want more color when
    // the elevation is higher, less color when the elevation is lower

    // using mix will apply the color itself together with the intensity based on the levaiton

    // for it so be perfect we need to increase the value of vElevation beacuse it's being decreased
    // on vertex shader when we multiply it by the uBigWavesElevation (initing at 0.2)
    vec3 color = mix(uDepthColor, uSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier );
    gl_FragColor = vec4(color, 1.0);
}
