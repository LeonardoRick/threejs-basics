varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // uv is already defined because we are using a ShaderMaterial not a RawShaderMaterial
    vUv = uv;
}
