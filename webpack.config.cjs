const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/public/Emandi.js',
    output: {
        filename: 'emandi.js',
        path: path.resolve(__dirname, './dist'),
    },
};