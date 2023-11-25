import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { RGBELoader } from 'three/addons/loaders/RGBELoader';
import { EXRLoader } from 'three/addons/loaders/EXRLoader';
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox';
import { getRendererSceneCanvas, getTorusKnot, setupDefaultCameraAndScene } from '../utils';
import { applyOrbitControl } from './cameras';
import { getGUI } from './debug';
import {
    Clock,
    CubeCamera,
    CubeTextureLoader,
    EquirectangularReflectionMapping,
    HalfFloatType,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    SRGBColorSpace,
    TextureLoader,
    TorusGeometry,
    WebGLCubeRenderTarget,
} from 'three';
import { loopAnimation } from './basic-animations';
import * as THREE from 'three';

const canvasId = 'default-webgl';
/**
 * loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new CubeTextureLoader();
const rgbeLoader = new RGBELoader(); // for hdr images
const exrLoader = new EXRLoader();
const textureLoader = new TextureLoader();

// create enviornmentmap on blender: https://threejs-journey.com/lessons/environment-map (34min)
// cool sofware to generate environment maps: https://skybox.blockadelabs.com/
export function advancedEnvironmentMapExample() {
    const gui = getGUI();
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer, { far: 100 });
    camera.position.set(4, 5, 14);

    const controls = applyOrbitControl(camera, canvas, renderer, scene);
    controls.target.y = 3.5;

    /**
     * Torus knot
     */
    const standardMaterial = new MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa });
    const torusKnot = getTorusKnot(standardMaterial);
    torusKnot.position.y = 4;
    torusKnot.position.x = -4;

    const debugObject = {
        envMapIntensity: 3,
    };

    // the main goal of this function is to tweak the intensity of the environment on the mateirlals
    const updateAllMaterials = () => {
        // it recursively goes through all the children of the scene so we can apply the envMap to all the materials
        scene.traverse((child) => {
            // new way of checking if its a mesh with standar material
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                // this next line do the same thing as scene.environment = environmentMap;
                // child.material.envMap = environmentMap;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.material.needsUpdate = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };

    gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        scene.add(gltf.scene);
        scene.add(torusKnot);
        updateAllMaterials();
    });

    /**
     * Environment map
     */
    const cleanupRealtime = setRealtime(scene, renderer, camera);
    // create dropdown selector so we can test all the different environment maps
    const options = {
        BasicLDRCubeTexture: {
            func: setBasicLDR,
            cleanup: undefined,
        },
        HDR_RGBE_Equirectangular: {
            func: setHDR,
            cleanup: undefined,
        },
        HDR_Groundbox: {
            func: setHDRWithGroundbox,
            cleanup: undefined,
        },
        LDR_JPG_Equirectangular: {
            func: setLDREquirectangular,
            cleanup: undefined,
        },
        Realtime: {
            func: setRealtime,
            cleanup: cleanupRealtime,
        },
    };

    const environmentMapConfig = {
        lastSelected: options.Realtime,
        selected: options.Realtime,
    };

    gui.add(environmentMapConfig, 'selected', options).onChange((selected) => {
        if (environmentMapConfig.lastSelected.cleanup) {
            environmentMapConfig.lastSelected.cleanup();
        }

        const cleanup = selected.func(scene, renderer, camera);
        environmentMapConfig.lastSelected = { func: selected.func, cleanup };
    });

    gui.add(debugObject, 'envMapIntensity')
        .min(0)
        .max(10)
        .step(0.001)
        .name('envMapIntensity')
        .onChange(updateAllMaterials);

    gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001).listen();
    gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001).listen();
}

/**
 * LDR cube texture
 * @param {import('three').Scene} scene
 */
function setBasicLDR(scene) {
    const envMapNumber = 1;
    const environmentMap = cubeTextureLoader.load([
        `textures//environmentMaps/${envMapNumber}/px.jpg`,
        `textures//environmentMaps/${envMapNumber}/nx.jpg`,
        `textures//environmentMaps/${envMapNumber}/py.jpg`,
        `textures//environmentMaps/${envMapNumber}/ny.jpg`,
        `textures//environmentMaps/${envMapNumber}/pz.jpg`,
        `textures//environmentMaps/${envMapNumber}/nz.jpg`,
    ]);
    scene.background = environmentMap;
    scene.environment = environmentMap;
    scene.backgroundBlurriness = 0.1;
    scene.backgroundIntensity = 5; // background brightness
    return () => {
        scene.background.dispose();
        scene.environment.dispose();
        scene.background = null;
        scene.environment = null;
        scene.backgroundBlurriness = 0;
        scene.backgroundIntensity = 1;
    };
}

/**
 * HDR (RGBE) equi-rectangular texture
 * pros: better quality, cons: bigger file size
 * @param {import('three').Scene} scene
 */
