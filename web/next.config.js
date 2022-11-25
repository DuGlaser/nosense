const nodeExternals = require('webpack-node-externals');

module.exports = {
  webpack: (config, options) => {
    const rules = [
      {
        test: /\.yml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.(css)$/,
        use: 'raw-loader',
      },
    ];

    rules.forEach((rule) => {
      config.module.rules.push(rule);
    });

    config.externals.push(
      nodeExternals({
        modulesFromFile: {
          include: ['devDependencies'],
        },
        allowlist: [
          'dialog-polyfill',
          'dialog-polyfill/dist/dialog-polyfill.css',
        ],
      })
    );

    return config;
  },
};
