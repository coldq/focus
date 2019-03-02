const baseConfig = require('./webpack.base')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    ...baseConfig,

    module: {},

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Abc',
            template: path.resolve(__dirname, '../src/index.html')
        })
    ],

    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        host: 'localhost',
        compress: true,
        port: 9000
    }
}