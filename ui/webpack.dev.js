const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new InterpolateHtmlPlugin({
        'PUBLIC_URL': ''
    })
  ],
  devtool: "cheap-module-eval-source-map",

  devServer: {
    contentBase: path.join(__dirname, "build"),
    stats: "minimal",
    port: 5000
  }
});