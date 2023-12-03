import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getRendererSceneCanvas, glsl, setupDefaultCameraAndScene } from '../utils';
import { applyOrbitControl } from './cameras';
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    MeshBasicMaterial,
    Points,
    SRGBColorSpace,
    ShaderMaterial,
    TextureLoader,
} from 'three';
import { getGUI } from './debug';
import { PERLIN_NOISE } from '../shaders-utils';

export function portalSceneExample() {
    const [renderer, scene, canvas] = getRendererSceneCanvas('default-webgl', { antialias: true });
    const camera = setupDefaultCameraAndScene(scene, renderer);
    camera.position.set(3, 2, 4);

    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();

    /**
     * baked
     */
    const bakedTexture = textureLoader.load('/models/Portal/baked.jpg');
    const bakedMaterial = new MeshBasicMaterial({ map: bakedTexture });
    // sometimes if its a random texture, we need to stop it being flipped
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = SRGBColorSpace;

    const poleLightMaterial = new MeshBasicMaterial({ color: 0xffffe5, blending: AdditiveBlending });

    /**
     * Portal
     *
     */
    const portalLightMaterial = new ShaderMaterial({
        // side: DoubleSide,
        uniforms: {
            uTime: { value: 0 },
            uColorMiddle: { value: new Color(0xff8100) },
            uColorOutter: { value: new Color(0xfbdeb6) },
        },
        vertexShader: getPortalVertexShader(),
        fragmentShader: getPortalFragmentShader(),
    });
    /**
     * Fireflies
     */
    // geometry
    const firefliesGeometry = new BufferGeometry();
    const firefliesCount = 30;
    const positionArray = new Float32Array(firefliesCount * 3);
    const scaleArray = new Float32Array(firefliesCount);
    for (let i = 0; i < firefliesCount; i++) {
        const ii = i * 3;
        // our scene is 4 units wide, so we want to spread the fireflies around that area (* 4)
        positionArray[ii + 0] = (Math.random() - 0.5) * 4;
        positionArray[ii + 1] = Math.random() * 2;
        positionArray[ii + 2] = (Math.random() - 0.5) * 4;

        scaleArray[i] = Math.random();
    }
    firefliesGeometry.setAttribute('position', new BufferAttribute(positionArray, 3));
    firefliesGeometry.setAttribute('aScale', new BufferAttribute(scaleArray, 1));

    // material
    const firefliesMaterial = new ShaderMaterial({
        transparent: true,
        // makes it more shining (lightning)
        blending: AdditiveBlending,
        // don't hide particles behind other particles
        depthWrite: false,
        uniforms: {
            uPixelRatio: { value: renderer.getPixelRatio() },
            uSize: { value: 100 },
            uTime: { value: 0 },
        },
        vertexShader: getFirefliesVertexShader(),
        fragmentShader: getFirefliesFragmentShader(),
    });
    const fireflies = new Points(firefliesGeometry, firefliesMaterial);
    scene.add(fireflies);

    gltfLoader.load('/models/Portal/portal.glb', (gltf) => {
        const meshes = gltf.scene.children;
        // baked
        const baked = meshes.find((child) => child.name.includes('baked'));
        baked.material = bakedMaterial;
        // poles
        meshes
            .filter((child) => child.name.includes('poleLight'))
            .forEach((lightMesh) => {
                lightMesh.material = poleLightMaterial;
            });
        // portal
        const portal = meshes.find((child) => child.name.includes('portalLight'));
        portal.material = portalLightMaterial;
        scene.add(gltf.scene);
    });

    /**
     * GUi
     */
    const gui = getGUI();
    const debugObject = {
        clearColor: '#282323', // original was #201919
        wantedMiddleColor: '0xff8100',
        wantedOutterColor: '0xfbdeb6',
        uSize: 100,
    };
    renderer.setClearColor(debugObject.clearColor);

    gui.add(firefliesMaterial.uniforms.uSize, 'value').min(1).max(500).step(1).name('Fireflies size');
    gui.addColor(debugObject, 'clearColor').onChange((value) => renderer.setClearColor(value));
    gui.addColor(debugObject, 'wantedMiddleColor')
        .onChange((value) => {
            console.log(value);
            portalLightMaterial.uniforms.uColorMiddle.value.set(value);
        })
        .name('Wanted Middle Color');
    gui.addColor(debugObject, 'wantedOutterColor')
        .onChange((value) => {
            console.log(value);
            portalLightMaterial.uniforms.uColorOutter.value.set(value);
        })
        .name('Wanted Outter Color');

    gui.addColor(portalLightMaterial.uniforms.uColorMiddle, 'value')
        .name('Portal Real Middle Color')
        .listen();
    gui.addColor(portalLightMaterial.uniforms.uColorOutter, 'value')
        .name('Portal Real Color Outter')
        .listen();

    const clock = new Clock();
    applyOrbitControl(camera, canvas, renderer, scene, () => {
        const elapsedTime = clock.getElapsedTime();
        firefliesMaterial.uniforms.uTime.value = elapsedTime;
        portalLightMaterial.uniforms.uTime.value = elapsedTime;
        firefliesMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    });
}

export function getPortalVertexShader() {
    return glsl`
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `;
}

export function getPortalFragmentShader() {
    return (
        PERLIN_NOISE +
        glsl`

        uniform float uTime;
        uniform vec3 uColorMiddle;
        uniform vec3 uColorOutter;

        varying vec2 vUv;

        void main() {
            #include <colorspace_fragment>;
            // tip: when using cnoise or something like, provide diferent values
            // to uTime multiplier so you have a animation that varies through time

            // DisplacedUv
            vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

            // Perlin noise
            // vUv * 5.0 --> is the same as --> vUv.x * 5.0, vUv.y * 5.0
            float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

            // Outer glow
            float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;

            strength += outerGlow;

            float sharpStrengh = step(-0.2, strength) * 0.8;

            // mix the sharp and the fluid portal
            strength += sharpStrengh;

            // clamp the strength so the color values can't be extrapolated
            // and them the colors are not mixed (clamp from 0 to 1)
            strength = clamp(strength, 0.0, 1.0);

            vec3 color = mix(uColorMiddle, uColorOutter, strength);

            gl_FragColor = vec4(color, 1.0);

        }
    `
    );
}

export function getFirefliesVertexShader() {
    return glsl`
        uniform float uPixelRatio;
        uniform float uSize;
        uniform float uTime;

        attribute float aScale;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            // we use the modelPosition.x as a 'random' number to make all
            // particles not to move sync together.
            float randomBasedOnTimeAndX = uTime + modelPosition.x * 100.0;
            // Multiplying by the scale makes the big fireflies
            // move more than the little ones
            modelPosition.y += sin(randomBasedOnTimeAndX) * aScale * 0.2;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
            gl_Position = projectionPosition;
            // this makes distance squares smaller
            float sizeAttenuation = 1.0 / - viewPosition.z;

            gl_PointSize = uSize * aScale * uPixelRatio * sizeAttenuation;
        }
    `;
}
export function getFirefliesFragmentShader() {
    return glsl`


        void main() {
            // each particle uv is inside gl_PointCoord, and the center
            // of the particle will be 0.5 0.5
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.05 * 2.0;
            gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
        }
    `;
}
