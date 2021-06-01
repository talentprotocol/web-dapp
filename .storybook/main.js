const path = require('path');

module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "core": {
    "builder": "webpack5"
  },
  "webpackFinal": async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        { loader: require.resolve('css-loader') },
        'sass-loader'
      ],
    });
    config.resolve.modules.push(path.resolve(__dirname, '../app/packs'));

    return config;
  },
}
