const { ROUTE_GROUPS } = require('./route-groups');

module.exports = {
    ROUTES: [
        // basicAnimations
        {
            name: 'minimalSetup',
            displayName: 'Minimal Setup',
            group: ROUTE_GROUPS.basicAnimations,
        },
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
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'getCustomTextureExample',
            displayName: 'Custom Texture',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'getTextureLoaderExample',
            displayName: 'Texture Loader',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'getRotationExample',
            displayName: 'Rotation',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'getNearestFilterExample',
            displayName: 'Nearest Filter',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        // materials
        {
            name: 'basicMaterialExample',
            displayName: 'Basic Material',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'environmentMapExample',
            displayName: 'Environment Map',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'lamberMaterialExample',
            displayName: 'Lamber',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'matcapMaterialExample',
            displayName: 'Matcap',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'normalMaterialExample',
            displayName: 'Normal Material',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'phongMaterialExample',
            displayName: 'Phong',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'standardMaterialExample',
            displayName: 'Standard Material',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        {
            name: 'toonMaterialExample',
            displayName: 'Toon',
            group: ROUTE_GROUPS.texturesMaterials,
        },
        // lights
        { name: 'lightsExample', displayName: 'Lights', group: ROUTE_GROUPS.lights },
        { name: 'shadowsExample', displayName: 'Shadows', group: ROUTE_GROUPS.lights },
        { name: 'animatedShadowExample', displayName: 'Animated Texture Shadow', group: ROUTE_GROUPS.lights },
        { name: 'bakedShadowExample', displayName: 'Baked Texture Shadow', group: ROUTE_GROUPS.lights },

        // particles
        { name: 'particlesExample', displayName: 'Particles', group: ROUTE_GROUPS.particles },
        { name: 'particlesWaveExample', displayName: 'Particles Wave', group: ROUTE_GROUPS.particles },
        { name: 'galaxyGeneratorExample', displayName: 'Galaxy Generator', group: ROUTE_GROUPS.particles },
        {
            name: 'galaxyGeneratorShadersExample',
            displayName: 'Galaxy Generator Animated with Shaders',
            group: ROUTE_GROUPS.particles,
        },

        // raycaster
        { name: 'raycasterLineExample', displayName: 'Horizontal Line', group: ROUTE_GROUPS.raycaster },
        {
            name: 'raycasterMouseHoverExample',
            displayName: 'Mouse Hovering/Clicking',
            group: ROUTE_GROUPS.raycaster,
        },

        // models
        {
            name: 'importDuckExample',
            displayName: 'Duck',
            group: ROUTE_GROUPS.models,
        },
        {
            name: 'postProcessingExample',
            displayName: 'Post Processing',
            group: ROUTE_GROUPS.models,
        },
        {
            name: 'mixWebGLAndHTMLExample',
            displayName: 'Mix WebGL and HTML',
            group: ROUTE_GROUPS.models,
            html: 'mixWebGLAndHTMLExample',
        },
        {
            name: 'portalSceneExample',
            displayName: 'Portal Scene',
            group: ROUTE_GROUPS.models,
        },
        //rendering
        {
            name: 'realisticRender',
            displayName: 'Realistic Render',
            group: ROUTE_GROUPS.rendering,
        },
        {
            name: 'animatedFoxExample',
            displayName: 'Animated Fox',
            group: ROUTE_GROUPS.rendering,
            debug: true,
        },
        {
            name: 'realisticRenderLoading',
            displayName: 'Realistic Render Loading Animation',
            group: ROUTE_GROUPS.rendering,
        },
        {
            name: 'advancedEnvironmentMapExample',
            displayName: 'Advanced Environment Map',
            group: ROUTE_GROUPS.rendering,
        },
        // shaders
        {
            name: 'shaderExample',
            displayName: 'Shader Messy Square',
            group: ROUTE_GROUPS.shaders,
        },
        {
            name: 'shaderExample2',
            displayName: 'Shader 2',
            group: ROUTE_GROUPS.shaders,
        },
        {
            name: 'shaderMaterial',
            displayName: 'ShaderMaterial (not RawShaderMaterial)',
            group: ROUTE_GROUPS.shaders,
        },
        {
            name: 'ragingSeaExample',
            displayName: 'Raging Sea',
            group: ROUTE_GROUPS.shaders,
        },
        {
            name: 'animateModelShaderExample',
            displayName: 'Animate Model Shader',
            group: ROUTE_GROUPS.shaders,
        },
        // others
        {
            name: 'debugGUIExample',
            displayName: 'debug GUI',
            group: ROUTE_GROUPS.others,
        },
        { name: 'threeDText', displayName: '3D Text', group: ROUTE_GROUPS.others },
        { name: 'physicsExample', displayName: 'Physics', group: ROUTE_GROUPS.others },
        { name: 'performanceExample', displayName: 'Perfomance Boost', group: ROUTE_GROUPS.others },
    ],
};
