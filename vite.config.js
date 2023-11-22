import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import commonjs from 'vite-plugin-commonjs';
import { defineConfig } from 'vite';

import glsl from 'vite-plugin-glsl';

import { ROUTES } from './src/constants/routes';

process.env.BROWSER='Brave Browser'

export default defineConfig({
    root: './src/',
    publicDir: './static/',
    base: './',
    server: {
        host: true, // Open to local network and display URL
        // open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) ? true : false, // Open if it's not a CodeSandbox
        open: true,
    },
    build: {
        outDir: './dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true, // Add sourcemap
        rollupOptions: {
            input: {
                index: path.relative(__dirname, './src/ec6-index.js'),
                minimalSetup: path.relative(__dirname, './src/routes/canvas.js'),
            },
            // input: {
            //     ...ROUTES.reduce(
            //         (config, route) => {
            //             config[route.name] = path.resolve(__dirname, `../src/routes/canvas.js`);
            //             return config;
            //         },
            //         {
            //             index: path.resolve(__dirname, '../src/index.js'),
            //         }
            //     ),
            // },
            // input: {
            //     index: path.resolve(__dirname, './src/index.html'),
            // },
        },
    },
    plugins: [
        // glsl(),
        commonjs(),
        createHtmlPlugin({
            pages: [
                {
                    entry: path.resolve(__dirname, './src/ec6-index.js'),
                    filename: 'index.html',
                    template: './src/index.html',
                },
                {
                    entry: path.resolve(__dirname, './src/routes/canvas.js'),
                    filename: 'orbitControlsExample.html',
                    template: './src/routes/canvas.html',
                },
                // {
                //     entry: path.resolve(__dirname, './src/other.js'),
                //     filename: 'other.html',
                //     template: 'other.html',
                // }
                // {
                //     entry: path.resolve(__dirname, './src/ec6-index.js'),
                //     filename: 'teste.html',
                //     template: './src/routes/canvas.html',
                //     injectOptions: {
                //         data: {
                //             title: 'q saco',
                //         },
                //     },
                // },
                // {
                //     entry: path.resolve(__dirname, './src/routes/canvas.js'),
                //     filename: 'canvas.html',
                //     template: './src/routes/canvas.html',
                //     injectOptions: {
                //         data: {
                //             title: 'canvas',
                //         },
                //     },
                // },
                // {
                //     entry: path.resolve(__dirname, './src/routes/canvas.js'),
                //     filename: './src/routes/canvas.html',
                //     template: './src/routes/canvas.html'

                // },
                // ROUTES.reduce((config, route) => {
                //     config[route.name] = {
                //         entry: path.resolve(__dirname, './src/routes/canvas.js'),
                //         filename: './src/routes/canvas.html',
                //         template: './src/routes/canvas.html'
                //     }
                //     return config;
                // }, {})
            ],
        }),
        // {
        //     name: 'generate-html-files',
        //     apply: 'build',
        //     writeBundle() {
        //         const routes = ['minimalSetup']; // List of route names
        //         const templatePath = path.resolve(__dirname, 'src/routes/template.html');
        //         routes.forEach((route) => {
        //             const content = fs.readFileSync(templatePath, 'utf-8');
        //             // Modify the content of the template as needed
        //             // Write content to a new HTML file
        //             fs.writeFileSync(path.resolve(__dirname, `dist/${route}.html`), content);
        //         });
        //     },
        // },
    ],
})
