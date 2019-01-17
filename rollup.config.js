const isDev = process.env.NODE_ENV === 'development'
const isModern = process.env.BROWSERSLIST_ENV === 'modern'

const vuePlugin = require('rollup-plugin-vue')
const uglifyPlugin = require('rollup-plugin-uglify-es')
const nodeResolvePlugin = require('rollup-plugin-node-resolve')
const jsonPlugin = require('rollup-plugin-json')
const commonJsPlugin = require('rollup-plugin-commonjs')
const babelPlugin = require('rollup-plugin-babel')
const licensePlugin = require('rollup-plugin-license')

module.exports = {
    input: './src/js/main.js',
    output: {
        file: isModern ? './dist/js/main.js' : './dist/js/main.legacy.js',
        format: 'iife',
        external: {
            Urlify: 'Urlify',
            AWES: 'AWES',
            Hammer: 'Hammer'
        }
    },
    plugins: [
        vuePlugin({ css: false }),
        commonJsPlugin({
            include: 'node_modules/**'
        }),
        nodeResolvePlugin({
            jsnext: true,
            main: true
        }),
        jsonPlugin()
    ]
}

if ( ! isModern ) {
    module.exports.plugins.push( 
        babelPlugin({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            extensions: ['.js', '.vue']
        })
    )
}

if ( ! isDev ) {
    module.exports.plugins = module.exports.plugins.concat([
        uglifyPlugin(),
        licensePlugin({
            banner: "Bundle of AWES <%= pkg.name %> " + (isModern ? '' : 'transpiled and polyfilled') + " \n Generated: <%= moment().format('YYYY-MM-DD') %> \n Version: <%= pkg.version %>"
        })
    ])
}
