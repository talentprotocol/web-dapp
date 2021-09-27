// config/webpack/base.js
const { webpackConfig, merge } = require("@rails/webpacker");
const webpack = require("webpack");

const customConfig = {
  resolve: {
    extensions: [".css", ".scss"],
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url"),
      assert: require.resolve("assert"),
      fs: false,
      net: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
};

module.exports = merge(webpackConfig, customConfig);
