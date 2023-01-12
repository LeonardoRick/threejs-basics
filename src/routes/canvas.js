import '../style.css';
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
    createCubeGroupSceneExample,
    threeDText,
};

console.log('currentRoute: ', currentRoute);
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
// window.location.pathname = '/';
