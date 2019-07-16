'use strict';
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtraactPlugin = require('mini-css-extract-plugin') // css抽离成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const setMap = () => {
  const entry = {
    // main: './index/index.js'
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
  console.log('entry----------' + JSON.stringify(entry))
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
  // entry: './index.js',
  // context: path.resolve(__dirname, 'src'),
  // entry: {
  //   main: './index/index.js',
  //   seacth: './seacth/seacth.js'
  // },
  entry: entry,
  // [name] 名字的展位
  // [chunkhash:8] 哈希值取前八位 默认是32位
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  // 生产环境mode 自动启动webpack的一切压缩优化之类的
  mode: 'production',
  // 开发环境
  // mode: 'development',
  module: {
    rules: [{
        test: /.js$/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          {
            loader: MiniCssExtraactPlugin.loader,
            options: {
              // publicPath: '../'
              insertAt: 'top'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          // 'style-loader',
          {
            loader: MiniCssExtraactPlugin.loader,
            options: {
              // publicPath: '../'
              insertAt: 'bottom'
            }
          },
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 75px
              remPrecesion: 8 //转换成rem小数点位数
            }
          }
        ]
      },
      // {
      //   test: /.(png|jpg|jpeg|gif|svg)$/,
      //   use: 'file-loader'
      // }
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        use: [
          // {
          //   loader: 'url-loader',
          //   options:{
          //     limit: 10240
          //   }
          // }
          {
            loader: 'file-loader',
            options: {
              // [name] 名字
              // [hash:8] 哈希值取前八位
              // [ext] 后缀名
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // css抽离成文件
    new MiniCssExtraactPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    // 压缩css
    new OptimizeCssAssetsPlugin({
      assetNanmeRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    // html 压缩 生产
    /* new HtmlWebpackPlugin({
      title: 'App', // 网页 document.title 的配置
      filename: 'app.html', // 
      template: './public/index.html', // 入口模版 默认找 src/index.html
      inject: true,
      favicon: '', // 为生成的 html 配置一个 favicon
      minify: {
        html5: false,
        collapseWhitespace: false,
        removeComments: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        useShortDoctype: false
      }
    }), */
    ...HtmlPlugin,
    // 清理dist目录
    new CleanWebpackPlugin()
  ]
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