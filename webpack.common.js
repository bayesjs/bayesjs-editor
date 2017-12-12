const path = require('path');
const webpack = require('webpack');
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const srcPath = path.join(__dirname, 'src');

module.exports = {
  entry: {
    app: [path.join(srcPath, 'index.js')],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: srcPath,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { 
              loader: 'css-loader', 
              options: { 
                importLoaders: 1,
                modules: true,
                camelCase: 'dashes',
                localIdentName: '[local]__[path][name]__[hash:base64:5]'
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?v=.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
    ],
  },
  plugins: [
    // new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      inject: true,
      favicon: path.join(srcPath, 'favicon.ico'),
    }),
  ]
};
