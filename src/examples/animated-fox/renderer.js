import { CineonToneMapping, PCFSoftShadowMap, WebGLRenderer, sRGBEncoding } from 'three';

export default class Renderer {
    constructor(experience) {
        this.experience = experience;
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.instance = null;
        this.setInstance();
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.instance.physicallyCorrectLights = true;
        this.instance.outputEncoding = sRGBEncoding;
        this.instance.toneMapping = CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = PCFSoftShadowMap;
        this.instance.setClearColor('#211d20');
        this.resize();
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
    }
}
