var fs = require('fs');
var webpack = require('webpack');
var path = require('path');

var entryFile = path.join(__dirname, '/src/GLPopMenu.js');
var bubbleView = path.join(__dirname, '/src/GLBubbleView.js');

module.exports = [{
  entry: entryFile,
  // devtool: 'eval-source-map',//导出souce map
  output: {
    path: path.join(__dirname, '/bin'),
    filename: 'glpopmenu.js'
  },
  module: {
    loaders: [{
      test: [path.join(__dirname, '/src')],
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ]
},
  {
    entry: bubbleView,
    output: {
      path: path.join(__dirname, '/bin'),
      filename: 'glbubbleview.js'
    },
    module: {
      loaders: [{
        test: [path.join(__dirname, '/src')],
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }]
    },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin(),
  // ]
  }];
