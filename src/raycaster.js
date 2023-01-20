import {
    Clock,
    Intersection,
    Mesh,
    MeshBasicMaterial,
    Raycaster,
    SphereGeometry,
    Vector2,
    Vector3,
} from 'three';
import { loopAnimation } from './basic-animations';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

const canvasId = 'default-webgl';
export function raycasterLineExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);

    const objectsToTest = getObjects();
    scene.add(...objectsToTest);
    const raycaster = new Raycaster();
    const clock = new Clock();
    const randoms = getRandoms();
    loopAnimation(renderer, scene, camera, () => {
        initialAnimation(clock, randoms, objectsToTest);
        const rayOrigin = new Vector3(-3, 0, 0);
        const rayDestination = new Vector3(1, 0, 0);
        rayDestination.normalize();
        raycaster.set(rayOrigin, rayDestination);
        const intersects = raycaster.intersectObjects(objectsToTest); // *
        setColorOnList(intersects, '#0000ff');
    });
}

export function raycasterMouseHoverExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);
    const objectsToTest = getObjects();
    scene.add(...objectsToTest);

    /** flag used to control mouseenter/mouseleave
     * @type {Intersection}
     */
    let currentIntersect;
    const raycaster = new Raycaster();
    // its not vector3 because its a mouse and we have only 2 dimensions moving it.
    // we set it to a negative value to ensure that the first position do not starts
    // at the top of anything on canvas
    const mouse = new Vector2(-1, -1);
    window.addEventListener('mousemove', ($event) => {
        // when the mouse is on the center o the screen the value is 0,
        // when it get close to the borders, goes up to (-2, 2)
        mouse.x = ($event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(($event.clientY / window.innerHeight) * 2 - 1);
        // ? Dont animate inside here because some browsers emmits more
        // ? mouse move events than the framerate
    });
    window.addEventListener('click', () => {
        if (currentIntersect) {
            currentIntersect.object.material.color.set('#00ff00');
        }
    });

    const clock = new Clock();
    const randoms = getRandoms();

    loopAnimation(renderer, scene, camera, () => {
        initialAnimation(clock, randoms, objectsToTest, false);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objectsToTest); // *

        if (intersects.length) {
            const isMouseEnter = !currentIntersect;
            currentIntersect = intersects[0];
            if (isMouseEnter) {
                console.log('mouse enter');
                currentIntersect.object.material.color.set('#0000ff');
            }
        } else {
            if (currentIntersect) {
                console.log('mouse leave');
                currentIntersect.object.material.color.set('#ff0000');
            }
            currentIntersect = null;
        }
    });
}

//*
// distance: the distance between the origin of the ray and the collision point.
// face: what face of the geometry was hit by the ray.
// faceIndex: the index of that face.
// object: what object is concerned by the collision.
// point: a Vector3 of the exact position in 3D space of the collision.
// uv: the UV coordinates in that geometry.

function initialAnimation(clock, randoms, objectsToTest, setColor = true) {
    const elapsed = clock.getElapsedTime();
    for (let [i, obj] of objectsToTest.entries()) {
        obj.position.y = Math.sin(elapsed * randoms[i]) * 1.5;
        if (setColor) {
            obj.material.color.set('#ff0000');
        }
    }
}
function getObjects() {
    const object1 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: '#ff0000' }));
    object1.position.x = -2;
    const object2 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: '#ff0000' }));
    const object3 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: '#ff0000' }));
    object3.position.x = 2;
    return [object1, object2, object3];
}

/**
 * @param {Intersection[]} list
 * @param {string} color
 */
function setColorOnList(list, color) {
    for (const inter of list) {
        inter.object.material.color.set(color);
    }
}

function getRandoms() {
    return [Math.random() + 0.3, Math.random() + 0.3, Math.random() + 0.3];
}
