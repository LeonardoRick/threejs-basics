import GUI from 'lil-gui';

export default class Debug {
    constructor() {
        // just add #debug at the end of your route to activate this.
        // ex: http://192.168.1.209:3000/animatedFoxExample.html#debug
        // after adding the #debug, refreshes the page
        this.active = window.location.hash === '#debug';
        if (this.active) {
            this.ui = new GUI();
        }
    }

    dispose() {
        if (this.ui) {
            this.ui.destroy();
        }
    }
}
