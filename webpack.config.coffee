webpack = require 'webpack'

module.exports =

  context: __dirname

  target: 'web'

  entry:
    index: './sources/index.jsx'

  output:
    path: './'
    publicPath: '/'
    filename: '[name].js'
    chunkFilename: 'chunk-[id].js'

  module:
    loaders: [
      { test: /\.jsx$/,   exclude: /bower_components|node_modules/, loader: 'babel?stage=0&loose=all' }
      { test: /\.json$/,  exclude: /bower_components|node_modules/, loader: 'json'                    }
      { test: /\.ya?ml$/, exclude: /bower_components|node_modules/, loader: 'json!yaml'               }
    ]

  resolve:
    extensions: [
      ''
      '.jsx'
      '.js'
      '.json'
      '.yml'
      '.yaml'
    ]
    modulesDirectories: [
      'node_modules'
      'bower_components'
    ]

  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    )
    new webpack.NoErrorsPlugin
    new webpack.IgnorePlugin(/vertx/)
    new webpack.optimize.DedupePlugin
    new webpack.optimize.AggressiveMergingPlugin
  ].concat(
    if process.argv.some (arg) ->
      /^(?:-p|--optimize-minimize)$/.test(arg)
    then [
    # new webpack.DefinePlugin(
    #   log: -> return
    # )
      new webpack.optimize.UglifyJsPlugin(
        compress:
          pure_funcs: [
            'log'
          ]
        output:
          comments: require('uglify-save-license')
      )
    ]
    else [
      new webpack.DefinePlugin(
        log: ->
          if console?
            # for IE8 and IE9
            if typeof console.log is 'object'
              Function::apply.call(console.log, console, arguments)
            # for other browsers
            else
              console.log.apply(console, arguments)
          return
      )
    ]
  )
