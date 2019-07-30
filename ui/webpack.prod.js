const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: process.env.PUBLIC_URL || ""
    })
  ],

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all"
        },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all"
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      })
    ]
  }
});
