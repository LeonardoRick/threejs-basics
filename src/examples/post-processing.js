import {
    ACESFilmicToneMapping,
    CineonToneMapping,
    CubeTextureLoader,
    LinearToneMapping,
    Mesh,
    MeshStandardMaterial,
    NoToneMapping,
    PCFShadowMap,
    ReinhardToneMapping,
    SRGBColorSpace,
    TextureLoader,
    Vector3,
    WebGLRenderTarget,
    sRGBEncoding,
} from 'three';
import { applyOrbitControl, applyOrbitControlOnEffectComposer } from './cameras';
import { getRendererSceneCanvas, glsl, setResizeListener, setupDefaultCameraAndScene } from '../utils';
import { getGUI } from './debug';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';

const canvasId = 'default-webgl';

// https://threejs-journey.com/lessons/post-processing
// Pass -> A step of post-processing and passing a scene on a render target.
// To add multiple passes we need at least 2 render targets.
// EffectComposer class will do most of the job for us. For perfomances try
// to use as less passes as possible.

export function postProcessingExample() {
    const gui = getGUI();
    gui.close();
    const debugObject = {};
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId, { antialias: true });
    // resize false to resize later when we have access to the effect composer
    const camera = setupDefaultCameraAndScene(scene, renderer, { resize: false });
    camera.position.set(6, 0, -4);

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
    renderer.toneMappingExposure = 0.8;
    renderer.outputColorSpace = SRGBColorSpace;

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

    const modelPath = '/models/DamagedHelmet/glTF/DamagedHelmet.gltf';
    gltfLoader.load(modelPath, (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.rotation.y = Math.PI * 0.5;
        scene.add(gltf.scene);

        updateAllMaterials();
    });

    // environment map to give the helmet a reflection and remove the black background
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/0/px.jpg',
        '/textures/environmentMaps/0/nx.jpg',
        '/textures/environmentMaps/0/py.jpg',
        '/textures/environmentMaps/0/ny.jpg',
        '/textures/environmentMaps/0/pz.jpg',
        '/textures/environmentMaps/0/nz.jpg',
    ]);
    // environmentMap.encoding = sRGBEncoding;
    // environmentMap.colorSpace = SRGBColorSpace;
    // environmentMap.outputColorSpace = SRGBColorSpace;
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
    // gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials);

    /**
     * Post processing
     */
    const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        // this will reactivate the antialiasing, that's why we need to provide a custom renderTarget.
        // if was not by that, we could not even pass a renderTarget to the effect composer. Find the
        // smallest value that works and remove the stairs in your object. If the screen has a high
        // pixel ratio we don't need the antialiasing, but if it has a low pixel ratio we need it.
        // this is applying a MSAA (Multi Sample Anti Aliasing) to the render target. the same
        // applied in the renderer when we set {antialias: true}.
        samples: renderer.getPixelRatio() === 1 ? 4 : 0,
    });
    const effectComposer = new EffectComposer(renderer, renderTarget);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    /**
     * Passes
     * a pass is like a step of post processing, where we can do whatever we
     *  want with the scene to improve it or change it a little bit, add efects etc.
     */
    const renderPass = new RenderPass(scene, camera);

    const dotScreenPass = new DotScreenPass();
    dotScreenPass.enabled = false;
    gui.add(dotScreenPass, 'enabled').name('Dot Screen Pass');

    const glitchPass = new GlitchPass();
    glitchPass.goWild = false; // wiiiiild
    glitchPass.enabled = false;
    gui.add(glitchPass, 'enabled').name('Glitch Pass');

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.enabled = false;
    gui.add(rgbShiftPass, 'enabled').name('RGB Shift Pass');

    const unreallBloomPass = new UnrealBloomPass();
    unreallBloomPass.strength = 0.3;
    unreallBloomPass.radius = 1;
    unreallBloomPass.threshold = 0.6;

    /**
     * Tint Pass
     */
    const tintShader = {
        uniforms: {
            // effectComposer will check our shader and look for a tDiffuse uniform and put the previous renderTarget with the.
            // last texture (scene drawn) in it. This way we can use the previous renderTarget as a texture in our shader.
            tDiffuse: { value: null },
            uTint: { value: new Vector3() },
        },
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vUv = uv;
            }
        `,
        fragmentShader: glsl`
            uniform sampler2D tDiffuse;
            uniform vec3 uTint;

            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                // passing the color straightforward would not change anything. but we'll change the color
                // a litlle bit to make it looks like a tintpPass
                color.rgb += vec3(uTint);
                gl_FragColor = color;
            }
        `,
    };

    const tintPass = new ShaderPass(tintShader);
    // tintPass.material.uniforms.uTint.value.set(0.5, 0.5, 0.5);
    gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name('Red Tint Pass');
    gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name('Green Tint Pass');
    gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name('Blue Tint Pass');

    /**
     * displacement Pass
     */
    const displacementShader = {
        uniforms: {
            // effectComposer will check our shader and look for a tDiffuse uniform and put the previous renderTarget with the.
            // last texture (scene drawn) in it. This way we can use the previous renderTarget as a texture in our shader.
            tDiffuse: { value: null },
            uNormalMap: { value: null },
        },
        vertexShader: /* glsl */ `
                varying vec2 vUv;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
        fragmentShader: glsl`
                uniform sampler2D tDiffuse;
                uniform sampler2D uNormalMap;

                varying vec2 vUv;
                void main() {
                    vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
                    vec2 newUv = vUv + normalColor.xy * 0.1;
                    vec4 color = texture2D(tDiffuse, newUv);

                    gl_FragColor = color;
                }
            `,
    };

    const displacementPass = new ShaderPass(displacementShader);

    displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
        '/textures/interfaceNormalMap.png'
    );

    displacementPass.enabled = false;
    gui.add(displacementPass, 'enabled').name('Displacement Pass');

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    const smaaPass = new SMAAPass(); // this pass is for antialiasing

    effectComposer.addPass(renderPass);
    effectComposer.addPass(dotScreenPass);
    effectComposer.addPass(glitchPass);
    effectComposer.addPass(rgbShiftPass);
    effectComposer.addPass(unreallBloomPass);
    effectComposer.addPass(tintPass);
    effectComposer.addPass(displacementPass);

    effectComposer.addPass(gammaCorrectionPass); // keep this at the end, except for antialising passes
    /**
     * SMAA Pass
     */
    // only add this pass if pixelRatio is not above one and if the browser supports webgl2 because if it does not
    // the previous randerTarget with custom samples will not work and the antialiasing will not be applied.
    if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
        effectComposer.addPass(smaaPass);
    }
    renderer.render(scene, camera);

    setResizeListener(camera, renderer, effectComposer);
    // applyOrbitControl(camera, canvas, renderer, scene);
    applyOrbitControlOnEffectComposer(camera, canvas, effectComposer, scene);
}
