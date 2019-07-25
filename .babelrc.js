module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: '2',
      // debug: true,
      exclude: [
          'web.dom.iterable',
          'es6.symbol',
          'es7.symbol.async-iterator',
          'es6.object.assign',
          'es6.promise',
          'es7.promise.finally',
          'es6.string.iterator',
          'es6.regexp.to-string',
          'es6.regexp.split',
          'es6.regexp.replace',
          'es6.function.name'
      ]
    }]
  ]
};
