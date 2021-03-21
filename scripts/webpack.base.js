const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const { getPkgDir } = require('./utils')
const version = require('../lerna.json').version

module.exports = (env) => {
  const pkgDir = getPkgDir(env.target)
  
  /**@type {import('webpack').Configuration} */
  const config = {
    entry: path.resolve(pkgDir, 'src', 'index.ts'),

    output: {
      libraryTarget: 'umd',
      library: env.target,
      globalObject: 'this'
    },

    resolve: {
      extensions: ['.ts', '.js', '.scss', '.json'],
      alias: {
        src: path.resolve(pkgDir, 'src')
      }
    },
  
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            { loader: 'ts-loader', options: { configFile: path.resolve(pkgDir, 'tsconfig.json') } }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
        },
      ]
    },
  
    plugins: [
      new webpack.DefinePlugin({
        __VERSION__: `"${version}"`,
      }),
      new ESLintPlugin({
        extensions: ['.js', '.ts', '.d.ts']
      })
    ],
  }

  return config
}
