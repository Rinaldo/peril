const merge = require('webpack-merge')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    // new BundleAnalyzerPlugin(),
    new UglifyJSPlugin({
      sourceMap: true
    }),
  ]
})
