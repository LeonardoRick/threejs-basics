// Physics notes:

import * as CANNON from 'cannon-es';

import {
    AmbientLight,
    BoxGeometry,
    Clock,
    CubeTextureLoader,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PCFShadowMap,
    PlaneGeometry,
    SphereGeometry,
} from 'three';
import { getGUI } from './debug';
import { loopAnimation } from './basic-animations';

import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';

// We are going to create a invisible physics world that on each frame we
// update the position of objects and get the new positions. Then, we update or real world with the invisible physics world.

// 1) duplicate thins in physics world
// 2) update physics world on each frame
// 3) take back the positions of the objects and put them on our 3js objects

// npm i cannon

// The physics run on CPU and threejs runs on GPU

// Threejs Cannon equivalents
// - Scene -> World
// - Mesh -> Body
// - Geometry -> Shape

// When testing the collisions between objects, the default approach is testing every Body against every other Body.
// While this is easy to do, it's costly in terms of performance. This algorithim moment of testing colisions is called broadphase

// if you have objects that you know that they 'ill never colide, you can increase the performance by changing the broadphase algorithm

// There are 3 broadphase algorithms available in Cannon.js:

// NaiveBroadphase: Tests every Bodies against every other Bodies
// GridBroadphase: Quadrilles the world and only tests Bodies against other Bodies in the same grid box or the neighbors' grid boxes.
// SAPBroadphase (Sweep and prune broadphase): Tests Bodies on arbitrary axes during multiples steps. (More performant and straightforward)

// Constraints: https://threejs-journey.com/lessons/physics#constraints
// Constraints, as the name suggests, enable constraints between two bodies. We won't cover those in this lesson, but here's the list of constraints:

// HingeConstraint: acts like a door hinge.
// DistanceConstraint: forces the bodies to keep a distance between each other.
// LockConstraint: merges the bodies like if they were one piece.
// PointToPointConstraint: glues the bodies to a specific point.

const canvasId = 'default-webgl';

export function physicsExample() {
    const gui = getGUI();
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
    camera.position.set(-3, 3, 6);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    /**
     * Sounds
     */
    const hitSound = new Audio('/sounds/hit2.mp3');

    const playHitSound = (collideEvent) => {
        const impactStrength = collideEvent.contact.getImpactVelocityAlongNormal();
        const mass = collideEvent.target.mass;
        if (impactStrength > 1.5) {
            hitSound.volume = mass > 1 ? 1 : mass;
            hitSound.currentTime = 0;
            hitSound.play();
        }
    };

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
    // increase perfomance on colision detection. (See notes).
    // usually we have the same behavior but it can change on objects travelling too fast.
    //if it is not a problem to miss some colisions while very fast, use it as well!
    world.broadphase = new CANNON.SAPBroadphase(world);
    // if an object is not moving and don't touching any other body for too long,  it sleeps
    // and the physics are not tested until some force being applies on it again, what will
    // wake the body up,
    world.allowSleep = true;
    world.defaultContactMaterial = defaultContactMaterial;

    const debugObject = {
        createSphere: () => {
            createSphere(Math.random(), { x: Math.random() - 0.5, y: 3, z: Math.random() - 0.5 });
        },
        createBox: () => {
            createBox(Math.random() + 0.2, { x: Math.random() - 0.5, y: 3, z: Math.random() - 0.5 });
        },
        reset: () => {
            for (const obj of objectsToUpdate) {
                // remove body
                obj.body.removeEventListener('collide', hitSound);
                world.removeBody(obj.body);
                // remove mesh
                scene.remove(obj.mesh);
            }
            objectsToUpdate = [];
        },
    };
    gui.add(debugObject, 'createSphere');
    gui.add(debugObject, 'createBox');
    gui.add(debugObject, 'reset');
    /**
     * @type {Array<{ mesh: Mesh, body: CANNON.Body }>}
     */
    let objectsToUpdate = [];

    const sphereGeometry = new SphereGeometry(1, 32, 32);
    const material = new MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
    });
    const { body: sphereBody } = createSphere(0.5, { x: 0, y: 3, z: 0 });

    // applyLocalForce will apply a force with a specified origin on the second parameter.
    // if you want to the origin to be the body, use applyForce().
    // The 150 number is the strenght of the force applied
    sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));

    const boxGeometry = new BoxGeometry(1, 1, 1);

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
            object.mesh.quaternion.copy(object.body.quaternion); // on cannon js we dont' use rotation, we use quaternion
        }
    });

    /**
     *
     * @param {number} radius
     * @param {{x: number, y: number, z: number}} position
     */
    function createSphere(radius, position) {
        /**
         * Sphere
         */
        // creating a single geometry to every sphere we increase performance. To be
        // able to change the readius we can set the geometry with a default radius 1
        // and scale the entire mesh with the radius value
        const mesh = new Mesh(sphereGeometry, material);
        mesh.scale.set(radius, radius, radius);
        mesh.castShadow = true;
        mesh.position.copy(position);
        scene.add(mesh);

        // Physics - Sphere
        const shape = new CANNON.Sphere(radius);
        const body = new CANNON.Body({
            mass: 1,
            shape,
        });
        body.position.copy(position);
        world.addBody(body);
        const obj = { mesh, body };
        objectsToUpdate.push(obj);
        return obj;
    }

    /**
     * @param {number} size
     * @param {{x: number, y: number, z: number}} posistion
     */
    function createBox(size, posistion) {
        const mesh = new Mesh(boxGeometry, material);
        mesh.scale.set(size, size, size);
        mesh.castShadow = true;
        mesh.position.copy(posistion);

        scene.add(mesh);

        // Physics - Box
        // To create a box in CANNON its different than on THREE.js. its based on a halfExtents property which is,
        // in a nutshell, the width, height and depth divided by 2
        const shape = new CANNON.Box(new CANNON.Vec3(size * 0.5, size * 0.5, size * 0.5));
        const body = new CANNON.Body({
            // if we set the mass to 0 the object will not move
            mass: size,
            shape,
            type: 'static',
        });
        body.position.copy(posistion);
        body.addEventListener('collide', playHitSound);
        world.addBody(body);
        const obj = { mesh, body };
        objectsToUpdate.push(obj);
        return obj;
    }
}
