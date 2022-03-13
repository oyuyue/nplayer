const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getPkgDir } = require('./utils')
const version = require('../package.json').version

const rename = (target) => {
  return target.replace(/^nplayer/i, 'NPlayer').replace(/-([A-Za-z])/g, (_, c) => c.toUpperCase())
}

module.exports = (env) => {
  const pkgDir = getPkgDir(env.target)
  const sassVariableDir = path.resolve(pkgDir, 'src/styles/variables')
  const isProd = process.env.NODE_ENV === 'production'

  /**@type {import('webpack').Configuration} */
  const config = {
    entry: path.resolve(pkgDir, 'src', env.lite ? 'index.lite.ts' : 'index.ts'),

    output: {
      libraryTarget: 'umd',
      library: rename(env.target),
      libraryExport: 'default',
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
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
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
                  plugins: [require('autoprefixer'), isProd ? require('cssnano')({ preset: ['default',{
                    discardComments: {
                      removeAll: true
                    }
                  }] }) : undefined].filter(Boolean)
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                additionalData (content, { resourcePath }) {
                  return `@import '${path.relative(path.dirname(resourcePath), sassVariableDir).replaceAll('\\', '/')}';\n${content}`
                }
              }
            },
          ],
        },
      ]
    },
  
    plugins: [
      isProd ? new MiniCssExtractPlugin({ filename: env.lite ? 'index.lite.min.css' : 'index.min.css' }) : undefined,
      new webpack.DefinePlugin({
        __VERSION__: `"${version}"`,
      }),
      new ESLintPlugin({
        extensions: ['.js', '.ts', '.d.ts']
      })
    ].filter(Boolean),
  }

  return config
}
