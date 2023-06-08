import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from './event-emitter';
import { CubeTextureLoader, TextureLoader } from 'three';

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();
        this.sources = sources;

        // Setup
        this.items = {};
        this.loaders = {};
        this.loaderNames = new Set(['gltfLoader', 'textureLoader', 'cubeTextureLoader']);

        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
    }

    startLoading() {
        for (const source of this.sources) {
            if (this.loaderNames.has(source.loader)) {
                this.loadModel(source);
            }
        }
    }

    loadModel(source) {
        this.loaders[source.loader].load(source.path, (file) => {
            this.loadSource(source, file);
        });
    }

    loadSource(source, file) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.trigger('resources-ready');
        }
    }
}
