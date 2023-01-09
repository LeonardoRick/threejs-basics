import './style.css';
import {
    createCubeGroupSceneExample,
    animateCubeWithTimeExample,
    animateCubeWithClockExample,
    animateWithGsapExample,
} from './basic-animations';
import {
    perspectiveCameraExample,
    ortogarphicCameraExample,
    movePerspectiveCameraWithMouseExample,
    orbitControlsExample,
} from './cameras';
import { createMessyObjectExample, createTriangleExample } from './geometries';
import { debugGUIExample, setGUI } from './debug';
import { getCustomTexture } from './textures';

// show three cubes with different colors in a scene
// createCubeGroupSceneExample();

/* ANIMATIONS */

// show a red cube rotating fixed on the axis Y
// animateCubeWithTimeExample();

// show a red cube rotating fixed on the axis Y and moving a little bit the camera position
// animateCubeWithClockExample();

// show a red cube sliding to right
// animateWithGsapExample();

/* CAMERAS */

// show a red rectangle in a static front visualization
// perspectiveCameraExample();

// show a rectangle rotating on the axis y with the visualization of a ortographic camera
// ortogarphicCameraExample();

// show a cube that moves when we move the mouse around the scene
// movePerspectiveCameraWithMouseExample();

// show a cube that moves when we click on the scene and change the camera position
// when we right click and move the mouse
// orbitControlsExample();

/* GEOMETRIES */

// draw a simple triangle with 3 axes (custom object)
// createTriangleExample();

// draw random triangles inside a space range creating a messy format
// createMessyObjectExample();

/* lil-GUI */
// setGUI(); // call this for controls to appear;
// debugGUIExample();

/* TEXTURES */
getCustomTexture();
