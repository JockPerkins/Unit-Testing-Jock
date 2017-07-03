const path = require('path');
var alias = {};
alias['fbjs/lib/memoizeStringOnly'] = '../node_modules/fbjs/lib/memoizeStringOnly';

module.exports = {
  //alias : alias,
  context: path.join(__dirname, 'src'),
  entry: [
    'main.js',
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
};
