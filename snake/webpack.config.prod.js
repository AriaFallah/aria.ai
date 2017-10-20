// @flow

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
    path: path.resolve(`${__dirname}/..`, 'dist'),
    filename: 'snake.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'snake.html',
      inject: true,
      template: './src/snake.html',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
    }),
  ],
};
