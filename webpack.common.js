const path = require('path')

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.join(__dirname, './public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              ['lodash', { id: ['lodash', 'semantic-ui-react'] }]
            ],
            presets: [
              ["@babel/preset-env", {
                modules: false,
                targets: {
                  browsers: [
                    '>1%',
                    'not ie 11',
                    'not op_mini all',
                    'opera 51',
                    'FirefoxAndroid 57'
                  ]
                }
              }],
              '@babel/react',
              '@babel/preset-stage-3'
            ]
          }
        }
      }
    ]
  }
};
