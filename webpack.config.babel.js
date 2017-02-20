import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import path from 'path';
import V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from "script-ext-html-webpack-plugin";
const ENV = process.env.NODE_ENV || 'development';


const CSS_MAPS = ENV!=='production';

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.less', '.scss'],
    alias: {
      components: path.resolve(__dirname, "src/components"),    // used for tests
      store: path.resolve(__dirname, "src/store"),    // used for tests
      style: path.resolve(__dirname, "src/style"),
      'react': 'preact',
      'react-dom': 'preact',
      'react-redux': 'preact-redux'
    },
    modules: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ]
  },

  module: {

    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /src/
      },
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   include: /src/
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve('src'),
          path.resolve('node_modules/preact-compat/src')
        ]
      },
      {
        enforce: 'pre',
        test: /\.(sass|scss)$/,
        loader: ENV==='production' ? ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!postcss-loader!sass-loader'
        }) : 'style-loader!css-loader!postcss-loader!sass-loader'
      }
    ],

    loaders: [
      {
        test: /\.jsx?/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ["es2015", { "loose":true }],
            "stage-0"
          ],
          plugins: [
            ["transform-decorators-legacy"],
            ['transform-react-jsx', { pragma: 'h' }]
          ]
        }
      },
      {
        test: /\.(sass|scss|css)$/,
        loader: ENV==='production' ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: 'scss-loader|css-loader!postcss-loader!scss-loader'
        }) : 'style-loader!css-loader!postcss-loader!scss-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: ENV==='production' ? 'file-loader?name=[path][name]_[hash:base64:5].[ext]' : 'url'
      }
    ]
  },

  plugins: ([
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin("style.css"),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: true }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "async"
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json', to: './' },
      { from: './favicon.ico', to: './' },
      { from: path.resolve(__dirname, 'src/assets'), to: './assets'}
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('autoprefixer')({ browsers: ['last 3 version'] })
        ]
      }
    })

  ]).concat(ENV==='production' ? [
    new V8LazyParseWebpackPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        unused: 1,
        warnings: 0,
        comparisons: 1,
        conditionals: 1,
        negate_iife: 0, // <- for `LazyParseWebpackPlugin()`
        dead_code: 1,
        if_return: 1,
        join_vars: 1,
        evaluate: 1
      },
      sourceMap: true,
      minimize: true
    }),

    // strip out babel-helper invariant checks
    // new ReplacePlugin([{
    //   // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
    //   partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
    //   replacement: () => 'return;('
    // }]),

    new OfflinePlugin({
      relativePaths: false,
      navigateFallbackURL: '/',
      AppCache: false,
      ServiceWorker: {
        events: true
      },
      publicPath: '/'
    })
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: false,
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    }
  }
};


/**
 {
      fallback: 'style-loader',
      use: "css-loader",
      allChunks: true,
      disable: ENV!=='production'
    }
 */
