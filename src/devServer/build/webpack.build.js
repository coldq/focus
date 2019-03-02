const baseConfig = require('./webpack.base');

module.exports = {
    mode: 'production',

    ... baseConfig,
    
    module: {},

    plugins: [],

    devServer: {}
}