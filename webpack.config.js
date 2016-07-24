const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const pluginsDev = [];
const pluginsProd = [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: { warnings: false },
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),
];

module.exports = {
  devtool: isProd ? false : 'eval-source-map',
  entry: {
    app: [path.join(__dirname, 'src', 'index.js')],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'src') },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/, loader: 'url?limit=8192' },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      inject: true,
    }),
  ].concat(isProd ? pluginsProd : pluginsDev),
};
