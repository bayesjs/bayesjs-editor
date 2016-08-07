const path = require('path');
const webpack = require('webpack');
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const srcPath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');
const nodeModulesPath = path.join(__dirname, 'node_modules');

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

const getCssModulesParams = () => {
  const options = [];

  options.push('modules');
  options.push('camelCase=dashes');
  options.push('importLoaders=1');

  if (!isProd) {
    options.push('localIdentName=[local]__[path][name]__[hash:base64:5]');
  }

  return `?${options.join('&')}`;
};

module.exports = {
  devtool: isProd ? false : 'eval-source-map',
  entry: {
    app: [path.join(srcPath, 'index.js')],
  },
  output: {
    path: distPath,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: srcPath,
      },
      {
        test: /\.css$/,
        include: nodeModulesPath,
        loader: ExtractTextPlugin.extract('style', 'css'),
      },
      {
        test: /\.css$/,
        exclude: nodeModulesPath,
        loader: ExtractTextPlugin.extract('style', `css${getCssModulesParams()}!postcss`),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?v=.+)?$/,
        loader: 'url?limit=8192',
      },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      inject: true,
      favicon: path.join(srcPath, 'favicon.ico'),
    }),
  ].concat(isProd ? pluginsProd : pluginsDev),
  postcss: () => [cssnext],
};
