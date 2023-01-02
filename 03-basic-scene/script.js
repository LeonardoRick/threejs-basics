// scene
const scene = new THREE.Scene();

// red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// Sizes
const sizes = {
    height: 600,
    width: 800,
};
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// x -> horizontal;
// y -> vertical
// z -> depth
// the units used here are related to the ones used when creating
// the object with THREE.BOXGeometry()
camera.position.z = 3;
camera.position.x = 1;
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('webgl'),
});

scene.add(mesh);
scene.add(camera);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

export default function CreateCubeScene() {
    // scene
    const scene = new THREE.Scene();

    // red cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);

    // Sizes
    const sizes = {
        height: 600,
        width: 800,
    };
    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    // x -> horizontal;
    // y -> vertical
    // z -> depth
    // the units used here are related to the ones used when creating
    // the object with THREE.BOXGeometry()
    camera.position.z = 3;
    camera.position.x = 1;
    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('webgl'),
    });

    scene.add(mesh);
    scene.add(camera);
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
}
