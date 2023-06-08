export default [
    {
        name: 'environmentMapTexture',
        loader: 'cubeTextureLoader',
        path: [
            'textures/environmentMaps/5/px.jpg',
            'textures/environmentMaps/5/nx.jpg',
            'textures/environmentMaps/5/py.jpg',
            'textures/environmentMaps/5/ny.jpg',
            'textures/environmentMaps/5/pz.jpg',
            'textures/environmentMaps/5/nz.jpg',
        ],
    },
    {
        name: 'grassColorTexture',
        loader: 'textureLoader',
        path: 'textures/dirt/color.jpg',
    },
    {
        name: 'grassNormalTexture',
        loader: 'textureLoader',
        path: 'textures/dirt/normal.jpg',
    },
    {
        name: 'foxModel',
        loader: 'gltfLoader',
        path: 'models/FoxSpotLight/glTF/Fox.gltf',
    },
];
