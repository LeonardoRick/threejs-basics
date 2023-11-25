import {
    ACESFilmicToneMapping,
    CineonToneMapping,
    CubeTextureLoader,
    LinearToneMapping,
    Mesh,
    MeshStandardMaterial,
    NoToneMapping,
    PCFShadowMap,
    Raycaster,
    ReinhardToneMapping,
    SRGBColorSpace,
    Vector3,
    sRGBEncoding,
} from 'three';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, glsl, setupDefaultCameraAndScene } from '../utils';
import { getGUI } from './debug';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { loopAnimation } from './basic-animations';

const canvasId = 'default-webgl';

// https://threejs-journey.com/lessons/post-processing
// Pass -> A step of post-processing and passing a scene on a render target.
// To add multiple passes we need at least 2 render targets.
// EffectComposer class will do most of the job for us. For perfomances try
// to use as less passes as possible.

export function mixWebGLAndHTMLExample() {
    const gui = getGUI();
    gui.close();
    const debugObject = {};
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId, { antialias: true });
    // resize false to resize later when we have access to the effect composer
    const camera = setupDefaultCameraAndScene(scene, renderer);
    camera.position.set(6, 0, -4);

    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new CubeTextureLoader();

    /**
     * Renderer (to see settings details go to realist-render.js)
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = SRGBColorSpace;

    gui.add(renderer, 'toneMapping', {
        No: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
    });
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

    /**
     * Models and Textures
     */

    const modelPath = '/models/DamagedHelmet/glTF/DamagedHelmet.gltf';
    gltfLoader.load(modelPath, (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.rotation.y = Math.PI * 0.5;
        scene.add(gltf.scene);

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
    environmentMap.colorSpace = SRGBColorSpace;
    environmentMap.outputColorSpace = SRGBColorSpace;
    scene.background = environmentMap;
    scene.environment = environmentMap;
    debugObject.envMapIntensity = 1;

    /**
     * points of interest
     */
    const raycaster = new Raycaster();
    const points = [
        {
            position: new Vector3(1.55, 0.3, -0.6),
            element: document.querySelector('.point-0'),
        },
        {
            position: new Vector3(0.5, 0.8, -1.6),
            element: document.querySelector('.point-1'),
        },
        {
            position: new Vector3(1.6, -1.3, -0.7),
            element: document.querySelector('.point-2'),
        },
    ];
    points.forEach((point) => {
        point.element.classList.add('visible');
    });
    loopAnimation(renderer, scene, camera, () => {
        points.forEach((point) => {
            const screenPosition = point.position.clone();
            // get the 3d position and project into a '2d' position (field of view of the camera).
            // it's camera normalized device coordinates (NDC)
            screenPosition.project(camera);
            const translateX = screenPosition.x * window.innerWidth * 0.5;
            const translateY = screenPosition.y * window.innerHeight * 0.5;

            point.element.style.transform = `translate(${translateX}px, ${-translateY}px)`;

            // the coordinates that screenPosition has (NDC) are the same that the raycaster uses to cast a ray
            // https://threejs.org/docs/#api/en/core/Raycaster.setFromCamera
            raycaster.setFromCamera(screenPosition, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            // with no intersection, just show the point
            if (intersects.length === 0) {
                point.element.classList.add('visible');
            } else {
                // the intersects list is ordered by distance, so the first element is the closest one
                const intersectionDistance = intersects[0].distance;
                const pointDistance = point.position.distanceTo(camera.position);
                if (pointDistance < intersectionDistance) {
                    point.element.classList.add('visible');
                } else {
                    point.element.classList.remove('visible');
                }
            }

            // point.element.classList.add('visible');
        });
    });

    // instead of adding reflection on each mesh, we can add it to the scene and then it will be applied to all meshes.
    // we do that by using the .envMap property of the material and we need to traverse the object to update each material
    const updateAllMaterials = () => {
        // it recursively goes through all the children of the scene so we can apply the envMap to all the materials
        scene.traverse((child) => {
            // if (child.isMesh && child.material.isMeshStandardMaterial) { // alternative way (showed in newer videos)
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
    renderer.render(scene, camera);

    applyOrbitControl(camera, canvas, renderer, scene);
}
