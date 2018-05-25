
const path = require('path');

const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

function config(env = {}) {
  const { production = false } = env;
  const mode = production ? 'production' : 'development';
  const out = path.join(__dirname, 'dist');
  return {
    mode,
    entry: {
      app: path.join(out, 'script/app.js'),
    },
    output: {
      target: 'window',
      path: out,
      filename: 'app.bundle.js',
    },
    module: {
      rules: [{
        test: /\.(js(x)?)$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['react'],
            plugins: ['syntax-object-rest-spread', 'syntax-class-properties'],
          },
        }],
      }, {
        test: /\.(styl|css)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: `{ plugins() { return autoprefixer({ browsers: ['last 2 versions'] }); } }`,
          },
          'stylus-loader',
        ],
      }, {
        test: /\.(woff2|woff)$/,
        use: ['url-loader'],
      }],
    },
    resolve: {
      extensions: ['.jsx', '.js', '.styl'],
    },
    optimization: {
      minimize: production,
    },
    plugins: [
      new webpack.DefinePlugin({
        process: {
          env: {
            NODE_ENV: `"${mode}"`,
          },
        },
      }),
      new CleanPlugin(out),
      new HtmlPlugin({
        title: 'App',
        inject: 'body',
        hash: true,
        template: path.join(__dirname, 'htmlTemplate.ejs'),
        chunks: ['app'],
      }),
      new WriteFilePlugin(),
    ],
  };
}

module.exports = config;
