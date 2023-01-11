import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export function getCubeSetup(
    canvasId,
    width = window.innerWidth,
    height = window.innerHeight,
    resize = true,
    allowFullScreen = true,
    texture = null
) {
    const [renderer, scene] = getRendererSceneCanvas(canvasId, width, height, allowFullScreen);
    const material = new MeshBasicMaterial({
        ...(texture ? { map: texture } : { color: 0xff0000 }),
    });
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), material);

    const camera = setupDefaultCameraAndScene(scene, mesh, renderer, width, height, resize);
    return [renderer, scene, mesh, camera, material];
}

export function getRendererSceneCanvas(
    canvasId,
    width = window.innerWidth,
    height = window.innerHeight,
    allowFullScreen = true
) {
    const canvas = document.getElementById(canvasId);
    const renderer = new WebGLRenderer({ canvas });
    const scene = new Scene();
    updateRendererSizeRatio(renderer, width, height);
    allowFullScreen && setFullScreenListener(canvas);
    return [renderer, scene, canvas];
}

export function setResizeListener(camera, renderer) {
    window.addEventListener('resize', () => {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        // after updating camera we need to notify the camera to update the matrix
        camera.updateProjectionMatrix();

        // Update renderer
        updateRendererSizeRatio(renderer, window.innerWidth, window.innerHeight);
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

export function updateRendererSizeRatio(renderer, width, height) {
    renderer.setSize(width, height);
    // some devices can have a pixelRatio of 5 and this costs too mutch to render because this means that each
    // pixel should process 5 virtual pixels inside of it. Since the human eye can't detect much information above
    // a pixel ratio of 2, we set this as our limit
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

export function setupDefaultCameraAndScene(
    scene,
    mesh,
    renderer,
    width = window.innerWidth,
    height = window.innerHeight,
    resize = true,
    zPosition = 3,
    camera = null
) {
    const _camera = camera || new PerspectiveCamera(75, width / height);
    _camera.position.z = zPosition;
    _camera.lookAt(mesh.position);
    scene.add(mesh);
    scene.add(_camera); // https://github.com/mrdoob/three.js/issues/1046
    resize && setResizeListener(camera, renderer);
    return _camera;
}
