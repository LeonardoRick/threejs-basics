// https://threejs-journey.com/lessons/imported-models#
// Here's a list of popular 3D model formats you might come across: OBJ, FBX STL, PLY, COLLADA, 3DS, GLTF

import {
    AmbientLight,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PlaneGeometry,
} from 'three';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader';

// GLTF is the standard and supports WebGLGeometries, material, cameraas, lights,
// scene ChunkGraph, animations ,skeletons, morphing, ect
// If our idea is simple we can use a more simple format than gltf

// glTF
// theres a main .gltf file that refs a .bin and a .png
// glTF-Binary
// .glb bin file that can be easier to use and is usually lighter
// the problem is tahat we cant change anything, its a final image
// glTF-Draco
// equal to the default glTF, but its data is compressed
// glTF-Embedded
// .gltf (json) file that do not refers the .bin and .png, instead, embed its values on the json itself

// glTF objects are pbr (physics base rendering) that is used to try to have something realistic.
// The relative to it in ThreeJS is the MeshStandardMaterial
// So, for us to see the imported model we need some lights on the scene
const canvasId = 'default-webgl';

export function importDuckExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
    camera.position.set(3, 3, 3);
    const floor = new Mesh(
        new PlaneGeometry(10, 10),
        new MeshStandardMaterial({
            color: '#444444',
            metalness: 0,
            roughness: 0.5,
        })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;

    scene.add(floor);

    const ambientLight = new AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.shadow.camera.left = -7;
    scene.add(directionalLight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    // models
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
        '/models/Duck/PabloModels/duck_3.gltf',
        (gltf) => {
            // suceess
            // its better for now to add the object instead of the mesh inside of it because
            // it has the right scale. Its not a huge problem but we'll have a perspective camera
            // added that we're not going to use
            console.log(gltf);
            // gltf.scene.position.setY(2);
            scene.add(gltf.scene);
            // scene.add(gltf.scene.children[0]);
        },
        () => {
            //progress
            console.log('progress', new Date());
        },
        () => {
            console.log('errro');
        }
    );
}
