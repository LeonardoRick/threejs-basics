import {
    AmbientLight,
    BoxGeometry,
    Clock,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight,
    HemisphereLightHelper,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    PointLight,
    PointLightHelper,
    RectAreaLight,
    SphereGeometry,
    SpotLight,
    SpotLightHelper,
    TorusGeometry,
    Vector3,
} from 'three';
import { loopAnimation } from './basic-animations';
import { applyOrbitControl } from './cameras';
import { getGUI, setGUI } from './debug';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

// Light notes:
// ambient light applies light on every direction of the object. Its really not
// realistic but works more like a  natural light that gives visibility to objects

// Light bouncing can be simulated with ambient light.
// Light boucing: The idea that we can see behind an object being iluminated in the front
//                because the light bounces on the other surfaces

// we can position a light looking to the center o the scene with the followign code:
// >  rectAreaLight.position.lookAt(-1.5, 0, 1.5);
// >  rectAreaLight.lookAt(new Vector3());
// we first position the light where we want and ask if to look to an empty vector3. an
// empty vector3 will be at the center of the scene

// try to add as few lights as possible. Lights decrease the performance. We even have a
// limitation in something around 50 lights
// Minimal cost:  AmbientLight and HemisphereLight
// Moderate cost: DirectionalLight and PointLight
// High cost: SpotLight and RectAreaLight

// if you really need a lot of lights, the ideal is to use BAKING
// BAKING: Printing the lights on the texture and applying it on the object.
// The drawback is that you can't move the light anymore

// always add helpers after changing and everything related to the light
const canvasId = 'default-webgl';

export function lightsExample() {
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    const directionalLight = new DirectionalLight(0x00fffc, 0.3); // its like the sun!
    // HemispehreLight comes from top to bottom and merge both colors a little bit at the middle
    const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff);
    const pointLight = new PointLight(0xff9000, 0.5);
    // elements that are more far than 3 units to not receive light from this source
    pointLight.distance = 3;
    pointLight.decay = 0.1; // how fast the light dim

    // only works with mesh standard material and mesh physical material
    const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 2, 3); // its like a lightbox

    const spotLight = new SpotLight(0x78ff00, 0.5); // like a flash light
    spotLight.distance = 10;
    spotLight.angle = Math.PI * 0.1;
    spotLight.penumbra = 0.25;
    spotLight.decay = 1;

    const material = new MeshStandardMaterial();
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);

    const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
    const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);
    const torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
    const plane = new Mesh(new PlaneGeometry(5, 5), material);

    const camera = setupDefaultCameraAndScene(scene, renderer);
    const clock = new Clock();
    material.roughness = 0.4;
    camera.position.z = 5;

    sphere.position.x = -1.5;
    torus.position.x = 1.5;

    plane.position.y = -0.65;
    plane.rotation.x = -Math.PI * 0.5;

    directionalLight.position.set(1, 0.25, 0);
    pointLight.position.set(1, -0.5, 1); // the light is really close to the floor
    rectAreaLight.position.set(-1.5, 0, 1.5);
    spotLight.position.set(0, 2, 3);

    rectAreaLight.lookAt(new Vector3());
    // we can't use lookAt on spotlight, instead we do something light that:
    scene.add(spotLight.target);
    spotLight.target.position.x = 1;

    scene.add(sphere, cube, plane, torus);

    // comment and uncomment the lights beign added to the scene to test
    // how they behave alone and combined

    const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.2);
    const directionalLightHelper = new DirectionalLightHelper(directionalLight, 0.2);
    const pointlightHelper = new PointLightHelper(pointLight, 0.2);
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    const spotLightHelper = new SpotLightHelper(spotLight);
    // since we moved the target of the spotLight, we need to udpate the helper on the next fame
    window.requestAnimationFrame(() => spotLightHelper.update());

    const lightsList = [
        { light: ambientLight },
        { light: directionalLight, helper: directionalLightHelper },
        { light: hemisphereLight, helper: hemisphereLightHelper },
        { light: pointLight, helper: pointlightHelper },
        { light: rectAreaLight, helper: rectAreaLightHelper },
        { light: spotLight, helper: spotLightHelper },
    ];

    setGUI();
    const gui = getGUI();
    lightsList.forEach(({ light, helper }) => {
        scene.add(light);
        const folder = gui.addFolder(light.type);
        folder.add(light, 'intensity').min(0).max(20);
        folder.add(light.position, 'x').min(-20).max(20);
        folder.add(light.position, 'y').min(-20).max(20);
        folder.add(light.position, 'z').min(-20).max(20);

        if (helper) {
            scene.add(helper);
            folder.add(helper, 'visible').name('Helper Visible');
        }
    });

    applyOrbitControl(camera, canvas, renderer, scene);
    loopAnimation(renderer, scene, camera, () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = 0.1 * elapsedTime;
        cube.rotation.y = 0.1 * elapsedTime;
        torus.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.x = 0.15 * elapsedTime;
        cube.rotation.x = 0.15 * elapsedTime;
        torus.rotation.x = 0.15 * elapsedTime;
    });
}
