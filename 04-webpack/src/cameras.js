import { PerspectiveCamera } from 'three';
import { getRedCubeSetup } from './utils';

const canvasId = 'cameras-webgl';
export function perspectiveCamera() {
    const [renderer, scene, camera, mesh] = getRedCubeSetup(canvasId);
    const pCamera = new PerspectiveCamera(75, 800 / 600);
    pCamera.position.z = 3;
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
        renderer.render(scene, pCamera);
        window.requestAnimationFrame(tick);
    };
    tick();
}
