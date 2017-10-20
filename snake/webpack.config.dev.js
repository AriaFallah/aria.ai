// @flow

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
  },
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  module: {
    rules: [
      {
        include: path.join(__dirname, 'src'),
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'snake.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/snake.html',
    }),
  ],
};
