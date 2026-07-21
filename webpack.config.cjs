const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/public/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/public/assets/style.css', to: 'assets/style.css' },
                { from: 'other/scriptloader.js', to: 'scriptloader.js' },
            ],
        }),
    ],
};