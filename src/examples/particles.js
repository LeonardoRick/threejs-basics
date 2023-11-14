import {
    AdditiveBlending,
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    Mesh,
    MeshBasicMaterial,
    Points,
    PointsMaterial,
    Scene,
    ShaderMaterial,
    TextureLoader,
} from 'three';
import { loopAnimation } from './basic-animations';
import { applyOrbitControl } from './cameras';
import { getGUI } from './debug';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import vertexShader from '../shaders/galaxy/vertex.glsl';
import fragmentShader from '../shaders/galaxy/fragment.glsl';
const canvasId = 'default-webgl';
// Particles Notes:
// Particle assets pack:  https://www.kenney.nl/assets/particle-pack
// Creator of the particles pack: https://twitter.com/KenneyNL

export function particlesExample(animate = false) {
    const gui = getGUI();
    const textureLoader = new TextureLoader();
    const particleTexture = textureLoader.load('/textures/particles/3.png');
    // Particles
    const count = 20000;
    const arraysLength = count * 3;
    const positionsArray = new Float32Array(arraysLength);
    // since colors are RGB (3 information) exacly as the vertex (x, y, z) size,
    // the combination of multiple colors will be very similar
    const colorsArray = new Float32Array(arraysLength);
    for (let i = 0; i < arraysLength; i++) {
        positionsArray[i] = (Math.random() - 0.5) * 10;
        colorsArray[i] = Math.random(); // the value will be the intensity of the primary color
    }
    const geometry = new BufferGeometry();
    const material = new PointsMaterial({ size: 0.05, sizeAttenuation: true });
    const particles = new Points(geometry, material);
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);

    geometry.setAttribute('position', new BufferAttribute(positionsArray, 3));
    geometry.setAttribute('color', new BufferAttribute(colorsArray, 3));

    material.transparent = true;
    material.alphaMap = particleTexture;
    // material.alphaTest = 0.001; // hide black parts (don't even renderer it)

    // Don't care whats in the front or in the back, just draw everything. This causes a cube
    // to show the particles behind him if enabled
    // material.depthTest = false;

    // As we said, the WebGL is testing if what's being drawn is closer than what's already drawn.
    // The depth of what's being drawn is stored in what we call a depth buffer. Instead of not testing if the particle is closer
    // than what's in this depth buffer, we can tell the WebGL not to write particles of this material
    // in that depth buffer (you can comment the depthTest):
    material.depthWrite = false;

    // when we have particles that are drawn behind the other, it gets bright, like combining both textures into one
    material.blending = AdditiveBlending;
    // notify the material to use vertex colors as we setlle up with colorsArray float32Array
    material.vertexColors = true;
    // uncoment if stop using vertexColors
    // material.color = new Color('#ff88cc');

    scene.add(particles);
    const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: '#dddddd' }));
    cube.visible = false;
    scene.add(cube);

    gui.add(material, 'alphaTest').min(0).max(1).step(0.0001);
    gui.add(material, 'depthTest');
    gui.add(material, 'depthWrite');
    gui.add(cube, 'visible').name('Cube visibility');

    if (animate) {
        const clock = new Clock();
        loopAnimation(renderer, scene, camera, () => {
            const elapsedTime = clock.getElapsedTime();
            for (let i = 0; i < count; i++) {
                const i3 = i * 3; // *
                const x = geometry.attributes.position.array[i3];
                geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
            }
            geometry.attributes.position.needsUpdate = true;
        });
    }
    applyOrbitControl(camera, canvas, renderer, scene);
}

export function particlesWaveExample() {
    particlesExample(true);
}

/* ************************ GALAXY GENERATOR ************************ */
let geometry;
let material;
let points;

export function galaxyGeneratorExample() {
    const gui = getGUI();
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    const parameters = {
        count: 200000,
        size: 0.01,
        radius: 5,
        branches: 4,
        spin: 1,
        randomness: 0.02,
        randomnessPower: 3,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
    };
    applyOrbitControl(camera, canvas, renderer, scene);
    generateGalaxy(scene, parameters);

    gui.add(parameters, 'count').min(100).max(500000).step(100);
    gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001);
    gui.add(parameters, 'radius').min(0.01).max(20).step(0.01);
    gui.add(parameters, 'branches').min(2).max(20).step(1);
    gui.add(parameters, 'spin').min(-5).max(5).step(0.001);
    gui.add(parameters, 'randomness').min(0).max(2).step(0.001);
    gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001);
    gui.addColor(parameters, 'insideColor');
    gui.addColor(parameters, 'outsideColor');
    gui.onChange(() => generateGalaxy(scene, parameters));
}

