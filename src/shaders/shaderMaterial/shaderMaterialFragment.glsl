#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

// this is not exactly random but it will do for now. its pseudo random
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// example: rotate(vUv, PI / 4.0, vec2(0.5));
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    float strength;
    // we are basically getting the position of the pixel
    // and setting the color to the position of the pixel
    // on red and green channels. This will create a gradient
    // that starts with lower red and green on left bottom corner
    // and ends with higher red and green on right top corner
    // because the position of the pixel is between 0.0 and 1.0
    // on both x and y axis and grow from left to right and bottom to top

    // green and pink gradient
    gl_FragColor = vec4(vUv, 1.0, 1.0); // the same as // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);

    // orange green gradient
    gl_FragColor = vec4(vUv, 0.0, 1.0); // the same as // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);

    // beautiful colorful gradient
    gl_FragColor = vec4(vUv, 0.5, 1.0); // the same as // gl_FragColor = vec4(vUv.x, vUv.y, 0.5, 1.0);

    // horizontal monocromatic gradient. THe x value grows horizontaly in a
    // xy chart. So increasing all colors by the same amount will create a
    // gray horizontal gradient from left to right
    gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);

    // vertical monocromatic gradient
    gl_FragColor = vec4(vUv.y, vUv.y, vUv.y, 1.0);


    // ----
    // waves that reaaches the limit 1.0 and then starts again from 0.0. For that we use a module of 1 which is basicaly
    // getting the rest of the division by 1.0. So when the value reaches 1.0 it will start again from 0.0
    strength = mod(vUv.y * 10.0, 1.0);
    gl_FragColor = vec4(strength, strength, strength, 1.0);

    // ----
    // step is like a if statement. If the first parameter is lower than the second parameter
    // it will return 0.0, otherwise it will return 1.0.
    strength = mod(vUv.y * 10.0, 1.0);
    strength = step(0.5, strength);

    // ----
    // this creates a grid
    strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // ----
    // this creates a lot of dots
    strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));


    // ----
    // this creates a crack
    strength = abs(vUv.x - 0.5);

    // ----
    // this create a black square in the middle
    strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // ----
    // this creates a monocromatic palete with 10 colors
    strength = floor(vUv.x * 10.0) / 10.0;

    // ----
    // this creates a monocromatic grid with 10 colors
    strength = floor(vUv.x * 10.0) / 10.0;
    strength *= floor(vUv.y * 10.0) / 10.0;

    // ----
    // this creates a not working TV effect
    // random don't exist in glsl
    strength = random(vUv);

    // combining the grid with random
    vec2 gridUv = vec2(
        floor(vUv.x * 10.0) / 10.0,
        floor(vUv.y * 10.0) / 10.0
    );
    strength = random(gridUv);

    // ----
    // nice spotlight star
    strength = 0.015  / distance(vUv, vec2(0.5));

    // ----
    // circle
    strength = step(0.25, distance(vUv, vec2(0.5)));

    // ----
    // circle wave
    strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // ----
    // waved uv
    vec2 wavedUv = vec2(
        vUv.x,
        vUv.y + sin(vUv.x * 30.0) * 0.1
    );
    strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // ----
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}

