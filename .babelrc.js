module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      targets: { esmodules: true },
      exclude: [
          // 'web.dom.iterable',
          'es6.promise',
          'es7.promise.finally',
          // 'es6.string.iterator',
          // 'es6.regexp.to-string',
          // 'es6.function.name'
      ]
    }]
  ]
};
