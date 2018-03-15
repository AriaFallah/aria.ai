const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = {
  entry: './src/Index.bs.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'snake.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'snake.html',
      template: './src/snake.html',
    }),
  ],
};

module.exports =
  process.env.NODE_ENV !== 'production'
    ? {
        ...baseConfig,
        devServer: {
          contentBase: path.join(__dirname, 'dist'),
          watchContentBase: true,
        },
        devtool: 'cheap-module-source-map',
        mode: 'development',
      }
    : {
        ...baseConfig,
        mode: 'production',
      };
