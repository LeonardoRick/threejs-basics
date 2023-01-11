import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

const canvasId = 'default-webgl';
export function multipleMaterialsExample() {
    const material = new MeshBasicMaterial({ wireframe: true });
    const sphereMesh = new Mesh(new SphereGeometry(1), material);
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, sphereMesh, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
}
