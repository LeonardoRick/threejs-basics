import {
    BoxGeometry,
    Clock,
    DirectionalLight,
    Euler,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshNormalMaterial,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PlaneGeometry,
    SphereGeometry,
    TorusKnotGeometry,
    Vector3,
    Quaternion,
    DynamicDrawUsage,
} from 'three';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { applyOrbitControl } from './cameras';
import { loopAnimation } from './basic-animations';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import Stats from 'stats.js';

const canvasId = 'default-webgl';

// cool extension: https://chromewebstore.google.com/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk
export function performanceExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId, {
        antialias: true,
        powerPreference: 'high-performance',
    });
    const camera = setupDefaultCameraAndScene(scene, renderer);
    const cube = new Mesh(new BoxGeometry(2, 2, 2), new MeshStandardMaterial());

    camera.position.set(2, 2, 10);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    /**
     * Meshes
     */
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(-5, 0, 0);
    scene.add(cube);

    const torusKnot = new Mesh(new TorusKnotGeometry(1, 0.4, 128, 32), new MeshStandardMaterial());
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add(torusKnot);

    const sphere = new Mesh(new SphereGeometry(1, 32, 32), new MeshStandardMaterial());
    sphere.position.set(5, 0, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    const floor = new Mesh(new PlaneGeometry(10, 10), new MeshStandardMaterial());
    floor.position.set(0, -2, 0);
    floor.rotation.x = -Math.PI * 0.5;
    floor.castShadow = true;
    floor.receiveShadow = true;
    scene.add(floor);

    /**
     * Lights
     */
    const directionalLight = new DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 3, 2.25);
    scene.add(directionalLight);

    /**
     * Stats
     */
    // tip 1: stats.js to see fps drops
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const clock = new Clock();
    loopAnimation(renderer, scene, camera, () => {
        stats.begin();
        const elapsedTime = clock.getElapsedTime();
        // Update test mesh
        torusKnot.rotation.y = elapsedTime * 0.1;

        stats.end();
    });

    // tip 2: renderer.info
    console.log(renderer.info);

    // tip 3: dispose objects after removing them
    // scene.remove(cube);
    // cube.geometry.dispose();
    // cube.material.dispose();

    // tip 4: avoid lights as much as possible. iff you need a light, use ambient light
    // directional light or hemisphere light. Avoid point light and spot light that are more
    // performance heavy.
    // also avoid adding or removing lights, because materials will have to recompile

    // tip 5: avoid shadows, use baked shadows instead.

    // tip 6: only cast and receive shadows when needed
    // -- there's nothing generating shadow on torus so we can disable it on objects
    cube.receiveShadow = false;
    torusKnot.receiveShadow = false;
    sphere.receiveShadow = false;
    // -- floor is not casting shadow on anything so we can disable it
    floor.castShadow = false;

    // tip 7: if we dont have moving objects, we can disable shadow update
    // renderer.shadowMap.autoUpdate = false;

    /**
     * tip 8: use BufferGeometryUtils to merge geometries into a single geometry. This is awesome if we ahve
     * static objects. If we need ot move them latter, will not be posible to move them individually. If you need
     * to move them, use instanced mesh instead (next tip)
     */
    // const geometries = [];

    // const material = new MeshNormalMaterial();

    // for (let i = 0; i < 50; i++) {
    //     const geometry = new BoxGeometry(0.5, 0.5, 0.5);
    //     geometry.translate(
    //         (Math.random() - 0.5) * 10,
    //         (Math.random() - 0.5) * 10,
    //         (Math.random() - 0.5) * 10
    //     );
    //     geometry.rotateX(Math.random() * Math.PI);
    //     geometry.rotateY(Math.random() * Math.PI);
    //     geometries.push(geometry);
    // }
    // const finalGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
    // const mesh = new Mesh(finalGeometry, material);
    // scene.add(mesh);

    /**
     * tip 9: use instanced mesh to render multiple copies of the same geometry when you need to move them
     * separately later. This is awesome for particles, grass, trees, etc. For it you'll need to create a matrix
     * that will hold the position, rotation and scale of each mesh. You can use the InstancedMesh class to do it
     */

    const geometry = new BoxGeometry(0.5, 0.5, 0.5);

    const material = new MeshNormalMaterial();
    const mesh = new InstancedMesh(geometry, material, 50);
    // if you intend to move the mesh on each animation frame, add this usage on the matrix
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    for (let i = 0; i < 50; i++) {
        // the quaternion will hold the rotation of the mesh
        const quaternion = new Quaternion();
        quaternion.setFromEuler(
            new Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0)
        );
        const position = new Vector3(
            (Math.random() - 0.5) * Math.PI * 4,
            (Math.random() - 0.5) * Math.PI * 4,
            (Math.random() - 0.5) * Math.PI * 4
        );

        const matrix = new Matrix4();

        matrix.makeRotationFromQuaternion(quaternion);
        matrix.setPosition(position);
        mesh.setMatrixAt(i, matrix);
    }
    scene.add(mesh);

    // tip 10: prefer textures (gnerated on photoshop) over complex math formulas
    // tip 11: do calculations on the vertex shader instead of the fragment shader

    /**
     * Use the right material:
     * Some materials like MeshStandardMaterial or MeshPhysicalMaterial need more resources than materials
     * such as MeshBasicMaterial, MeshLambertMaterial or MeshPhongMaterial.
     */

    applyOrbitControl(camera, canvas, renderer, scene);
}
