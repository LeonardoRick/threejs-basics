import {
    AmbientLight,
    CameraHelper,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    SphereGeometry,
} from 'three';
import { applyOrbitControl } from './cameras';
import { getGUI, setGUI } from './debug';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

// shadow notes
// example on how shadow mapping works and how shadows are generated: https://threejs.org/examples/webgl_shadowmap_viewer.html

// Only the following lights support shadows: PointLight, DirectionalLight and SpotLight
const canvasId = 'default-webgl';
export function shadowsExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const material = new MeshStandardMaterial();
    const sphere = new Mesh(new SphereGeometry(0.5), new MeshStandardMaterial());
    const plane = new Mesh(new PlaneGeometry(5, 5), material);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    // directionalLight.shadow.camera.near = 1;
    // directionalLight.shadow.camera.far = 6;

    material.roughness = 0.7;
    plane.position.y = -0.65;
    plane.rotation.x = -Math.PI * 0.5;
    directionalLight.position.set(2, 2, -1);
    scene.add(sphere, plane);

    scene.add(ambientLight, directionalLight);

    renderer.shadowMap.enabled = true;
    sphere.castShadow = true; // sphere can geneate a shadow
    plane.receiveShadow = true; // can project a shadow

    directionalLight.castShadow = true;

    // increasing this values improve the quality of our shadow, but is less performant.
    // keep in ming that we need to use power of 2 values (4, 8, 12, 16) because of the
    // mipmaping. See texture.js notes for further understanding;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    // we can change the near and the far of the camera of the light because we don't want
    // the light to iluminate behind or scene (we don't need it so we remove it)
    const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
    scene.add(directionalLightCameraHelper);
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;
    window.requestAnimationFrame(() => directionalLightCameraHelper.update());

    camera.position.z = 10;
    camera.position.y = 10;
    camera.lookAt(sphere);

    setGUI();
    const gui = getGUI();
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);

    material.roughness = 0.7;
    gui.add(material, 'metalness').min(0).max(1).step(0.001);
    gui.add(material, 'roughness').min(0).max(1).step(0.001);
    gui.add(directionalLightCameraHelper, 'visible').name('Camera Helper');

    applyOrbitControl(camera, canvas, renderer, scene);
}
