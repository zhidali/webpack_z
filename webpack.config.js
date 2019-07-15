'use strict';
const path = require('path')
const webpack =require('webpack')
module.exports = {
  // entry: './src/index.js',
  entry: {
    main : './src/index.js',
    seacth : './src/seacth.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  // 生产环境mode 自动启动webpack的一切压缩优化之类的
  // mode: 'production',
  // 开发环境
  mode: 'development',
  module:{
    rules:[
      {
        test: /.js$/,
        use: "babel-loader"
      },
      {
        test: /.css$/,
        use:[
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use:[
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
        test: /.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options:{
              limit: 10240
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer:{
    contentBase: './dist',
    hot:true
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
