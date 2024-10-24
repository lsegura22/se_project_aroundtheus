const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Import CopyWebpackPlugin

module.exports = {
  entry: "./src/pages/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    assetModuleFilename: "assets/[hash][ext][query]", // Handles asset naming
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Points to your source HTML
      favicon: "./src/images/favicon.ico", // Favicon support
    }),
    new CleanWebpackPlugin(), // Clean dist folder before each build
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css", // Output CSS file with content hashing
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/images"), // Source of images
          to: path.resolve(__dirname, "dist/images"), // Destination for copied images
        },
      ],
    }),
  ],
  devServer: {
    static: "./dist", // Serve from the dist folder
    open: true, // Automatically open the browser
    hot: true, // Enable Hot Module Replacement (HMR)
  },
  mode: "development", // Set mode to development
};
