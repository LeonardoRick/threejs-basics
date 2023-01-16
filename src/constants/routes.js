const { ROUTE_GROUPS } = require('./route-groups');
module.exports = {
    ROUTES: [
        // basicAnimations
        {
            name: 'createCubeGroupSceneExample',
            displayName: 'Cube Group Scene',
            group: ROUTE_GROUPS.basicAnimations,
        },
        {
            name: 'animateCubeWithTimeExample',
            displayName: 'Animate Cube With Time',
            group: ROUTE_GROUPS.basicAnimations,
        },
        {
            name: 'animateCubeWithClockExample',
            displayName: 'Animate Cube With Clock',
            group: ROUTE_GROUPS.basicAnimations,
        },
        {
            name: 'animateWithGsapExample',
            displayName: 'Animate Cube WIth Gsap',
            group: ROUTE_GROUPS.basicAnimations,
        },

        // cameras
        {
            name: 'perspectiveCameraExample',
            displayName: 'Perspective Camera',
            group: ROUTE_GROUPS.cameras,
        },
        {
            name: 'ortogarphicCameraExample',
            displayName: 'Ortographic Camera',
            group: ROUTE_GROUPS.cameras,
        },
        {
            name: 'movePerspectiveCameraWithMouseExample',
            displayName: 'Perspective Camera Animated With Mouse Movement',
            group: ROUTE_GROUPS.cameras,
        },
        {
            name: 'orbitControlsExample',
            displayName: 'Ortographic Camera',
            group: ROUTE_GROUPS.cameras,
        },
        // geometries
        {
            name: 'createTriangleExample',
            displayName: 'Triangle',
            group: ROUTE_GROUPS.geometries,
        },
        {
            name: 'createMessyObjectExample',
            displayName: 'Messy Object',
            group: ROUTE_GROUPS.geometries,
        },
        // textures
        {
            name: 'getRepeatExample',
            displayName: 'Repeat Example',
            group: ROUTE_GROUPS.textures,
        },
        {
            name: 'getCustomTextureExample',
            displayName: 'Custom Texture',
            group: ROUTE_GROUPS.textures,
        },
        {
            name: 'getTextureLoaderExample',
            displayName: 'Texture Loader',
            group: ROUTE_GROUPS.textures,
        },
        {
            name: 'getRotationExample',
            displayName: 'Rotation',
            group: ROUTE_GROUPS.textures,
        },
        {
            name: 'getNearestFilterExample',
            displayName: 'Nearest Filter',
            group: ROUTE_GROUPS.textures,
        },
        //materials
        {
            name: 'basicMaterialExample',
            displayName: 'Basic Material',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'environmentMapExample',
            displayName: 'Environment Map',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'lamberMaterialExample',
            displayName: 'Lamber',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'matcapMaterialExample',
            displayName: 'Matcap',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'normalMaterialExample',
            displayName: 'Normal Material',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'phongMaterialExample',
            displayName: 'Phong',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'standardMaterialExample',
            displayName: 'Standard Material',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'toonMaterialExample',
            displayName: 'Toon',
            group: ROUTE_GROUPS.materials,
        },
        {
            name: 'debugGUIExample',
            displayName: 'debug GUI',
            group: ROUTE_GROUPS.debug,
        },
        // 3dText
        { name: 'threeDText', displayName: '3D Text', group: ROUTE_GROUPS.threeDtext },

        // lights
        { name: 'lightsExample', displayName: 'Lights', group: ROUTE_GROUPS.lights },
        { name: 'shadowsExample', displayName: 'Shadows', group: ROUTE_GROUPS.lights },
        { name: 'animatedShadowExample', displayName: 'Animated Texture Shadow', group: ROUTE_GROUPS.lights },
        { name: 'bakedShadowExample', displayName: 'Baked Texture Shadow', group: ROUTE_GROUPS.lights },
    ],
};
