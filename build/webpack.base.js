const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack');
const pkg = require('../package.json');

module.exports = {
  entry: {
    RPlayer: path.resolve(__dirname, '../packages/rplayer/src/ts/index.ts'),
    RPlayerAds: path.resolve(
      __dirname,
      '../packages/rplayer-ads/src/ts/index.ts'
    ),
    RPlayerDanmaku: path.resolve(
      __dirname,
      '../packages/rplayer-danmaku/src/ts/index.ts'
    ),
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss', '.json'],
  },

  output: {
    path: path.resolve(__dirname, '..', 'packages'),
    filename: (a) => {
      const name = a.chunk.name
        .match(/([A-Z]+[a-z]+)/g)
        .map((x) => x.toLowerCase())
        .join('-');
      return name + '/dist/index.js';
    },
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
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
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer, cssnano],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __VERSION: `"${pkg.version}"`,
    }),
  ],
};
