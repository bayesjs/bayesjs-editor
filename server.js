/* eslint-disable no-console */

const open = require('open');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');
const port = 3000;
const url = `http://localhost:${port}`;

config.entry.app.unshift(`webpack-dev-server/client?${url}`);

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true },
});

server.listen(port, error => {
  if (error) {
    console.error(error);
  } else {
    open(url);
  }
});
