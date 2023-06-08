import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
    constructor(experience) {
        this.experience = experience;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.instance = null;
        this.controls = null;

        this.setInstance();
        this.setOrbitControls();
    }

    setInstance() {
        this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        // make animation smoother when drag and drop
        this.controls.enableDamping = true;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls.update();
    }
}
