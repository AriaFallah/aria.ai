const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    watchContentBase: true
  },
  devtool: "cheap-module-source-map",
  entry: "./src/Index.bs.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "snake.js"
  },
  resolve: {
    mainFields: ["module", "main"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "snake.html",
      template: "./src/snake.html"
    })
  ]
};
