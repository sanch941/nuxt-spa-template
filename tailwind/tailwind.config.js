/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const styleGuide = require('./style-guide');
const dimensions = require('./dimensions');
const variants = require('./variants');
const plugins = require('./plugins');
const fonts = require('./fonts');

module.exports = {
    theme: {
        ...fonts,
        ...styleGuide,
        ...dimensions
    },
    variants,
    plugins
};
