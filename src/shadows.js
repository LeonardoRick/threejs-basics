import {
    AmbientLight,
    CameraHelper,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PlaneGeometry,
    SphereGeometry,
    Scene,
    SpotLight,
    Light,
    PointLight,
} from 'three';
import { applyOrbitControl } from './cameras';
import { getGUI, setGUI } from './debug';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

setGUI();
const gui = getGUI();
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
    const ambientLight = new AmbientLight(0xffffff, 0.3);

    setupDirectionalLight(scene);
    setupSpotLight(scene);
    setupPointLight(scene);

    material.roughness = 0.7;
    plane.position.y = -0.65;
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(sphere, plane);

    scene.add(ambientLight);

    renderer.shadowMap.enabled = true;
    sphere.castShadow = true; // sphere can geneate a shadow
    plane.receiveShadow = true; // can project a shadow

    // const spotLight
    // Different types of algorithms can be applied to shadow maps:
    // THREE.BasicShadowMap: Very performant but lousy quality
    // THREE.PCFShadowMap: Less performant but smoother edges
    // THREE.PCFSoftShadowMap: Less performant but even softer edges
    // THREE.VSMShadowMap: Less performant, more constraints, can have unexpected results
    renderer.shadowMap.type = PCFSoftShadowMap; // radious don't take effect on this algorithm;

    camera.position.z = 3;
    camera.position.y = 2;
    camera.position.x = -2;
    camera.lookAt(sphere);

    const generalGuiFolder = gui.addFolder('General');
    generalGuiFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient light intensity');
    material.roughness = 0.7;
    generalGuiFolder.add(material, 'metalness').min(0).max(1).step(0.001);
    generalGuiFolder.add(material, 'roughness').min(0).max(1).step(0.001);

    applyOrbitControl(camera, canvas, renderer, scene);
}

/**
 *
 * @param {Scene} scene
 * @returns {DirectionalLight} directionalLight
 */
function setupDirectionalLight(scene) {
    const directionalLight = new DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(2, 2, -1);

    directionalLight.castShadow = true;

    // increasing this values improve the quality of our shadow, but is less performant.
    // keep in ming that we need to use power of 2 values (4, 8, 12, 16) because of the
    // mipmaping. See texture.js notes for further understanding;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    // we can change the near and the far of the camera of the light because we don't want
    // the light to iluminate behind or scene (we don't need it so we remove it)
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;

    directionalLight.shadow.radius = 10; // blur the shadow a little bit;

    scene.add(directionalLight);
    addLightGui(scene, directionalLight, 'Directional Light');

    return directionalLight;
}

/**
 *
 * @param {Scene} scene
 * @returns {SpotLight} spotLight
 */
function setupSpotLight(scene) {
    const spotLight = new SpotLight(0xffffff, 0.3);
    spotLight.distance = 10;
    spotLight.angle = Math.PI * 0.3;
    spotLight.position.set(0, 2, 3);
    spotLight.castShadow = true;

    // increasing this values improve the quality of our shadow, but is less performant.
    // keep in ming that we need to use power of 2 values (4, 8, 12, 16) because of the
    // mipmaping. See texture.js notes for further understanding;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    // default 50, so we're decreasing the field of view
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;

    // on spot light specifically we need to add the spotLight.target at the scene as well
    scene.add(spotLight, spotLight.target);
    addLightGui(scene, spotLight, 'Spot Light');
    return spotLight;
}

/**
 *
 * @param {Scene} scene
 * @returns {Light} pointLight
 */
function setupPointLight(scene) {
    const pointLight = new PointLight(0xffffff, 0.3);
    pointLight.castShadow = true;
    pointLight.position.set(-1, 1, 0);

    // increasing this values improve the quality of our shadow, but is less performant.
    // keep in ming that we need to use power of 2 values (4, 8, 12, 16) because of the
    // mipmaping. See texture.js notes for further understanding;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;

    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 5;
    scene.add(pointLight);
    // the point light helper is weird because it uses a perspective camera 6 times to create an illumination in
    // every direciton. The helper that we can see, is the last position of the camera (usually pointing to bottom)

    // we cant' control the field of view on the point light because it illuminates in every direction
    addLightGui(scene, pointLight, 'Point Light');
    return pointLight;
}
/**
 * @param {Scene} scene
 * @param {Light} light
 * @param {string} name
 */
function addLightGui(scene, light, name) {
    const cameraHelper = new CameraHelper(light.shadow.camera);
    // since we updated the camera position the helper will only take effect if we update it on the next frame
    window.requestAnimationFrame(() => cameraHelper.update());
    cameraHelper.visible = false;
    scene.add(cameraHelper);

    const lightGuiFolder = gui.addFolder(name);
    lightGuiFolder.add(light, 'intensity').min(0).max(1).step(0.001);
    lightGuiFolder.add(light.position, 'x').min(-5).max(5).step(0.001);
    lightGuiFolder.add(light.position, 'y').min(-5).max(5).step(0.001);
    lightGuiFolder.add(light.position, 'z').min(-5).max(5).step(0.001);
    lightGuiFolder.add(cameraHelper, 'visible').name('Camera Helper');
}
