import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
} from 'three';

export function getRedCubeSetup(canvasId) {
    const renderer = new WebGLRenderer({
        canvas: document.getElementById(canvasId),
    });
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 800 / 600);
    const mesh = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({ color: 0xff0000 })
    );

    camera.position.z = 3;
    scene.add(mesh);
    scene.add(camera);
    renderer.setSize(800, 600);
    return [renderer, scene, camera, mesh];
}
