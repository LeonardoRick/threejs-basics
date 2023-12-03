import { CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding } from 'three';

export default class Floor {
    constructor(experience) {
        this.experience = experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.textures = {};

        this.setGeometry();
        this.setTextures();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new CircleGeometry(5, 64);
    }

    setTextures() {
        this.textures.color = this.resources.items.grassColorTexture;
        this.textures.normal = this.resources.items.grassNormalTexture;
        this.setTextureProperties(this.textures.color);
        this.setTextureProperties(this.textures.normal);
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
        });
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }

    setTextureProperties(texture) {
        texture.encoding = sRGBEncoding; // apparently replaced by environmentMap.colorSpace = SRGBColorSpace;
        texture.repeat.set(1.5, 1.5);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
    }
}
