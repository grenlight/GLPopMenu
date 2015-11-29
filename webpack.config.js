var fs = require('fs');
var webpack = require('webpack');
var path = require('path');

var entryFile = path.join(__dirname, '/src/index.js');
var srcPath = path.join(__dirname, '/src');
var outPath = path.join(__dirname, '/bin');
module.exports = [{
  entry: entryFile,
  devtool: 'eval-source-map', //导出souce map
  output: {
    path: outPath,
    filename: 'gren.js'
  },
  module: {
    loaders: [{
      test: [srcPath],
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    }]
  }
},
  {
    entry: entryFile,
    output: {
      path: outPath,
      filename: 'gren.min.js'
    },
    module: {
      loaders: [{
        test: [srcPath],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
    ]
  }];
