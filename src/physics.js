// Physics notes:

import {
    AmbientLight,
    CubeTextureLoader,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PCFShadowMap,
    PlaneGeometry,
    SphereGeometry,
    TextureLoader,
} from 'three';

import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

// We are going to create a invisible physics world that on each frame we
// update the position of objects and get the new positions. Then, we update or real world with the invisible physics world.

// 1) duplicate thins in physics world
// 2) update physics world on each frame
// 3) take back the positions of the objects and put them on our 3js objects

// npm i cannon
const canvasId = 'default-webgl';

export function physicsExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
    camera.position.set(-3, 3, 3);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    /**
     * Textures
     */
    const textureLoader = new TextureLoader();
    const cubeTextureLoader = new CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
        '/textures/environmentMaps/4/px.png',
        '/textures/environmentMaps/4/nx.png',
        '/textures/environmentMaps/4/py.png',
        '/textures/environmentMaps/4/ny.png',
        '/textures/environmentMaps/4/pz.png',
        '/textures/environmentMaps/4/nz.png',
    ]);

    /**
     * Test sphere
     */
    const sphere = new Mesh(
        new SphereGeometry(0.5, 32, 32),
        new MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5,
        })
    );
    sphere.castShadow = true;
    sphere.position.y = 0.5;
    scene.add(sphere);

    /**
     * Floor
     */

    const floor = new Mesh(
        new PlaneGeometry(10, 10),
        new MeshStandardMaterial({
            color: '#777777',
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5,
        })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
}
