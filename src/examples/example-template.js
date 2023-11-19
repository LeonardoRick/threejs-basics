import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { applyOrbitControl } from './cameras';

const canvasId = 'default-webgl';
export function example() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    const cube = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
    camera.position.set(2, 2, 6);
    scene.add(cube);

    applyOrbitControl(camera, canvas, renderer, scene);
}
