const webpack = require('webpack')
const ejs = require('ejs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { version } = require('./package.json')

const entries = {
  background: ['./background'],
  'options/options': ['./configure-webpack', './options/options'],
  'content/content': ['./configure-webpack', './content/content']
}

const webpackConfigs = Object.keys(entries).map(key => {
  entry = entries[key]

  const config = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, 'src/'),
    entry: { [key]: entry },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: 'chrome-extension://__MSG_@@extension_id__/'
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
          test: /\.vue$/,
          loaders: 'vue-loader'
        },
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
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new CopyWebpackPlugin([
        { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
        { from: 'options/options.html', to: 'options/options.html', transform: transformHtml },
        {
          from: 'manifest.json',
          to: 'manifest.json',
          transform: content => {
            const jsonContent = JSON.parse(content)
            jsonContent.version = version

            if (config.mode === 'development') {
              jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'"
            }

            return JSON.stringify(jsonContent, null, 2)
          }
        }
      ]),
      new WebpackShellPlugin({
        onBuildEnd: ['node scripts/remove-evals.js']
      })
    ]
  }

  if (key !== 'background') {
    config.plugins = (config.plugins || []).concat([
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./manifest.vender-common.json')
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./manifest.vender-element.json')
      })
    ])
  }

  if (config.mode === 'production') {
    config.plugins = (config.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    ])
  }

  return config
})

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env
  })
}

module.exports = webpackConfigs
