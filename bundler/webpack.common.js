const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { ROUTES } = require('../src/constants/routes');

module.exports = {
    entry: ROUTES.reduce(
        (config, route) => {
            config[route.name] = path.resolve(__dirname, `../src/routes/canvas.js`);
            return config;
        },
        {
            index: path.resolve(__dirname, '../src/index.js'),
        }
    ),
    output: {
        hashFunction: 'xxhash64',
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, '../static') }],
        }),
        new HtmlWebpackPlugin({
            favicon: path.resolve(__dirname, '../static/images/favicon.ico'),
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true,
        }),
        ...ROUTES.map(
            (route) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    favicon: path.resolve(__dirname, '../static/images/favicon.ico'),
                    template: path.resolve(__dirname, `../src/routes/canvas.html`),
                    filename: `${route.name}.html`,
                    chunks: [route.name],
                })
        ),
        new MiniCSSExtractPlugin(),
    ],
    module: {
        rules: [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader'],
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },

            // CSS
            {
                test: /\.css$/,
                use: [MiniCSSExtractPlugin.loader, 'css-loader'],
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext]',
                },
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext]',
                },
            },
            // GLSL
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl-loader',
            },
        ],
    },
};
