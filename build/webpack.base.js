const path = require('path');
const fs = require('fs')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack');
const version = require('../lerna.json').version;

const buildName = process.env.npm_config_name;
const packagePath = path.resolve(__dirname, '../packages')

let packages = [];
const entry = {}

if (buildName) {
  if (!fs.existsSync(path.resolve(packagePath, buildName))) {
    console.error(buildName + ' 不存在')
    process.exit(1)
  }
  packages.push(buildName)
} else {
  packages = fs.readdirSync(packagePath)
}

packages.forEach(name => {
  entry[name.split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('')] = path.resolve(packagePath, name, 'src/ts/index.ts')
})

module.exports = {
  entry,

  resolve: {
    extensions: ['.ts', '.js', '.scss', '.json'],
  },

  output: {
    path: path.resolve(__dirname, '..', 'packages'),
    filename: ({ chunk: { id } }) => {
      return packages[id] + '/dist/index.js';
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
      __VERSION: `"${version}"`,
    }),
  ],
};
