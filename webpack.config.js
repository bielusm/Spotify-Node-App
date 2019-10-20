const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "docs/assets"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "docs"),
    publicPath: "/assets/",
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: "cheap-module-eval-source-map"
};
