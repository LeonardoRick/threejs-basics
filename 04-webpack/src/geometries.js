import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from 'three';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setResizeListener, setupDefaultCameraAndScene } from './utils';

const canvasId = 'default-webgl';

export function createTriangleExample() {
    const [renderer, scene, _mesh, camera] = createCustomGeometry(canvasId);
    applyOrbitControl(camera, document.getElementById(canvasId), renderer, scene);
    renderer.render(scene, camera);
}

export function createMessyObjectExample() {
    const [renderer, scene, _mesh, camera] = createRandomObject(canvasId);
    applyOrbitControl(camera, document.getElementById(canvasId), renderer, scene);
    renderer.render(scene, camera);
}

function createCustomGeometry(
    canvasId,
    width = window.innerWidth,
    height = window.innerHeight,
    resize = true,
    allowFullScreen = true
) {
    const [renderer, scene] = getRendererSceneCanvas(canvasId, width, height, allowFullScreen);

    // each 3 indexes are a vertex (x, y z)
    const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
    const mesh = getCustomMesh(positionsArray);
    const camera = setupDefaultCameraAndScene(scene, mesh, renderer, width, height, resize);

    return [renderer, scene, mesh, camera];
}

function createRandomObject(
    canvasId,
    width = window.innerWidth,
    height = window.innerHeight,
    resize = true,
    allowFullScreen = true
) {
    const [renderer, scene] = getRendererSceneCanvas(canvasId, width, height, allowFullScreen);

    const count = 100;
    // each 3 indexes are a vertex (x, y z)
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
        positionsArray[i] = (Math.random() - 0.5) * count;
    }
    const mesh = getCustomMesh(positionsArray);
    const camera = setupDefaultCameraAndScene(scene, mesh, renderer, width, height, resize, 140);

    return [renderer, scene, mesh, camera];
}

export function getCustomMesh(positionsArray) {
    // using 3, we say that each 3 positions are a combination of one vertex
    const positionsAttribute = new BufferAttribute(positionsArray, 3);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', positionsAttribute);

    return new Mesh(geometry, new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
}
