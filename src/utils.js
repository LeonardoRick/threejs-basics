import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
    SphereGeometry,
    TorusGeometry,
    TorusKnotGeometry,
} from 'three';

export function getCubeSetup(
    canvasId,
    width = window.innerWidth,
    height = window.innerHeight,
    resize = true,
    allowFullScreen = true,
    texture = null
) {
    const [renderer, scene] = getRendererSceneCanvas(canvasId, { width, height, allowFullScreen });
    const material = new MeshBasicMaterial({
        ...(texture ? { map: texture } : { color: 0xff0000 }),
    });

    const mesh = getCube(material);
    const camera = setupDefaultCameraAndScene(scene, renderer, { mesh, width, height, resize });
    return [renderer, scene, mesh, camera, material];
}

export function getCube(material) {
    return new Mesh(new BoxGeometry(1, 1, 1), material);
}

export function getSphere(material) {
    return new Mesh(new SphereGeometry(1, 32, 32), material);
}

export function getTorus(material) {
    return new Mesh(new TorusGeometry(1, 0.5, 16, 100), material);
}

export function getTorusKnot(material) {
    return new Mesh(new TorusKnotGeometry(1, 0.4, 100, 16), material);
}

export function getRendererSceneCanvas(
    canvasId,
    {
        width = window.innerWidth,
        height = window.innerHeight,
        allowFullScreen = true,

        /**
         * affects performance but gives a better rendering
         */
        antialias = false,
        /**
         * Can be "high-performance", "low-power" or "default"
         */
        powerPreference = 'default',
    } = {}
) {
    const canvas = document.getElementById(canvasId);
    const renderer = new WebGLRenderer({ canvas, antialias, powerPreference });
    const scene = new Scene();
    updateRendererSizeRatio(renderer, width, height);
    allowFullScreen && setFullScreenListener(canvas);
    return [renderer, scene, canvas];
}

export function setResizeListener(camera, renderer, composer = undefined) {
    window.addEventListener('resize', () => {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        // after updating camera we need to notify the camera to update the matrix
        camera.updateProjectionMatrix();

        // Update renderer
        updateRendererSizeRatio(renderer, window.innerWidth, window.innerHeight);
        // if we have an effect composers we should udpate its size as well
        if (composer) {
            updateRendererSizeRatio(composer, window.innerWidth, window.innerHeight);
        }
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

/**
 *
 * @param {import('three').Renderer} renderer
 * @param {number} width
 * @param {number} height
 */
export function updateRendererSizeRatio(renderer, width, height) {
    renderer.setSize(width, height);
    // some devices can have a pixelRatio of 5 and this costs too mutch to render because this means that each
    // pixel should process 5 virtual pixels inside of it. Since the human eye can't detect much information above
    // a pixel ratio of 2, we set this as our limit
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

export function setupDefaultCameraAndScene(
    scene,
    renderer,
    {
        mesh = null,
        resize = true,
        width = window.innerWidth,
        height = window.innerHeight,
        camera = null,
        near = 0.1,
        far = 2000,
    } = {}
) {
    const _camera = camera || new PerspectiveCamera(75, width / height, near, far);
    _camera.position.z = 3;
    if (mesh) {
        _camera.lookAt(mesh.position);
        scene.add(mesh);
    }
    scene.add(_camera); // https://github.com/mrdoob/three.js/issues/1046
    renderer.render(scene, _camera);
    resize && setResizeListener(_camera, renderer);
    return _camera;
}

// used to format template literals on glsl and show a
// formatted string by the extension glsl-literal
export const glsl = (x) => x[0];
