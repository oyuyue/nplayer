const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, '..', 'demo'),
    clientLogLevel: 'none',
    quiet: false,
    open: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    host: '0.0.0.0',
    overlay: true,
    public: 'localhost:8080',
  },
});
