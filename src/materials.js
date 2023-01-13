import {
    AmbientLight,
    BufferAttribute,
    Clock,
    Color,
    CubeTextureLoader,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    MeshToonMaterial,
    NearestFilter,
    PlaneGeometry,
    PointLight,
    SphereGeometry,
    TextureLoader,
    TorusGeometry,
} from 'three';
import { loopAnimation } from './basic-animations';
import { applyOrbitControl } from './cameras';
import { getGUI, setGUI } from './debug';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from './utils';

// Material notes:

// a material color can't be changed with material.color = 'red'. We need to to
// material.color.set('red') or material.color = new THREE.Color('red)

const canvasId = 'default-webgl';
const textureLoader = new TextureLoader();
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');

const ambientLight = new AmbientLight(0xffffff, 0.5);
const pointLight = new PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

export function basicMaterialExample() {
    return multipleMaterialsExample(getBasicMaterial());
}
export function normalMaterialExample() {
    return multipleMaterialsExample(getNormalMaterial());
}

export function matcapMaterialExample(textureNumber = 7) {
    return multipleMaterialsExample(getMeshMatcapMaterial(textureNumber));
}

export function lamberMaterialExample() {
    return multipleMaterialsExample(getMeshLambertMaterial());
}

export function phongMaterialExample() {
    return multipleMaterialsExample(getMeshPhongMaterial());
}

export function toonMaterialExample() {
    return multipleMaterialsExample(getMeshToonMaterial());
}

export function standardMaterialExample() {
    return multipleMaterialsExample(getMeshStandardMaterial());
}

export function environmentMapExample() {
    return multipleMaterialsExample(getEnvironmentMap());
}

function multipleMaterialsExample(material) {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);

    const sphere = new Mesh(new SphereGeometry(1, 64, 64), material);
    const plane = new Mesh(new PlaneGeometry(1, 1, 100, 100), material);
    const torus = new Mesh(new TorusGeometry(1, 0.5, 64, 128), material);
    const camera = setupDefaultCameraAndScene(scene, renderer);
    const clock = new Clock();
    camera.position.z = 5;
    sphere.position.x = -3;
    torus.position.x = 3;
    scene.add(sphere, plane, torus);
    scene.add(ambientLight, pointLight);

    // needed for ambient occlusion map to work. see the getMeshStandardMaterial example
    sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2));
    plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2));
    torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2));

    applyOrbitControl(camera, canvas, renderer, scene);
    loopAnimation(renderer, scene, camera, () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = 0.1 * elapsedTime;
        plane.rotation.y = 0.1 * elapsedTime;
        torus.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.x = 0.15 * elapsedTime;
        plane.rotation.x = 0.15 * elapsedTime;
        torus.rotation.x = 0.15 * elapsedTime;
    });
}

function getBasicMaterial() {
    const material = new MeshBasicMaterial();
    material.map = doorColorTexture;
    material.color.set('white');

    // material.color.set(0xff0000);
    // material.color = new Color('red');
    material.transparent = true;
    // material.opacity = 0.5;
    // alphaMap reads a texture in a way that where its black it do not show the image, where its white, it shows
    material.alphaMap = doorAlphaTexture;
    // allows you to see inside a cube, or any figure that has 3d cuted parts (cut like what alphaMap is doing).
    // allows to see the back of a plane as well
    material.side = DoubleSide;
    return material;
}

function getNormalMaterial() {
    const material = new MeshNormalMaterial();
    material.side = DoubleSide;
    // especific property from normal material that create visible shades on the object. try it!
    material.flatShading = true;
    return material;
}

function getMeshMatcapMaterial(textureNumber = 1) {
    // will display a color by using the normals as a reference to pick the right color on a texture that looks like a sphere.
    // The idea is basically create the experience of light without lights.
    // matcap repository: https://github.com/nidorx/matcaps
    const material = new MeshMatcapMaterial();
    const textures = {
        1: textureLoader.load('/textures/matcaps/1.png'),
        2: textureLoader.load('/textures/matcaps/2.png'),
        3: textureLoader.load('/textures/matcaps/3.png'),
        4: textureLoader.load('/textures/matcaps/4.png'),
        5: textureLoader.load('/textures/matcaps/5.png'),
        6: textureLoader.load('/textures/matcaps/6.png'),
        7: textureLoader.load('/textures/matcaps/7.png'),
        8: textureLoader.load('/textures/matcaps/8.png'),
    };
    material.matcap = textures[textureNumber];
    return material;
}

