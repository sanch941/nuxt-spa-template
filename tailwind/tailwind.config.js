/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

const variants = require('./variants');
const plugins = require('./plugins');
const fonts = require('./fonts');

module.exports = {
    theme: {
        ...fonts,
        extend: {
            colors: {
                '252525': '#252525',
                'main-gray': '#E1E1E1',
                '3D3D3D': '#3D3D3D',
                'main-yellow': '#FFDC0A'
            },
            spacing: {
                '400px': '400px',
                '300px': '300px',
                '87px': '87px',
                '30%': '30%',
                '33%': '33%'
            }
        }
    },
    variants,
    plugins
};
