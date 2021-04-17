const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const { getPkgDir } = require('./utils')
const baseConfig = require('./webpack.base')

module.exports = env => {
  const pkgDir = getPkgDir(env.target)
  const fixtureDir = path.resolve(__dirname, '..', 'fixtures')
  const targetDir = path.resolve(fixtureDir, env.fixture || env.target)

  /**@type {import('webpack').Configuration} */
  const config = {
    mode: 'development',
    devtool: 'cheap-module-source-map',

    target: ['web', 'es5'],

    entry: ['webpack-dev-server/client', path.resolve(pkgDir, 'src', 'index.ts')],

    devServer: {
      contentBase: [fixtureDir, path.resolve(__dirname, '..', 'packages')],
      watchContentBase: true,
      liveReload: true,
      injectClient: false,
      host: '0.0.0.0'
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(targetDir, 'index.html')
      })
    ]
  }

  return merge(baseConfig(env), config)
}
