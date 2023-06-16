import { DirectionalLight, Mesh, MeshStandardMaterial, sRGBEncoding } from 'three';

export default class Environment {
    constructor(experience) {
        this.experience = experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        this.environmentMap = {
            intensity: 1.4,
            texture: null,
            updateMaterials: null,
        };

        this.setDebug();
        this.setSunLight();
        this.setEnvironmentMap();
    }

    setDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Environment');
        }
    }

    setSunLight() {
        this.sunLight = new DirectionalLight('#ffffff', 4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 3, -1.25);
        this.scene.add(this.sunLight);

        // debug
        if (this.debug.active) {
            this.debugFolder.add(this.sunLight, 'intensity').name('Sun Intensity').step(0.001).min(0).max(10);
            this.debugFolder.add(this.sunLight.position, 'x').name('Sun X').step(0.001).min(-5).max(5);
            this.debugFolder.add(this.sunLight.position, 'y').name('Sun Y').step(0.001).min(-5).max(5);
            this.debugFolder.add(this.sunLight.position, 'z').name('Sun Z').step(0.001).min(-5).max(5);
        }
    }

    setEnvironmentMap() {
        // environmentMapTexture is the name we gave to this item on resources.js
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.encoding = sRGBEncoding;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
                    // apply the intensity of the environment map to all the materials and meshes
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;

                    child.material.needsUpdate = true;
                    child.receiveShadow = true;
                }
            });
        };
        this.environmentMap.updateMaterials();

        // debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .step(0.001)
                .min(0)
                .max(10)
                .onChange(this.environmentMap.updateMaterials);
        }
    }
}
