import * as THREE from 'three';
import gsap from 'gsap';

import { BoxGeometry, Clock, Group, Mesh, MeshBasicMaterial } from 'three';
import { getCubeSetup } from './utils';

const canvasId = 'default-webgl';
export function createCubeGroupSceneExample() {
    // scene
    const scene = new THREE.Scene();

    // group
    const group = new Group();
    const cube1 = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({ color: 0xff0000 })
    );
    cube1.position.x = -1.5;

    const cube2 = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({ color: 0x00ff00 })
    );

    const cube3 = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({ color: 0x0000ff })
    );
    cube3.position.x = 1.5;

    group.add(cube1);
    group.add(cube2);
    group.add(cube3);
    scene.add(group);
    const sizes = {
        width: 800,
        height: 600,
    };
    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    // x -> horizontal;
    // y -> vertical
    // z -> depth
    // the units used here are related to the ones used when creating
    // the object with THREE.BOXGeometry()
    // camera.position.x = 1;
    // camera.position.y = 1;
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById(canvasId),
    });

    scene.add(camera);
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
}

export function animateCubeWithTimeExample() {
    const [renderer, scene, mesh, camera] = getCubeSetup(canvasId);
    let time = Date.now();
    const tick = () => {
        // 144hz is faster than 60hz, so we use time to balance that.
        // the calculation and reexecution of 'tick' function is faster on a computer
        // with 144hz,  what would cause this function to run more times than in a 60hz
        // machine. but calculating a deltaTime (time before the function executes subtracted
        // by the time when we reach the const currentTime... line) on each step, is also
        // faster on a 144hz machine! so the deltaTime on a 144hz machine will be
        // lower than the deltaTime on a 60hz. so runing 000.1 * 2 (144hz PC) on two
        // interactions, will be the same as running 0.001 * 4 on one single interaction
        // (60hz pc). This way, we balance the framerate with the time and keep the animation
        // on the same speed on every machine.
        const currentTime = Date.now();
        const deltaTime = currentTime - time;
        time = currentTime;
        mesh.rotation.y += 0.001 * deltaTime;
        // Render
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };
    tick();
}

export function animateCubeWithClockExample() {
    const [renderer, scene, mesh, camera] = getCubeSetup(canvasId);
    const clock = new Clock();
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        // elapsedTime is a value that basicaly count the seconds.
        // overriting the rotation y with this value is enough to rotate
        // the square equally on all machines. If we want a full round of the
        // object per second, we use PI.
        mesh.rotation.y = elapsedTime * Math.PI;

        // With sin and cos we can get nice fluid and round animations
        camera.position.y = Math.sin(elapsedTime);
        camera.position.x = Math.cos(elapsedTime);
        // we can also make the camera move and look to the fixed object

        camera.lookAt(mesh.position);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };
    tick();
}

export function animateWithGsapExample() {
    const [renderer, scene, mesh, camera] = getCubeSetup(canvasId);
    gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
    const tick = () => {
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };
    tick();
}

export function animateExternalMeshWithClock(mesh, renderer, scene, camera) {
    const clock = new Clock();
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        mesh.rotation.y = (elapsedTime * Math.PI) / 2;
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };
    tick();
}

// allow objects and camera to have its properties re-rendered on the screen when some value change.

// this should be called everywhere because for screen resizing to do not distort our object,
// it need to rerender the scene
export function loopAnimation(renderer, scene, camera, callback = () => {}) {
    const animate = () => {
        callback();
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    animate();
}