function getMeshDepthMaterial() {
    // this material only appears when you get closer to it
    const material = new MeshDepthMaterial();
    return material;
}

/************ ALL MATERIALS BELLOW REACTS TO LIGHT ************/

function getMeshLambertMaterial() {
    // most basic material that reacts to light
    const material = new MeshLambertMaterial();
    return material;
}

function getMeshPhongMaterial() {
    // less performant than lambert but do not have little ondulations giving a more fluid aspect
    const material = new MeshPhongMaterial();
    material.shininess = 100;
    // the geometry reflects a tiny red light with this setup
    material.specular = new Color('red');
    return material;
}

function getMeshToonMaterial() {
    // looks like a cartoon
    const material = new MeshToonMaterial();
    const gradiendTexture = textureLoader.load('/textures/gradients/3.jpg');
    gradiendTexture.minFilter = NearestFilter;
    gradiendTexture.magFilter = NearestFilter;
    gradiendTexture.generateMipmaps = false;
    material.gradientMap = gradiendTexture;
    return material;
}

function getMeshStandardMaterial() {
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
    const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
    const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
    const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
    const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');

    // The MeshStandardMaterial uses physically based rendering principles. (PBR) Like the MeshLambertMaterial
    // and the MeshPhongMaterial, it supports lights but with a more realistic algorithm and better
    // parameters like roughness and metalness.
    const material = new MeshStandardMaterial();
    material.side = DoubleSide;
    material.map = doorColorTexture;
    // mesh standard material allow aoMap (ambient occlusion map), what brings real life to objects and immersive experiences.
    // you can check on this example that if you remove it, the door looks flat, but with this effect, it really looks 3d on the plane
    material.aoMap = doorAmbientOcclusionTexture;
    material.aoMapIntensity = 2;

    // displacementMap create real depth on the geometry vertexes. For this to work properly the geometry needs to have
    // as much segments as possible, so the curves will be properly created
    material.displacementMap = doorHeightTexture;
    material.displacementScale = 0.05;

    // we should never combine this maps with the changing of the properties on the material, because it will create
    // a non-realistic behavior so once using the textures, comment the material properties
    material.metalnessMap = doorMetalnessTexture;
    material.roughnessMap = doorRoughnessTexture;
    material.metalness = 0.7;
    material.roughness = 0.2;

    // this texture add A LOT of details to the image
    material.normalMap = doorNormalTexture;
    material.normalScale.set(2, 2);

    // alphaMap with the proper texture, cuts the black part. So applying this filter on our door will cut a perfect rectangle around it
    material.alphaMap = doorAlphaTexture;
    material.transparent = true;
    addGuiOnStandardMaterial(material);

    return material;
}

function getEnvironmentMap() {
    // The ideia of the environment map is to reflect an environment on the object. So 6 figures are used to represent the environemtn and
    // we load all of them to create imersive images that looks like really present inside a scenario
    const cubeTextureLoader = new CubeTextureLoader();
    // change the 0 (0-3) to another number to see another environments

    // site with environment maps: https://polyhaven.com/ in HDRI format
    // to convert them to the 6 images we need, go to: https://matheowis.github.io/HDRI-to-CubeMap/
    // 1) Upload the image; 2) select cubemap view; 3); select the last option to export (6 separated images)
    const environmentNumber = 3;
    const environmentMapTexture = cubeTextureLoader.load([
        `textures/environmentMaps/${environmentNumber}/px.jpg`,
        `textures/environmentMaps/${environmentNumber}/nx.jpg`,
        `textures/environmentMaps/${environmentNumber}/py.jpg`,
        `textures/environmentMaps/${environmentNumber}/ny.jpg`,
        `textures/environmentMaps/${environmentNumber}/pz.jpg`,
        `textures/environmentMaps/${environmentNumber}/nz.jpg`,
    ]);
    const material = new MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.09;
    material.envMap = environmentMapTexture;
    addGuiOnStandardMaterial(material);

    return material;
}

function addGuiOnStandardMaterial(material) {
    setGUI();
    const gui = getGUI();
    gui.add(material, 'metalness').min(0).max(1).step(0.001);
    gui.add(material, 'roughness').min(0).max(1).step(0.001);
    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);
    gui.add(material, 'displacementScale').min(0).max(0.3).step(0.0001);
    gui.add(material.normalScale, 'x').min(0).max(10).step(0.001).name('Normal Scale - x');
    gui.add(material.normalScale, 'y').min(0).max(10).step(0.001).name('Normal Scale - y');
}
