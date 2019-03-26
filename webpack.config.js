// webpack 是node写的，node的语法
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require('webpack');


module.exports = {
  mode: 'production',    // 模式，默认两种，开发环境和生产环境
  entry: {
    index: './src/index'
  },   // 入口
  output: {               // 输出
    filename: "[name].js",
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    port: 3000,
    // progress: true,
    contentBase: path.join(__dirname, "build"),
    compress: true,
    hot: true
  },
  devtool: 'inline-source-map',
  optimization: {
    // 优化项
    minimizer: [
      // 压缩JS
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      // 压缩CSS
      new OptimizeCSSAssetsPlugin({})
    ],
    // 抽离公用代码
    /*splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    }*/
  },
  module: {
    rules: [
      { // babel
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                ["@babel/plugin-proposal-decorators", {"legacy": true}],
                ["@babel/plugin-proposal-class-properties", {"loose": true}],
                '@babel/transform-runtime',
                '@babel/plugin-syntax-dynamic-import'
              ]
            }
          }
        ]
      },
      /* {
         test: /\.js$/,
         enforce: "pre",
         exclude: /node_modules/,
         loader: "eslint-loader",
       },*/

      /**
       * css-loader 处理 @import这种语法
       * style-loader 将css插入到head标签中
       * loader的特点： 希望单一，所以每个loader负责一项事情，
       * loader的使用是有顺序的，默认是从右向左执行，从下到上执行
       * */
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {insertAt: 'top'}
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {insertAt: 'top'}
          },
          'css-loader',
          'less-loader',
          'postcss-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1,
            outputPath: 'img/'
          }
        }]
      },
    ]
  },
  plugins: [
    // html模板
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true
      }
    }),
    // 独立css文件
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    // 热更新插件
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};