var gulp = require("gulp")
var gutil = require("gulp-util")

var args = require("yargs").argv // help docs
var babel = require("gulp-babel") // babel
var buffer = require("gulp-buffer")
var eslint = require("gulp-eslint") // linting
var imagemin = require("gulp-imagemin") // image compressing
var newer = require("gulp-newer") // check if newer
var sourcemaps = require("gulp-sourcemaps") // generate sourcemaps
var tap = require("gulp-tap")
var uglify = require("gulp-uglify") // uglify javascript
var usage = require("gulp-help-doc") // help docs

var browserify = require("browserify") // client scripts
var del = require("del") // delete files

// useful folders
var folder = {
  src: "./src/",
  build: "./build/",
  test: "./test/",
  bin: "./bin/",
  views_in: "./src/views/",
  views_out: "./build/views/",
  assets_in: "./src/assets/",
  assets_out: "./build/public/assets/"
}

/**
 * build the project
 * @task {build}
 * @order {1}
 */
gulp.task("build", ["lint", "views", "transpile", "assets"], function(){
  var out = folder.build
  return gulp.src(folder.src + "**/*", [
    "!" + folder.views_in + "**/*",
    "!" + folder.src + "**/*.js",
    "!" + folder.assets_in + "**/*"
  ])
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

/**
 * handles all static assets, browserifying scripts, generating sourcemaps
 * processing scss, and compresses images
 * @task {assets}
 * @order {3}
 */
gulp.task("assets", ["assets-js", "assets-img"], function(){ return })

/**
 * browserifys all client scripts that use require and uglifys them
 * also generates sourcemaps
 */
gulp.task("assets-js", function(){
  return gulp.src(folder.assets_in + "**/*.js")
    .pipe(tap(function (file) {
      gutil.log("bundling " + file.path)
      // replace file contents with browserify's bundle stream
      file.contents = browserify(file.path, {debug: true}).bundle()
    }))
    // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(folder.assets_out))
})

/**
 * compresses images
 */
gulp.task("assets-img", function(){
  var out = folder.assets_out + "/img"
  return gulp.src(folder.assets_in + "img/**/*")
    .pipe(newer(out))
    .pipe(imagemin())
    .pipe(gulp.dest(out))
})

/**
 * transpiles server files with babel and uglifys them
 * @task {transpile}
 * @order {4}
 */
gulp.task("transpile", ["lint"], function(){
  var out = folder.build
  return gulp.src(folder.src + "**/*.js", [
    "!" + folder.views_in + "**/*",
    "!" + folder.assets_in + "**/*"
  ])
    .pipe(tap(function(f){
      gutil.log("transpiling: " + f.path)
    }))
    .pipe(newer(out))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(out))
})

/**
 * handles all view files, transpiling where necessary
 * @task {views}
 * @oder {5}
 */
gulp.task("views", ["views-react", "views-handlebars", "views-pug"], function(){
  return
})

/**
 * moves newer pug files to build
 */
gulp.task("views-pug", function(){
  var out = folder.views_out
  return gulp.src(folder.views_in + "**/*.pug")
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

/**
 * moves newer handlebars files to build
 */
gulp.task("views-handlebars", function(){
  var out = folder.views_out
  return gulp.src(folder.views_in + "**/*.hbs")
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

/**
 * transpiles jsx and moves newer generated files to build
 */
gulp.task("views-react", function(){
  var out = folder.views_out
  return gulp.src(folder.views_in + "**/*.jsx")
    .pipe(newer(out))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(out))
})

/**
 * lints all javascript files
 * @task {lint}
 * @order {6}
 * @arg {file | -f} file to lint
 */
gulp.task("lint", function(){
  var file = typeof args.f === "null" || typeof args.f === "undefined" ? args.file : args.f
  if (! typeof file === "null" || typeof file === "undefined") {
    return gulp.src(file)
      .pipe(eslint({ configFile: ".eslintrc"}))
      .pipe(eslint.format())
      .pipe(eslint.failOnError())
      .on("error", function(error) { gutil.log("error: " + error) })
  } else {
    return gulp.src(folder.src + "**/*.js", ["!" + folder.views_in + "**/*"])
      .pipe(eslint({ configFile: ".eslintrc"}))
      .pipe(eslint.format())
      .pipe(eslint.failOnError())
      .on("error", function(error) { gutil.log("error: " + error) })
  }
})

/**
 * cleans the build directory
 * @task {clean}
 * @order {2}
 */
gulp.task("clean", function(){
  return del(folder.build + "*")
})

/**
 * displays this help message
 * @order {7}
 */
gulp.task("help", function(){
  return usage(gulp)
})

gulp.task("default", ["help"] )
