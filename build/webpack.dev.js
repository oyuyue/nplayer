const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '..', 'demo'),
    quiet: false,
    watchOptions: {
      ignored: /node_modules/,
    }
  },
});