function setHDR(scene) {
    rgbeLoader.load('/textures/hdr-envionmentMaps/2k.hdr', (hdrEnvironment) => {
        hdrEnvironment.mapping = EquirectangularReflectionMapping;
        scene.background = hdrEnvironment;
        scene.environment = hdrEnvironment;
    });
    return () => {
        scene.background.dispose();
        scene.environment.dispose();
        scene.background = null;
        scene.environment = null;
    };
}

/**
 * HDR (EXR) equi-rectangular texture
 * pros: better quality, cons: bigger file size
 * @param {import('three').Scene} scene
 */
function setHDRWithGroundbox(scene) {
    const gui = getGUI();
    let skybox;
    let guiRadius;
    let guiHeight;
    exrLoader.load('/textures/hdr-envionmentMaps/nvidiaCanvas-4k.exr', (exrEnvironment) => {
        exrEnvironment.mapping = EquirectangularReflectionMapping;
        // scene.background = exrEnvironment;
        scene.environment = exrEnvironment;
        // in this example we're using a custom skybox that is projected on the ground
        // so the loaded gltf model is positioned on the ground. BE CAREFUL, this only
        // works if the base of your gltf model is the 0. 0, 0 of the scene, because
        // that's where the skybox will be projected
        skybox = new GroundProjectedSkybox(exrEnvironment);
        skybox.scale.setScalar(50);
        guiRadius = gui.add(skybox, 'radius', 1, 200, 0.1).name('SkyBox Radius');
        guiHeight = gui.add(skybox, 'height', 1, 100, 0.1).name('SkyBox Height');
        console.log(skybox);
    });

    return () => {
        scene.environment.dispose();
        scene.environment = null;

        scene.remove(skybox);
        skybox.geometry.dispose();
        skybox.material.dispose();
        skybox = null;
        guiRadius.destroy();
        guiHeight.destroy();
    };
}

/**
 * LDR (JPG) equi-rectangular texture
 * @param {import('three').Scene} scene
 */
function setLDREquirectangular(scene) {
    // since its LDR the intensity of the light is not that
    // great so maybe we need to increase it (debugObject.envMapIntensity)
    const environmentMap = textureLoader.load(
        '/textures/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg'
    );
    environmentMap.mapping = EquirectangularReflectionMapping;
    environmentMap.colorSpace = SRGBColorSpace; // default is linear but we need sRGB
    scene.background = environmentMap;
    scene.environment = environmentMap;
    return () => {
        environmentMap.dispose();
        scene.background.dispose();
        scene.environment.dispose();
        scene.background = null;
        scene.environment = null;
    };
}
/**
 * Realtime environment map
 * @param {import('three').Scene} scene
 * @param {import('three').Renderer} renderer
 * @param {import('three').Camera} camera
 * @returns cleanup function
 */
function setRealtime(scene, renderer, camera) {
    const realtimeEnvironmentMap = textureLoader.load(
        '/textures/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
    );
    realtimeEnvironmentMap.mapping = EquirectangularReflectionMapping;
    realtimeEnvironmentMap.colorSpace = SRGBColorSpace;
    scene.background = realtimeEnvironmentMap;
    // holy donut
    const holyDonut = new Mesh(
        new TorusGeometry(8, 0.5),
        new MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
    );
    holyDonut.position.y = 3.5;

    scene.add(holyDonut);

    // cube render target
    // each render target will be one face of the cube (environment map).
    // HalfFloatType makes the render more similar to the HDR (default is more similar to a normal LDR)
    const cubeRenderTarget = new WebGLCubeRenderTarget(256, { type: HalfFloatType });
    // 0.1 is the near plane and 2000 is the far plane (default values for PersepectiveCamera)
    const cubeCamera = new CubeCamera(0.1, 100, cubeRenderTarget);
    scene.environment = cubeRenderTarget.texture;

    // Layers
    // Layers are like categories that can be set to any object inheriting from Object3D (Like a Mesh or a Camera)
    // By setting layers on a camera, it will only render the objects that are on the same layer as the camera.
    // the default is layer 0 for everytihing. Configuring the cube camera to be on layer 1 and the holy donut to be on layer 1
    // the cube camera will only render the holy donut, which is what we want, to generate this light experience and for reflecting
    // objects don't reflect themselves.
    cubeCamera.layers.set(1); //will enable a layer 1 and disable all others
    holyDonut.layers.enable(1); // will add a layer 1
    const clock = new Clock();
    loopAnimation(renderer, scene, camera, () => {
        if (holyDonut) {
            holyDonut.rotation.x = Math.sin(clock.getElapsedTime()) * 2;
            cubeCamera.update(renderer, scene);
        }
    });

    return () => {
        scene.remove(holyDonut);
        scene.remove(cubeCamera);
        realtimeEnvironmentMap.dispose();
        cubeRenderTarget.dispose();

        holyDonut.geometry.dispose();
        holyDonut.material.dispose();

        scene.environment.dispose();
        scene.background.dispose();
        scene.environment = null;
        scene.background = null;
    };
}
