const path = require('path');
const nodeExternals = require('webpack-node-externals');

const NODE_MODULES_PATH = '../../node_modules';

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: '@nosense/web-obniz',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(yml|yaml)$/,
        use: [
          {
            loader: require.resolve('json-loader'),
          },
          {
            loader: require.resolve(
              path.resolve(
                NODE_MODULES_PATH,
                'obniz/dist/src/obniz/libs/webpackReplace/yaml-schema-loader.js'
              )
            ),
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: 'raw-loader',
      },
      {
        test: /package.json$/,
        use: [
          {
            loader: require.resolve(
              path.resolve(
                NODE_MODULES_PATH,
                'obniz/dist/src/obniz/libs/webpackReplace/packagejson-loader'
              )
            ),
          },
        ],
      },
    ],
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        include: ['devDependencies'],
      },
      allowlist: [
        'dialog-polyfill',
        'dialog-polyfill/dist/dialog-polyfill.css',
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: 'crypto-browserify',
      buffer: 'buffer',
      stream: 'stream-browserify',
      assert: 'assert',
    },
  },
};
