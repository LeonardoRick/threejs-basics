import {
    ACESFilmicToneMapping,
    CameraHelper,
    CineonToneMapping,
    Clock,
    CubeTextureLoader,
    DirectionalLight,
    LinearToneMapping,
    Mesh,
    MeshDepthMaterial,
    MeshStandardMaterial,
    NoToneMapping,
    PCFShadowMap,
    RGBADepthPacking,
    ReinhardToneMapping,
    SRGBColorSpace,
    TextureLoader,
    sRGBEncoding,
} from 'three';
import { applyOrbitControl } from './cameras';
import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../utils';
import { getGUI } from './debug';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { loopAnimation } from './basic-animations';

const canvasId = 'default-webgl';

// https://threejs-journey.com/lessons/modified-materials
export function animateModelShaderExample() {
    const gui = getGUI();
    const clock = new Clock();
    gui.close();
    const debugObject = {};
    const [renderer, scene, canvas] = getRendererSceneCanvas(
        canvasId,
        window.innerWidth,
        window.innerHeight,
        true,
        true
    );
    const camera = setupDefaultCameraAndScene(scene, renderer);
    applyOrbitControl(camera, canvas, renderer, scene);

    camera.position.set(10, 2, -4);
    renderer.render(scene, camera);

    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new CubeTextureLoader();
    const textureLoader = new TextureLoader();

    /**
     * Renderer (to see settings details go to realist-render.js)
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    gui.add(renderer, 'toneMapping', {
        No: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
    });
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

    /**
     * Textures
     */
    const mapTexture = textureLoader.load('/models/Person/color.jpg');
    mapTexture.colorSpace = SRGBColorSpace;
    const normalTexture = textureLoader.load('/models/Person/normal.jpg');

    /**
     * material
     */
    const material = new MeshStandardMaterial({
        map: mapTexture,
        normalMap: normalTexture,
    });
    // when we create a directional light. Three.js converts our materials to MeshDepthMaterial so it can generate the shadow map.
    // the problem is that this depth material used by default by THREE.js doesn't change position when we rotate the objecton
    // the glsl shader. So we need to tell three.js to use a different depth material that will be updated when we rotate the object
    const depthMaterial = new MeshDepthMaterial({
        // hack to save more data on the depth material. The default behavior is to save the depth only in one
        // channel where the close is "white" and the far is "black"
        depthPacking: RGBADepthPacking,
    });

    const modelPath = '/models/Person/LeePerrySmith.glb';
    gltfLoader.load(modelPath, (gltf) => {
        // Model
        const mesh = gltf.scene.children[0];
        mesh.rotation.y = Math.PI * 0.5;
        mesh.material = material;
        mesh.customDepthMaterial = depthMaterial;
        scene.add(mesh);

        updateAllMaterials();
    });

    // environment map to give the helmet a reflection and remove the black background
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg',
    ]);
    // environmentMap.encoding = sRGBEncoding;
    scene.background = environmentMap;
    scene.environment = environmentMap;
    debugObject.envMapIntensity = 1;

    // instead of adding reflection on each mesh, we can add it to the scene and then it will be applied to all meshes.
    // we do that by using the .envMap property of the material and we need to traverse the object to update each material
    const updateAllMaterials = () => {
        // it recursively goes through all the children of the scene so we can apply the envMap to all the materials
        scene.traverse((child) => {
            if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
                // this next line do the same thing as scene.environment = environmentMap;
                // child.material.envMap = environmentMap;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.material.needsUpdate = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };
    gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials);

    const customUniforms = {
        uTime: { value: 0 },
    };

    /**
     * shader variable will have access to:
     * uniform: variables that are the same for all the vertices
     * vertexShader: function that will be executed for each vertex
     * fragmentShader: function that will be executed for each fragment
     * @param {THREE.Shader} shader
     */
    const rotate = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
                #include <common>

                uniform float uTime;
                mat2 get2dRotateMatrix(float _angle)
                {
                    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
                }
            `
        );

        /**
         * main variable declaration
         */
        shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            `
                void main() {
                    float angle = sin(position.y + uTime) * 0.2;

            `
        );

        /**
         * this part will only run for the real material, not the depth material
         * because the normals doesn't matter for the depth material
         */
        shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
                #include <beginnormal_vertex>
                objectNormal.xz *= get2dRotateMatrix(angle);
            `
        );

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
                #include <begin_vertex>
                //? rotate every vertex in the xz with this
                //? declared function get2dRotateMatrix
                transformed.xz *= get2dRotateMatrix(angle);
            `
        );
    };

    material.onBeforeCompile = rotate;
    // applying the rotation on the depth material fix the drop shadow but it doesnt' fix the core shadow.
    // it fixes the shadow that is projected by our model on other surfaces, but we will still have a problem
    // with the shadow from the model on itself. To fix that we need to update the normal of the real material
    depthMaterial.onBeforeCompile = rotate;

    loopAnimation(renderer, scene, camera, () => {
        const elapsedTime = clock.getElapsedTime();
        customUniforms.uTime.value = elapsedTime;
    });
    /**
     * Lights
     */
    const directionalLight = new DirectionalLight('#ffffff', 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 2, -2.25);
    directionalLight.intensity = 1;
    scene.add(directionalLight);

    gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light Intensity');
    gui.add(directionalLight.position, 'x').min(-50).max(50).step(0.001).name('Light X');
    gui.add(directionalLight.position, 'y').min(-50).max(50).step(0.001).name('Light y');
    gui.add(directionalLight.position, 'z').min(-50).max(50).step(0.001).name('Light z');
}
