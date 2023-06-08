import { AnimationMixer, Mesh } from 'three';

export default class Fox {
    constructor(experience) {
        this.experience = experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.deltaMultiplierMap = {
            running: 0.002,
        };

        // Setup
        this.debug = null;
        this.model = null;
        this.animation = {};
        this.source = this.resources.items.foxModel;
        this.setDebug();
        this.setModel();
        this.setAnimation();
    }

    setDebug() {
        this.debug = this.experience.debug;
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('fox');

            const debugObject = {
                playIdle: () => {
                    this.animation.play('idle');
                },
                playWalking: () => {
                    this.animation.play('walking');
                },
                playRunning: () => {
                    this.animation.play('running');
                },
            };
            this.debugFolder.add(debugObject, 'playIdle').name('Play Idle');
            this.debugFolder.add(debugObject, 'playWalking').name('Play Walking');
            this.debugFolder.add(debugObject, 'playRunning').name('Play Running');
        }
    }
    setModel() {
        this.model = this.source.scene;
        this.model.scale.set(0.02, 0.02, 0.02);
        this.scene.add(this.model);

        this.model.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
            }
        });
    }

    setAnimation() {
        this.animation.mixer = new AnimationMixer(this.model);
        // this.animation.action = this.animation.mixer.clipAction(this.source.animations[0]);
        // this.animation.action.play();

        this.animation.actions = {};
        this.animation.actions.idle = this.animation.mixer.clipAction(this.source.animations[0]);
        this.animation.actions.walking = this.animation.mixer.clipAction(this.source.animations[1]);
        this.animation.actions.running = this.animation.mixer.clipAction(this.source.animations[2]);

        this.animation.actions.current = this.animation.actions.idle;
        // this.animation.actions.current = this.animation.actions.walking;
        this.animation.actions.current.play();

        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);
            this.animation.actions.current = newAction;
            this.animation.name = name;
        };
    }

    update() {
        const multiplier = this.deltaMultiplierMap[this.animation.name] || 0.001;
        this.animation.mixer.update(this.time.delta * multiplier);
    }
}
