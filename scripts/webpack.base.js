const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const { getPkgDir } = require('./utils')
const version = require('../package.json').version

const rename = (target) => {
  return target.replace(/^nplayer/i, 'NPlayer').replace(/-([A-Za-z])/g, (_, c) => c.toUpperCase())
}

module.exports = (env) => {
  const pkgDir = getPkgDir(env.target)
  const pkg = require(path.resolve(pkgDir, 'package.json'))

  /**@type {import('webpack').Configuration} */
  const config = {
    entry: path.resolve(pkgDir, 'src', 'index.ts'),

    output: {
      libraryTarget: 'umd',
      library: rename(env.target),
      globalObject: 'this',
      umdNamedDefine: true
    },

    resolve: {
      extensions: ['.ts', '.js', '.scss', '.json'],
      alias: {
        src: path.resolve(pkgDir, 'src')
      }
    },

    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      vue: {
        root: 'Vue',
        commonjs2: 'vue',
        commonjs: 'vue',
        amd: 'vue'
      },
      nplayer: {
        root: 'NPlayer',
        commonjs2: 'nplayer',
        commonjs: 'nplayer',
        amd: 'nplayer'
      }
    },
  
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader', options: {
              presets: ['@babel/preset-env']
            } },
            { loader: 'ts-loader', options: { configFile: path.resolve(pkgDir, 'tsconfig.json') } }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            path.resolve(__dirname, './style-loader.js'),
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: false,
                postcssOptions: {
                  plugins: [require('autoprefixer'), require('cssnano')({ preset: ['default',{
                    discardComments: {
                      removeAll: true
                    }
                  }] })]
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              }
            },
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

  if (pkg.umdDefault) config.output.libraryExport = 'default'

  return config
}
