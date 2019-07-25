const isDev = process.env.NODE_ENV === 'development'
const isModern = process.env.BROWSERSLIST_ENV === 'modern'

const vue = require('rollup-plugin-vue')
const uglify = require('rollup-plugin-terser').terser
const nodeResolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const commonJs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const license = require('rollup-plugin-license')

module.exports = {
    input: './resources/js/main.js',
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
        vue({
            css: false,
            template: {
                compilerOptions: {
                    whitespace: 'condense',
                    preserveWhitespace: false
                }
            }
        }),
        commonJs({
            include: 'node_modules/**'
        }),
        nodeResolve({
            mainFields: ['module', 'main', 'jsnext:main']
        }),
        json()
    ]
}

if ( ! isModern ) {
    module.exports.plugins.push(
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            extensions: ['.js', '.vue']
        })
    )
}

if ( ! isDev ) {
    module.exports.plugins = module.exports.plugins.concat([
        uglify(),
        license({
            banner: "Bundle of AWES <%= pkg.name %> " + (isModern ? '' : 'transpiled and polyfilled') + " \n Generated: <%= moment().format('YYYY-MM-DD HH:mm:ss') %> \n Version: <%= pkg.version %>"
        })
    ])
}
