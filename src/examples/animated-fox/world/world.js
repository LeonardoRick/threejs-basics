import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import Environment from './environment';
import Floor from './floor';
import Fox from './fox';

export default class World {
    constructor(experience) {
        this.experience = experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.floor = null;
        this.fox = null;
        this.environment = null;

        this.resources.on('resources-ready', () => {
            this.floor = new Floor(this.experience);
            this.fox = new Fox(this.experience);
            this.environment = new Environment(this.experience);
        });
    }

    update() {
        if (this.fox) {
            this.fox.update();
        }
    }
}
