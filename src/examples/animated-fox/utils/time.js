import EventEmitter from './event-emitter';

export default class Time extends EventEmitter {
    constructor() {
        super();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        // the default screens are running at 60 fps and at 60 fps,
        // the time it takes between each frame is 16.666666666666668
        this.delta = 16;
        // wait one frame by not calling directly this.click the first time
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger('tick');
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
}
