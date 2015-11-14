var fs = require('fs');
var webpack = require('webpack');
var path = require('path');

var entryFile = path.join(__dirname, '/src/GLPopMenu.js');
module.exports = {
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
};

// var entryFile2 = path.join(__dirname, '/src/polyfills/ecmascript_simd.js');
// module.exports = {
//   entry: entryFile2,
//   output: {
//     path: path.join(__dirname, '/bin'),
//     filename: 'ecmascript_simd.min.js'
// },
// plugins: [
//   new webpack.optimize.UglifyJsPlugin(),
// ]
// };
