const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const base = require('./webpack.base');

module.exports = merge(base, {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/dist/**/*'],
    }),
  ],
});
