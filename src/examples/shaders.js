import {
    BufferAttribute,
    Clock,
    Color,
    Mesh,
    PlaneGeometry,
    RawShaderMaterial,
    ShaderMaterial,
    TextureLoader,
    Vector2,
} from 'three';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { applyOrbitControl } from './cameras';
// webpack-glsl-loader will help us to import glsl flies
import testVertexShader from '../shaders/shaderExample/testVertex.glsl';
import testFragmentShader from '../shaders/shaderExample/testFragment.glsl';
import testVertexShader2 from '../shaders/shaderExample2/testVertex2.glsl';
import testFragmentShader2 from '../shaders/shaderExample2/testFragment2.glsl';
import shaderMaterialVertex from '../shaders/shaderMaterial/shaderMaterialVertex.glsl';
import shaderMaterialFragment from '../shaders/shaderMaterial/shaderMaterialFragment.glsl';
import { getGUI } from './debug';
import { loopAnimation } from './basic-animations';
const canvasId = 'default-webgl';

// https://www.shadertoy.com/browse (awesome examples)

// https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ (nice classes do go deep)

// shaders is one of the main component of webGL.
// there are 1) vertex shaders and 2) fragment shaders
// we write shaders in the GLSL language (OpenGL Shading Language). its really similar to C language
// we can't run console.log or print inside glsl files because they are run by the GPU, not the CPU

// Each matrix will do a part of the transformation:

// The modelMatrix will apply all transformations relative to the MESH. If we scale, rotate or move the Mesh,
// these transformations will be contained in the modelMatrix and applied to the position.

// The viewMatrix will apply transformations relative to the CAMERA. If we rotate the camera to the left, the
// vertices should be on the right. If we move the camera in direction of the Mesh, the vertices should get bigger, etc.

// The projectionMatrix will finally transform our coordinates into the final clip space coordinates.

export function shaderExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);

    /**
     * Test mesh
     */
    // Geometry
    const geometry = new PlaneGeometry(1, 1, 32, 32);
    // add random values to be retrieved inside the shader
    const { count } = geometry.attributes.position; // count of vertices
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        randoms[i] = Math.random();
    }
    // 1 is how much values from that array we should take for each vertex.
    // for positioning we need 3 values (x, y, z) but now it's just 1 so we
    // can see it going up and down randomly
    geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    // Material
    const material = new RawShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        // allow usage of alpha channel on textVertex.glsl
        transparent: true,
        // set material to have 2 sides
        side: 2,
        // map, alphaMap, opacity and color wont work with RawShaderMaterial
        // and if we want we would need to write this functions by ourselves
        // for this shader
    });
    // Mesh
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
}

export function shaderExample2() {
    const gui = getGUI();
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);

    // Geometry
    const geometry = new PlaneGeometry(1, 1, 32, 32);

    // add random values to be retrieved inside the shader
    const { count } = geometry.attributes.position; // count of vertices
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        randoms[i] = Math.random();
    }
    geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    const textureLoader = new TextureLoader();
    const flagTexture = textureLoader.load('/textures/flag-french.jpg');

    // Material
    const material = new RawShaderMaterial({
        vertexShader: testVertexShader2,
        fragmentShader: testFragmentShader2,
        transparent: true,
        side: 2,
        uniforms: {
            // can be accessed inside the shader
            uFrequency: { value: new Vector2(10, 5) },
            // we can't send big values inside the uniforms
            uTime: { value: 0 },
            uColor: { value: new Color('orange') },
            // we're going to pick the color of the texture
            // to colorise the mesh inside the shader
            uTexture: { value: flagTexture },
        },
    });

    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01);
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01);
    // Mesh
    const mesh = new Mesh(geometry, material);
    mesh.scale.y = 2 / 3;
    scene.add(mesh);

    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);

    const clock = new Clock();
    loopAnimation(renderer, scene, camera, () => {
        const elapsedTime = clock.getElapsedTime();
        // update material
        material.uniforms.uTime.value = elapsedTime;
    });
}

export function shaderMaterial() {
    // Then following uniforms are pre-defined if we use the ShaderMaterial
    // instead of the RawShaderMaterial:
    // uniform mat4 projectionMatrix;
    // uniform mat4 viewMatrix;
    // uniform mat4 modelMatrix;
    // attribute vec3 position;
    // attribute vec2 uv;
    // precision mediump float;

    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    // Geometry
    const geometry = new PlaneGeometry(1, 1, 32, 32);
    const material = new ShaderMaterial({
        vertexShader: shaderMaterialVertex,
        fragmentShader: shaderMaterialFragment,
        transparent: true,
        side: 2,
    });

    // Mesh
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
}
