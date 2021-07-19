  
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nonce = require("./create-nonce")();
const { merge } = require("webpack-merge");
const base = require("./webpack.config");
const path = require("path");

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map", // Show the source map so we can debug when developing locally
  devServer: {
    host: "localhost",
    port: "3000",
    hot: true, // Hot-reload this server if changes are detected
    compress: true, // Compress (gzip) files that are served
    contentBase: path.resolve(__dirname, "dist"), // Where we serve the local dev server's files from
    watchContentBase: true, // Watch the content base for changes
    watchOptions: {
      ignored: /node_modules/ // Ignore this path, probably not needed since we define contentBase above
    },
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
      nonce: nonce  // added a new property for ejs template
    }),
    new CspHtmlWebpackPlugin({
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "style-src": ["'self'", `'nonce-${nonce}'`],  // added a nonce for the style-src
      "frame-src": ["'none'"],
      "worker-src": ["'none'"]
    })
  ]
})