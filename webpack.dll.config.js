const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    vender: ['jquery', 'jquery-pjax', 'vue', 'octicons']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    // for jquery plugins in vender dll
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.DllPlugin({
      path: 'manifest.vender.json',
      name: '[name]',
      context: __dirname
    })
  ]
}
