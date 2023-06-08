import EventEmitter from './event-emitter';

export class Sizes extends EventEmitter {
    constructor() {
        super();
        this.setup();
        // Resize event
        window.addEventListener('resize', () => {
            this.setup();
            this.trigger('resize');
        });
    }

    setup() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}
