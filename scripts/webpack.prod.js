const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const { getPkgDir } = require('./utils')
const baseConfig = require('./webpack.base')

module.exports = env => {
  const pkgDir = getPkgDir(env.target)

  /**@type {import('webpack').Configuration} */
  const config = {
    mode: 'production',
    bail: true,
    devtool: 'source-map',

    output: {
      path: path.resolve(pkgDir, 'dist'),
      filename: 'index.min.js',
    },

    optimization: {
      minimizer: [new TerserPlugin({ terserOptions: { output: { comments: false } }, extractComments: false })]
    },

    plugins: [
      new CleanWebpackPlugin(),
    ]
  }

  return merge(baseConfig(env), config)
}
