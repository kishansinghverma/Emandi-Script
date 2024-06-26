const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/public/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve('./dist'),
    }
};