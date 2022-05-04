const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.config');
const path = require('path');

module.exports = merge(base, {
  mode: 'production',
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      base: 'app://rse'
    }),
    new CspHtmlWebpackPlugin(
      {
        'base-uri': ['\'self\''],
        'object-src': ['\'none\''],
        'script-src': ['\'self\''],
        'style-src': ['\'self\''],
        'frame-src': ['\'none\''],
        'worker-src': ['\'none\'']
      },
      {
        hashEnabled: {
          'style-src': false
        }
      }
    )
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin()
    ]
  }
});