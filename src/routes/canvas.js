import './canvas.css';
import {
    createCubeGroupSceneExample,
    animateCubeWithTimeExample,
    animateCubeWithClockExample,
    animateWithGsapExample,
} from '../basic-animations';
import {
    perspectiveCameraExample,
    ortogarphicCameraExample,
    movePerspectiveCameraWithMouseExample,
    orbitControlsExample,
} from '../cameras';
import { createMessyObjectExample, createTriangleExample } from '../geometries';
import { debugGUIExample, setGUI } from '../debug';
import {
    getRepeatExample,
    getCustomTextureExample,
    getTextureLoaderExample,
    getRotationExample,
    getNearestFilterExample,
} from '../textures';
import {
    basicMaterialExample,
    environmentMapExample,
    lamberMaterialExample,
    matcapMaterialExample,
    normalMaterialExample,
    phongMaterialExample,
    standardMaterialExample,
    toonMaterialExample,
} from '../materials';
import { threeDText } from '../geometries/text-buffer-geometry';

const currentRoute = window.location.pathname.replace('/', '').replace('.html', '');

const methodObject = {
    /* basicAnimations */
    // show three cubes with different colors in a scene
    createCubeGroupSceneExample,
    // show a red cube rotating fixed on the axis Y
    animateCubeWithTimeExample,
    // show a red cube rotating fixed on the axis Y and moving a little bit the camera position
    animateCubeWithClockExample,
    // show a red cube sliding to right
    animateWithGsapExample,

    /* cameras */
    // show a red rectangle in a static front visualization
    perspectiveCameraExample,

    // show a rectangle rotating on the axis y with the visualization of a ortographic camera
    ortogarphicCameraExample,
    // show a cube that moves when we move the mouse around the scene
    movePerspectiveCameraWithMouseExample,

    // show a cube that moves when we click on the scene and change the camera position
    // when we right click and move the mouse
    orbitControlsExample,

    /* geometries */
    // draw a simple triangle with 3 axes (custom object)
    createTriangleExample,
    // draw random triangles inside a space range creating a messy format
    createMessyObjectExample,
    /* debug */
    debugGUIExample,

    /* textures */
    getRepeatExample,
    getCustomTextureExample,
    getTextureLoaderExample,
    getRotationExample,
    getNearestFilterExample,

    /* materials */
    basicMaterialExample,

    lamberMaterialExample,
    // send numbers from 1-8 to change the matcap in reference
    matcapMaterialExample,
    normalMaterialExample,
    phongMaterialExample,
    // pay attention to the huge details that we can see on the door in the middle
    standardMaterialExample,
    toonMaterialExample,
    // pay attention to the environment that is being reflected by the objects
    environmentMapExample,

    threeDText,
};

// check if route exists and is not the index route
if (currentRoute) {
    console.log('hi');
    // check if route is present on object, otherwise redirects to index.html
    if (methodObject.hasOwnProperty(currentRoute)) {
        showExample();
    } else {
        window.location.pathname = '/';
    }
}

function showExample() {
    methodObject[currentRoute]();
}
// window.location.pathname = '/';
