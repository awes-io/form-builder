const gulp = require('gulp')
const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const noop = require('gulp-noop')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const nib = require('nib')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const rollup = require('gulp-rollup')

const isDev = process.env.NODE_ENV === 'development'
const isModern = process.env.BROWSERSLIST_ENV === 'modern'

/*
 * Server
 */

if ( isDev ) {
  gulp.task('serve', function(){

    browserSync.init({
      ui: false,
      open: false,
      notify: false,
      serveStatic: ['./examples', './dist'],
      proxy: "localhost:3030"
    })

    gulp.watch('./resources/css/**/*.styl', gulp.series('build:styles'))
    gulp.watch(['./resources/js/**/*.js', './resources/vue/**/*.vue', 'src/vue/**/*.js'], gulp.series('build:js', 'reload'))
    gulp.watch('./examples/**/*.html', gulp.series('reload'))
  })

  gulp.task('reload', function(done) { browserSync.reload(); done() })
}


/*
 * JS
 */

const rollupConfig = require('./rollup.config.js')
rollupConfig.allowRealFiles = true // solves gulp-rollup hipotetical file system problem
rollupConfig.rollup = require('rollup')

gulp.task('build:js', function(){
  return gulp.src('./resources/js/main.js')
    .pipe( plumber() )
    .pipe( rollup(rollupConfig) )
    .pipe( gulp.dest('./dist/js') )
})


/*
 * Styles
 */

gulp.task('build:styles', function(){
  return gulp.src('./resources/css/main.styl')
    .pipe( plumber() )
    .pipe( isDev ? sourcemaps.init() : noop() )
    .pipe( stylus({ use: nib(), 'include css': true, import: ['nib'], compress: false }) )
    .pipe( isDev ? noop() : postcss() )
    .pipe( isDev ? sourcemaps.write() : noop() )
    .pipe( gulp.dest('./dist/css') )
    .pipe( isDev ? browserSync.stream() : noop() )
})


/*
 * Gloabl tasks
 */

gulp.task('clean', function(){
  return gulp.src('./dist', { read: false, allowEmpty: true })
    .pipe( clean() )
})

gulp.task('build', gulp.series('build:js', 'build:styles') )

// start
defaultTask = ['clean', 'build']
if ( isDev ) defaultTask.push('serve')
gulp.task('default', gulp.series(defaultTask) )
