var webpack = require('webpack');
var path = require('path')

module.exports = {
  mode: 'development',
  
  entry: {
    app: ['webpack/hot/dev-server', './src/index.js']
  },

  output: {
    path: path.resolve('./public/built'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/built/'
  },

  devServer: {
    contentBase: path.resolve('./public'),
    publicPath: 'http://localhost:8080/built/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpg|txt)$/, loader: 'file-loader' },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}
