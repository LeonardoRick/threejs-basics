import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
} from 'three';

export function getRedCubeSetup(canvasId, width = 800, height = 600) {
    const renderer = new WebGLRenderer({
        canvas: document.getElementById(canvasId),
    });
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height);
    const mesh = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({ color: 0xff0000 })
    );

    camera.position.z = 3;
    camera.lookAt(mesh.position);
    scene.add(mesh);
    scene.add(camera);
    renderer.setSize(width, height);
    return [renderer, scene, mesh, camera];
}