export function galaxyGeneratorShadersExample() {
    const clock = new Clock();
    const gui = getGUI();
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    const parameters = {
        count: 200000,
        size: 0.01,
        radius: 5,
        branches: 4,
        spin: -0.5,
        randomness: 0.02,
        randomnessPower: 3,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
    };
    camera.position.z = 4;
    camera.position.y = 9;
    camera.lookAt(scene.position);
    applyOrbitControl(camera, canvas, renderer, scene);
    generateGalaxyWithShader(scene, renderer, parameters);

    gui.add(parameters, 'count').min(100).max(500000).step(100);
    gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001);
    gui.add(parameters, 'radius').min(0.01).max(20).step(0.01);
    gui.add(parameters, 'branches').min(2).max(20).step(1);
    gui.add(parameters, 'spin').min(-5).max(5).step(0.001);
    gui.add(parameters, 'randomness').min(0).max(2).step(0.001);
    gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001);
    gui.addColor(parameters, 'insideColor');
    gui.addColor(parameters, 'outsideColor');
    gui.onChange(() => generateGalaxyWithShader(scene, renderer, parameters));

    loopAnimation(renderer, scene, camera, () => {
        material.uniforms.uTime.value = clock.getElapsedTime();
    });
}

// * i3 explanation
// i = 0; i3 = 0
// i = 1; i3 = 3
// i = 2; i3 = 6
// i = 3; i3 = 9
// i = 4; i3 = 12
// i = 5; i3 = 15;

// V         V         V         V          V          V
// 0  1  2 | 3  4  5 | 6  7  8 | 9  10 11 | 12 13 14 | 15
// x  y  z | x  y  z | x  y  z | x  y  z  | x  y  z  | x  y  z |

/**
 * @param {Scene} scene
 * @param {BufferGeometry} geometry
 * @param {PointsMaterial} material
 * @param {Points} points
 * @param {{count: number, size: number}} parameters
 * @returns {Points} new points
 */
function generateGalaxy(scene, parameters) {
    if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    const positions = new Float32Array(parameters.count * 3); // three values (x, y, z) positions
    const colors = new Float32Array(parameters.count * 3); // three values (r, g, b) intensities

    const insideColor = new Color(parameters.insideColor);
    const outsideColor = new Color(parameters.outsideColor);
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3; // *

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin + radius;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        // when we use Math.[cos|sin]() we recieve values in the radius of 1. So we need to multiply it
        // with the desired value (our random radius)
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // x
        positions[i3 + 1] = randomY; // y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z

        // color
        // since color.lerp changes the source object, we need to clone it first
        const mixedColor = insideColor.clone();
        // radius / parameters.radius will give us something from 0 to 1 based on radius value.
        mixedColor.lerp(outsideColor, radius / parameters.radius);
        colors[i3 + 0] = mixedColor.r; // R
        colors[i3 + 1] = mixedColor.g; // G
        colors[i3 + 2] = mixedColor.b; // B
    }
    geometry = new BufferGeometry();
    material = new PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
    });
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    points = new Points(geometry, material);
    scene.add(points);
    return { geometry, material, points };
}

function generateGalaxyWithShader(scene, renderer, parameters) {
    if (points) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    const positions = new Float32Array(parameters.count * 3); // three values (x, y, z) positions
    const colors = new Float32Array(parameters.count * 3); // three values (r, g, b) intensities
    const scales = new Float32Array(parameters.count); // one single value for each particle
    const randomness = new Float32Array(parameters.count * 3); // three values (x, y, z) random offset

    const insideColor = new Color(parameters.insideColor);
    const outsideColor = new Color(parameters.outsideColor);
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3; // *

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin + radius;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        // when we use Math.[cos|sin]() we recieve values in the radius of 1. So we need to multiply it
        // with the desired value (our random radius)
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius; // x
        positions[i3 + 1] = 0.0; // y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius; // z

        // randomness to be applied inside shader
        randomness[i3 + 0] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;

        // color
        // since color.lerp changes the source object, we need to clone it first
        const mixedColor = insideColor.clone();
        // radius / parameters.radius will give us something from 0 to 1 based on radius value.
        mixedColor.lerp(outsideColor, radius / parameters.radius);
        colors[i3 + 0] = mixedColor.r; // R
        colors[i3 + 1] = mixedColor.g; // G
        colors[i3 + 2] = mixedColor.b; // B

        // scales
        scales[i] = Math.random();
    }
    geometry = new BufferGeometry();

    // advantages of using a shader material for a particle galaxy:
    // - animating each particle is a bad ideia. Animating the geometry, the buffer and attirbutes each frame is a bad
    // ideia because we have too many particles to tell Three.js that we did update them and we can have frame rate issues
    // quickly. In the other hand a shader animation is done in the GPU, so we don't need to update the geometry each frame.
    // - we can use randomness to create different sizes for each particle
    material = new ShaderMaterial({
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
        uniforms: {
            uSize: { value: 30 * renderer.getPixelRatio() },
            uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
    });
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new BufferAttribute(randomness, 3));

    points = new Points(geometry, material);
    scene.add(points);
    return { geometry, material, points };
}
