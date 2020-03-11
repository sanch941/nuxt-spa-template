import path from 'path';
import { config } from 'dotenv';
import PurgecssPlugin from 'purgecss-webpack-plugin';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import tailwindCss from 'tailwindcss';
import autoPrefixer from 'autoprefixer';
import doesNothing from './plugins/postcss-does-nothing';
config();

export default {
    mode: 'spa',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: ['~assets/css/tailwind.css'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        { src: '~plugins/axios.client.js' },
        { src: '~plugins/object-fit-images.client.js' },
        { src: '~plugins/vue-notification.client.js' }
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module'
        // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    ],
    /*
     ** Nuxt.js modules
     */

    /*
     ** Build configuration
     */
    build: {
        extractCSS: true,
        /*
         ** You can extend webpack config here
         */
        postcss: {
            plugins: [
                postcssImport(),
                postcssPresetEnv({ stage: 1 }),
                tailwindCss(
                    path.resolve(__dirname, './tailwind/tailwind.config.js')
                ),
                process.env.NODE_ENV === 'production'
                    ? autoPrefixer()
                    : doesNothing()
            ]
        }
    },
    env: {
        dev: process.env.NODE_ENV === 'development',
        appVersion: process.env.APP_VERSION
    },
    extend(config, ctx) {
        if (!ctx.isDev) {
            config.plugins.push(
                new PurgecssPlugin({
                    paths: [
                        'components/**/*.vue',
                        'layouts/**/*.vue',
                        'pages/**/*.vue',
                        'plugins/**/*.js'
                    ],
                    styleExtensions: ['.css'],
                    whitelist: ['body', 'html', 'nuxt-progress'],
                    extractors: [
                        {
                            extractor(content) {
                                return content.match(/[\w-.:/]+(?<!:)/g);
                            },
                            extensions: ['html', 'vue', 'js']
                        }
                    ]
                })
            );
        }
    }
};
