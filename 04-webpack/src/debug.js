import GUI from 'lil-gui';
import { applyOrbitControl } from './cameras';
import { getCubeSetup } from './utils';
import gsap from 'gsap';
// There are different types of elements you can add to that panel:

// Range —for numbers with minimum and maximum value
// Color —for colors with various formats
// Text —for simple texts
// Checkbox —for booleans (true or false)
// Select —for a choice from a list of values
// Button —to trigger functions
// Folder —to organize your panel if you have too many elements

// The tweaks are basic possible to be applied on any object with a property. [gui.add(obj, 'prop')]
// The ideia is that the debug will allow you to change this variables on your browser on the fly

let gui;
const canvasId = 'default-webgl';

export function setGUI() {
    if (!gui) {
        gui = new GUI({ width: 400 });
    }
}

export function getGUI() {
    return gui;
}

export function debugGUIExample() {
    const [renderer, scene, mesh, camera, material] = getCubeSetup(canvasId);
    applyOrbitControl(camera, document.getElementById(canvasId), renderer, scene);
    addTweak(mesh.position, 'x');
    addTweak(mesh.position, 'y');
    addTweak(mesh.position, 'z');
    addTweakVisibility(mesh);
    addTweakWireframe(material);
    addTweakColor(material);

    function spin() {
        gsap.to(mesh.rotation, { y: mesh.rotation.y + 10, duration: 1 });
    }
    mesh.spin = spin;
    addTweakSpin(mesh, spin);
}

function addTweak(vector, vertex, min = -3, max = 3, step = 0.01) {
    gui.add(vector, vertex).min(min).max(max).step(0.01).name(vertex);
}

function addTweakVisibility(mesh) {
    gui.add(mesh, 'visible');
}

function addTweakWireframe(material) {
    gui.add(material, 'wireframe');
}

function addTweakColor(material) {
    gui.addColor(material, 'color');
}

function addTweakSpin(mesh) {
    gui.add(mesh, 'spin');
}
