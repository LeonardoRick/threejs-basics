import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
} from 'three';

export function getRedCubeSetup(
    canvasId,
    width = window.innerWidth,
    height = window.innerHeight,
    resize = true,
    allowFullScreen = true
) {
    const [canvas, renderer, scene] = getCanvasRendererScene(canvasId);
    const camera = new PerspectiveCamera(75, width / height);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), material);

    resize && setResizeListener(camera, renderer);
    allowFullScreen && setFullScreenListener(canvas);
    setupDefaultCameraAndScene(camera, scene, mesh);
    updateRenderer(renderer, width, height);
    return [renderer, scene, mesh, camera, material];
}

export function getCanvasRendererScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const renderer = new WebGLRenderer({ canvas });
    const scene = new Scene();
    return [canvas, renderer, scene];
}

export function setResizeListener(camera, renderer) {
    window.addEventListener('resize', () => {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        // after updating camera we need to notify the camera to update the matrix
        camera.updateProjectionMatrix();

        // Update renderer

        updateRenderer(renderer, window.innerWidth, window.innerHeight);
    });
}

export function setFullScreenListener(canvas) {
    canvas.addEventListener('dblclick', () => {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}

export function updateRenderer(renderer, width, height) {
    renderer.setSize(width, height);
    // some devices can have a pixelRatio of 5 and this costs too mutch to render because this means that each
    // pixel should process 5 virtual pixels inside of it. Since the human eye can't detect much information above
    // a pixel ratio of 2, we set this as our limit
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

export function setupDefaultCameraAndScene(camera, scene, mesh, zPosition = 3) {
    camera.position.z = zPosition;
    camera.lookAt(mesh.position);
    scene.add(mesh);
    scene.add(camera);
}
