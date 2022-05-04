  
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nonce = require('./create-nonce')();
const { merge } = require('webpack-merge');
const base = require('./webpack.config');
const path = require('path');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true, 
    compress: true, 
    contentBase: path.resolve(__dirname, 'dist'), 
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      nonce: nonce 
    }),
    new CspHtmlWebpackPlugin({
      'base-uri': ['\'self\''],
      'object-src': ['\'none\''],
      'script-src': ['\'self\''],
      'style-src': ['\'self\'', `'nonce-${nonce}'`], 
      'frame-src': ['\'none\''],
      'worker-src': ['\'none\'']
    })
  ]
});