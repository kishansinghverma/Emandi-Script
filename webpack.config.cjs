const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/public/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve('./dist'),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/public/assets/style.css', to: './assets/style.css' },
                { from: './other/scriptloader.js', to: './scriptloader.js' }
            ],
        }),
    ],
};