import { Mesh, Scene } from 'three';
import { Sizes } from './utils/sizes';
import Time from './utils/time';
import Camera from './camera';
import Renderer from './renderer';
import World from './world/world';
import Resources from './utils/resources';
import sources from './utils/sources';
import Debug from './utils/debug';

export default class AnimatedFox {
    constructor(canvas) {
        // Global access
        window.AnimatedFox = this;
        this.debug = new Debug();
        this.canvas = canvas;

        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera(this);
        this.renderer = new Renderer(this); // being renderer on each frame update
        this.world = new World(this);

        // Sizes resize event
        this.sizes.on('resize', () => {
            this.resize();
        });

        // Time tick event
        this.time.on('tick', () => {
            this.update();
        });
    }

    resize() {
        // Update camera
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.camera.update();
        this.renderer.update();
        this.world.update();
    }

    destroy() {
        // remove listeners
        this.sizes.off('resize');
        this.time.off('tick');
        this.scene.traverse((child) => {
            // some tricks to dispose everything we can
            if (child instanceof Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    // We even check if dispose exists on all values and runs it when it exists
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });
        this.camera.controls.dispose();
        this.renderer.instance.dispose();
        this.debug.dispose();

        // you can also remove the canvas from the DOM if you want, but it's not mandatory
        // since what remains on the screen is just the last frame that was rendered
        // this.canvas.remove();
    }
}
