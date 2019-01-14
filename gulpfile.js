const gulp = require('gulp')
const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const noop = require('gulp-noop')
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
      server: ['./examples', './dist']
    })

    gulp.watch(['./src/js/**/*.js', './src/vue/**/*.vue', 'src/vue/**/*.js'], gulp.series('build:js', 'reload'))
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
  return gulp.src('./src/js/main.js')
    .pipe( plumber() )
    .pipe( rollup(rollupConfig) )
    .pipe( gulp.dest('./dist/js') )
})


/*
 * HTML
 */

gulp.task('build:html', function(){
  return gulp.src('./src/*.html')
    .pipe( plumber() )
    .pipe( gulp.dest('./dist') )
})


/*
 * Gloabl tasks
 */
 
gulp.task('clean', function(){
  return gulp.src('./dist', { read: false, allowEmpty: true })
    .pipe( clean() )
})

gulp.task('build', gulp.series('build:js', 'build:html') )

// start
defaultTask = ['clean', 'build']
if ( isDev ) defaultTask.push('serve')
gulp.task('default', gulp.series(defaultTask) )
