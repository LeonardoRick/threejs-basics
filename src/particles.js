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
    TextureLoader,
} from 'three';
import { loopAnimation } from './basic-animations';
import { applyOrbitControl } from './cameras';
import { getGUI, setGUI } from './debug';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

const canvasId = 'default-webgl';
setGUI();
const gui = getGUI();
// Particles Notes:
// Particle assets pack:  https://www.kenney.nl/assets/particle-pack
// Creator of the particles pack: https://twitter.com/KenneyNL

export function particlesExample(animate = false) {
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
                const i3 = i * 3;
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
