import webpack from 'webpack'

export default {
  entry: [
    'babel-polyfill',
    './src/index.js'
  ],

  output: {
    path: './dist',
    filename: 'index.js',
    chunkFilename: '[name].js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css!postcss' }
    ]
  },

  postcss: (webpackInstance) => [
    require('postcss-import')({ addDependencyTo: webpackInstance }),
    require('precss')()
  ],

  plugins: process.env.NODE_ENV === 'production' ?
    [
      new webpack.LoaderOptionsPlugin({ minimize: false, debug: false }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          sequences: true,
          dead_code: true,
          drop_debugger: true,
          comparisons: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true,
          if_return: true,
          join_vars: true,
          cascade: true,
          drop_console: true
        },
        output: {
          comments: false
        }
      })
    ] : []
}
