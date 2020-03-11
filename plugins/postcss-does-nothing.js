const postcss = require('postcss');

module.exports = postcss.plugin('postcss-does-nothing', function(opts) {
    opts = opts || {};
    // Work with options here
    return function(root, result) {};
});
