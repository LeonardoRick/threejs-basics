// Physics notes:

import CANNON from 'cannon';

import {
    AmbientLight,
    Clock,
    CubeTextureLoader,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PCFShadowMap,
    PlaneGeometry,
    SphereGeometry,
    TextureLoader,
} from 'three';
import { loopAnimation } from './basic-animations';

import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

// We are going to create a invisible physics world that on each frame we
// update the position of objects and get the new positions. Then, we update or real world with the invisible physics world.

// 1) duplicate thins in physics world
// 2) update physics world on each frame
// 3) take back the positions of the objects and put them on our 3js objects

// npm i cannon

// Threejs Cannon equivalents
// - Scene -> World
// - Mesh -> Body
// - Geometry -> Shape

// Questions:
// Why my threejs floor updated its posistion to mathc the cannon floorBoby
// Instantly when we aedded it to the CANNON.world?
const canvasId = 'default-webgl';

export function physicsExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
    camera.position.set(-3, 3, 6);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    /**
     * Textures
     */
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
     * Physics
     */
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Physics - Materials
    // strings sent inside constructor is just a reference name, not a default behavior
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 0.1,
        restitution: 0.7,
    });
    world.defaultContactMaterial = defaultContactMaterial;

    /**
     * @type {Array<{ mesh: Mesh, body: CANNON.Body }>}
     */
    const objectsToUpdate = [];

    const { body: sphereBody } = createSphere(0.5, { x: 0, y: 3, z: 0 });
    createSphere(0.5, { x: -3, y: 3, z: -2 });

    // applyLocal force will apply a force with a specified origin on the second parameter.
    // if you want to the origin to be the body, use applyForce().
    // The 150 number is the strenght of the force applied
    sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));

    // Physics - Floor
    // this logical plane is infinite so it do not have edges and it fills the entire view
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    // you can add multiple shapes to a single body
    floorBody.addShape(floorShape);

    // before rotating we can see that the ball will bounce on an invisible plane shape and go in a
    // diferent direction. This happens because the initial axes is the same and the invisible plane and it
    // affects the position of our sphereBody.

    // since this logical plane has a infinite size, it doesnt matter how much we change the x or y values,
    // it will still pass throuh the origin created position (0, 0). To make the ball do not touch the plane
    // you can move the position.z axes so it will be a plane in front or back of our sphere, not affecting it course

    // after rotating the plane we can see the ball stoping on it
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
    world.addBody(floorBody);

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

    const clock = new Clock();
    let previousElapsedTime = 0;
    loopAnimation(renderer, scene, camera, () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousElapsedTime;
        previousElapsedTime = elapsedTime;

        // update physics on world simulating a wind on the sphere
        sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

        // for time step we want our experience to run at 60fps so we will use 1/60 and it will give the same results to
        // screens with higher resolution

        // for timeSinceLastCalled we will use deltaTime
        world.step(1 / 60, deltaTime, 3);

        for (const object of objectsToUpdate) {
            object.mesh.position.copy(object.body.position);
        }

        // console.log(sphere.position);
    });

    /**
     *
     * @param {number} radius
     * @param {{x: number, y: number, z: number}} position
     */
    function createSphere(radius, position) {
        console.log('createSphere');
        /**
         * Test sphere
         */

        const mesh = new Mesh(
            new SphereGeometry(radius, 32, 32),
            new MeshStandardMaterial({
                metalness: 0.3,
                roughness: 0.4,
                envMap: environmentMapTexture,
                envMapIntensity: 0.5,
            })
        );
        mesh.castShadow = true;
        mesh.position.copy(position);
        scene.add(mesh);

        // Physics - Sphere
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape,
        });
        body.position.copy(position);
        world.addBody(body);
        const obj = { mesh, body };
        objectsToUpdate.push(obj);
        return obj;
    }
}
