import AnimatedFox from './animated-fox';

export function animatedFoxExample() {
    // Canvas
    const canvas = document.getElementById('default-webgl');
    const animatedFox = new AnimatedFox(canvas);
    console.log(animatedFox);
}
