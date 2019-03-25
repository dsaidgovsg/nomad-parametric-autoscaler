const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: { app: "./index.jsx" },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'build'),
      publicPath: "/"
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                include: [
                  path.resolve(__dirname, "src/App.css"),
                  path.resolve(__dirname, "src/index.css"),
                ],
                use: ["css-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["build"]}),
        new HtmlWebpackPlugin({ template: "index.html" })
      ],
    
      resolve: {
        extensions: [".js", ".jsx", ".scss", ".css"],
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    
    stats: {
        colors: true
    },
};
