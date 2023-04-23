const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/static/Emandi.js',
    output: {
        filename: 'emandi.js',
        path: path.resolve(__dirname, './dist'),
    },
};