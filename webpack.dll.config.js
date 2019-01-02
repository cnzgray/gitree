const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, 'src/'),
  entry: {
    common: ['jquery', 'jquery-pjax', 'vue', 'octicons'],
    element: ['./plugins/element.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    extensions: ['.js', '.ts', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: ['@babel/plugin-transform-typescript']
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?']
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?emitFile=false'
        }
      },
      {
        test: /\.(eot|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/vender'),
    filename: '[name].js',
    library: '[name]',
    publicPath: 'chrome-extension://__MSG_@@extension_id__/vender/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // for jquery plugins in vender dll
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.DllPlugin({
      path: 'manifest.vender-[name].json',
      name: '[name]',
      context: __dirname
    })
  ]
}
