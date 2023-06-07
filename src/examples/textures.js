import { LoadingManager, NearestFilter, RepeatWrapping, Texture, TextureLoader } from 'three';
import { applyOrbitControl } from './cameras';
import { getCubeSetup } from '../utils';

// Texture notes:

// How the texture fulfill the geometry?
// UV unwrapping is like unwrapping an origami
// every geometry has uv coordinates and can be accessed on geometry.uv.
// Three.js geometries already have this settle, but if we create a custom geometry we need to set it. We can unwrap it using blender

//  The browser will download the texture, so usually use compress files (jpg)
//  Usually is better to use images with sizes that can be divided by two (so mipmaps can be generated properly)

// Where to find textures:
// - poliigon.com
// - 3dtextures.me
// - arroway-textures.ch
// - substance3d.com

const canvasId = 'default-webgl';
const canvas = document.getElementById(canvasId);
// we can create the texture before and then notify that the texture needs to be updated
export function getCustomTextureExample() {
    const image = new Image();
    image.src = '/textures/door/color.jpg';
    const texture = new Texture(image);
    image.onload = () => (texture.needsUpdate = true);
    setCubeOnTheScreen(texture);
}

export function getTextureLoaderExample() {
    const loadingManager = new LoadingManager();
    loadingManager.onStart = () => console.log('onStart');
    loadingManager.onLoad = () => console.log('onLoad');
    loadingManager.onProgress = () => console.log('onProgress');
    loadingManager.onError = () => console.log('onError');
    const textureLoader = new TextureLoader(loadingManager);
    const texture = textureLoader.load(
        '/textures/door/color.jpg',
        //load
        () => console.log('textureLoader - load'),
        // progress (not commonly used)
        () => {},
        //error
        () => console.log('textureLoader - error')
    );
    setCubeOnTheScreen(texture);
}

export function getRepeatExample() {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load('/textures/door/color.jpg');
    texture.repeat.x = 2;
    texture.repeat.y = 3;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    setCubeOnTheScreen(texture);
}

export function getRotationExample() {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load('/textures/door/color.jpg');
    // texture.rotation = Math.PI * 0.25;
    // we're changing the center of the drawing from the left bottom vertex to the center of the cube face.
    // we're using 0.5 because our cube has a x = 1 and a y = 1
    texture.center.x = 0.5;
    texture.center.y = 0.5;
    // thisture.magFilter = LinearFI
    setCubeOnTheScreen(texture);
}

export function getNearestFilterExample() {
    const path1 = '/textures/minecraft.png';
    const path2 = '/textures/checkerboard-8x8.png';
    const texture = new TextureLoader().load(path2);
    setCubeOnTheScreen(texture);
    // default is LinearFilter and add some strech and blury corners on the texture when needed. (generateMipmaps)
    // NearestFilter tries to enrich details of the texture and draw it sharp. Toggle the feature
    //  to see the difference between this two.

    // NearestFilter gives also a better frame rate so when its possible, use it.
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    // when we use minFilter = NearestFilter we dont need to generate mipmaps anymore
    texture.generateMipmaps = false;

    // Other filter options:
    // - THREE.NearestFilter
    // - THREE.LinearFilter (default)
    // - THREE.NearestMipmapNearestFilter
    // - THREE.NearestMipmapLinearFilter
    // THREE.LinearMipmapNearestFilter
    // THREE.LinearMipmapLinearFilter
}

// this is not related to textures and repeats in all funtions. To understand better
// this part navigate through to utils.js and geometries.js and other files
function setCubeOnTheScreen(texture) {
    const [renderer, scene, mesh, camera] = getCubeSetup(
        canvasId,
        window.innerWidth,
        window.innerHeight,
        true,
        true,
        texture
    );

    applyOrbitControl(camera, canvas, renderer, scene);
}
