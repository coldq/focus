const baseConfig = require('./webpack.base')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    ...baseConfig,
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, '../src/loaders')],
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                use: {
                    loader: 'sign-loader',
                    options: {
                        author: '兴爷'
                    }
                },
                include: [path.resolve(__dirname, '../src')], 
            }
        ]
    },

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