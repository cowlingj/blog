var gulp = require("gulp")

var babel = require("gulp-babel")
var buffer = require("gulp-buffer")
var eslint = require("gulp-eslint")
var imagemin = require("gulp-imagemin")
var newer = require("gulp-newer")
var sourcemaps = require("gulp-sourcemaps")
var tap = require("gulp-tap")
var uglify = require("gulp-uglify")
var gutil = require("gulp-util")

var browserify = require("browserify")
var del = require("del")

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

gulp.task("build", ["lint", "views", "babel", "assets"], function(){
  var out = folder.build
  return gulp.src(folder.src + "**/*", [
    "!" + folder.views_in + "**/*",
    "!" + folder.src + "**/*.js",
    "!" + folder.assets_in + "**/*"
  ])
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

gulp.task("assets", ["assets-js", "assets-img"], function(){ return })

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

gulp.task("assets-img", function(){
  var out = folder.assets_out + "/img"
  return gulp.src(folder.assets_in + "img/**/*")
    .pipe(newer(out))
    .pipe(imagemin())
    .pipe(gulp.dest(out))
})

gulp.task("babel", ["lint"], function(){
  var out = folder.build
  return gulp.src(folder.src + "**/*.js", ["!" + folder.views_in + "**/*"])
    .pipe(tap(function(f){
      gutil.log("transpiling: " + f.path)
    }))
    .pipe(newer(out))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(out))
})

gulp.task("views", ["views-react", "views-handlebars", "views-pug"], function(){
  return
})

gulp.task("views-pug", function(){
  var out = folder.views_out
  return gulp.src(folder.views_in + "**/*.pug")
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

gulp.task("views-handlebars", function(){
  var out = folder.views_out
  return gulp.src(folder.views_in + "**/*.hbs")
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

gulp.task("views-react", function(){
  var out = folder.views_out
  return gulp.src(folder.views_in + "**/*.jsx")
    .pipe(newer(out))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(out))
})

gulp.task("lint", function(){
  return gulp.src(folder.src + "**/*.js", ["!" + folder.views_in + "**/*"])
    .pipe(eslint({ configFile: ".eslintrc"}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .on("error", function(error) { gutil.log("error: " + error) })
})

gulp.task("clean", function(){
  return del(folder.build + "*")
})

gulp.task("default", function(){
  return gutil.log("gulp working")
})
