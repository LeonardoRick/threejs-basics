import {
    ACESFilmicToneMapping,
    CineonToneMapping,
    CubeTextureLoader,
    DirectionalLight,
    LinearToneMapping,
    Mesh,
    MeshStandardMaterial,
    NoToneMapping,
    PCFShadowMap,
    ReinhardToneMapping,
    sRGBEncoding,
} from 'three';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { getGUI } from './debug';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvasId = 'default-webgl';

export function realisticRender() {
    const gui = getGUI();
    gui.close();
    const debugObject = {};
    const [renderer, scene, canvas] = getRendererSceneCanvas(
        canvasId,
        window.innerWidth,
        window.innerHeight,
        true,
        true
    );
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
    renderer.render(scene, camera);

    // loaders
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new CubeTextureLoader();

    // renderer
    // less bright, more realistic
    renderer.physicallyCorrectLights = true;
    // unsquize the color that was compressed on the linear encoding, giving a more realistic look
    renderer.outputEncoding = sRGBEncoding;
    renderer.toneMapping = ACESFilmicToneMapping; // mais bonitinho

    // depends on direcitonalLight.castShadow = true
    // and our materials receiving shadows
    // and  our materials casting shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    gui.add(renderer, 'toneMapping', {
        No: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
    });

    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);
    // models
    // const modelPath = '/models/FlightHelmet/glTF/FlightHelmet.gltf';
    const modelPath = '/models/Duck/PabloModels/duck_3.gltf';
    gltfLoader.load(modelPath, (gltf) => {
        // success
        console.log(gltf);
        gltf.scene.scale.set(4, 4, 4);
        gltf.scene.position.set(0, -1.5, 0);
        // gltf.scene.rotation.y = Math.PI * 0.1;
        scene.add(gltf.scene);
        gltf.scene.children = gltf.scene.children.filter((child) => !child.name.includes('Plane001'));
        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('Helmet Rotation');

        updateAllMaterials();
    });

    // environment map to give the helmet a reflection and remove the black background
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/ny.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg',
    ]);
    environmentMap.encoding = sRGBEncoding;
    scene.background = environmentMap;
    scene.environment = environmentMap;
    debugObject.envMapIntensity = 2.5;

    // instead of adding reflection on each mesh, we can add it to the scene and then it will be applied to all meshes.
    // we do that by using the .envMap property of the material and we need to traverse the object to update each material
    const updateAllMaterials = () => {
        // it recursively goes through all the children of the scene so we can apply the envMap to all the materials
        scene.traverse((child) => {
            if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
                // this next line do the same thing as scene.environment = environmentMap;
                // child.material.envMap = environmentMap;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.material.needsUpdate = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };
    gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials);

    // lights
    const directionalLight = new DirectionalLight('#ffffff', 3);
    directionalLight.position.set(1.167, 3.25, -0.99);
    directionalLight.castShadow = true;
    // optimizes since the shadow don't need to go far from the object. Uncomment camera helper to check
    directionalLight.shadow.camera.far = 15;
    // const directionalListCameraHelper = new CameraHelper(directionalLight.shadow.camera);
    // scene.add(directionalListCameraHelper);
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05; // fix shadow acne
    scene.add(directionalLight);

    gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity');
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('Light X');
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('Light y');
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('Light z');
}
