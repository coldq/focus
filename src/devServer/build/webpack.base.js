const path = require('path')

module.exports = {
    entry: {
        index: './src/index.js',
        // entry: './src/entry.js'
    },

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js'
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 2,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
}