'use strict';
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

const setMap = () => {
  const entry = {
    // index: './src/index/index.js'
  }
  const HtmlPlugin = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile
    HtmlPlugin.push(
      new HtmlWebpackPlugin({
        inlineSource: '.css$',
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`, // 文件名字
        chunks: [pageName],
        // 有四个选项值 true, body, head, false. 
        // true body 默认值，script标签位于html文件的 body 底部
        // head script 标签位于 head 标签内
        // false 不插入生成的 js 文件，只是单纯的生成一个 html 文件
        inject: true,
        minify: {
          html5: false,
          collapseWhitespace: false,
          preserveLineBreaks: false,
          minifyCSS: false,
          minifyJS: false,
          removeComments: false
        }
      })
    )
  })
  return {
    entry,
    HtmlPlugin
  }
}
const {
  entry,
  HtmlPlugin
} = setMap()
module.exports = {
  // entry: './src/index.js',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  // 生产环境mode 自动启动webpack的一切压缩优化之类的
  // mode: 'production',
  // 开发环境
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [{
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // {
      //   test: /.(png|jpg|jpeg|gif|svg)$/,
      //   use: 'file-loader'
      // }
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    ...HtmlPlugin
    // new CleanWebpackPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    hot: true,
    port: 9000,
    historyApiFallback: true, //不跳转
    host: 'localhost',
    inline: true, //实时刷新
  },
  // 开启webpack监听，默认是false
  /* watch: true,
  watchOptions:{
    // 默认为空，不监听的文件或者文件夹
    ignored: /node_modules/,
    // 监听有变化后等300秒执行，默认是300秒
    aggregateTiomeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认是每秒问1000次
    poll: 1000
  } */
}