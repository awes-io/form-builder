const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    isDev ? false : require('cssnano')({ preset:'default' })
  ]
}
