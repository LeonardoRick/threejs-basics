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
import { debugGUIExample } from '../debug';
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
import { lightsExample } from '../lights';
import { shadowsExample, animatedShadowExample, bakedShadowExample } from '../shadows';
import { particlesExample, particlesWaveExample, galaxyGeneratorExample } from '../particles';
import { raycasterLineExample, raycasterMouseHoverExample } from '../raycaster';
import { physicsExample } from '../physics';
import { importDuckExample } from '../import-models';

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

    /* textures and materials */
    getRepeatExample,
    getCustomTextureExample,
    getTextureLoaderExample,
    getRotationExample,
    getNearestFilterExample,

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

    // lights
    lightsExample,
    shadowsExample,
    animatedShadowExample,
    bakedShadowExample,

    // particles
    particlesExample,
    particlesWaveExample,
    galaxyGeneratorExample,

    // raycaster
    raycasterLineExample,
    raycasterMouseHoverExample,

    // models
    importDuckExample,
    //others
    threeDText,
    debugGUIExample,
    physicsExample,
};

// check if route exists and is not the index route
if (currentRoute) {
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
