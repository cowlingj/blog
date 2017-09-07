var gulp = require("gulp")

var babel = require("gulp-babel")
var newer = require("gulp-newer")
var eslint = require("gulp-eslint")
var clean = require("gulp-clean")
var exec = require('child_process').exec
//var uglify = require("gulp-uglify")

var folder = {
  src: "./src/",
  build: "./build/",
  test: "./test/",
  bin: "./bin/"
}

gulp.task("build", ["lint"], function(){
  var out = folder.build;
  return gulp.src(folder.src + "/**/*")
    .pipe(newer(out))
    .pipe(babel())
    .pipe(gulp.dest(out))
})

gulp.task("lint", function(){
  return gulp.src(folder.src + "**/*\.js")
    .pipe(eslint({ configFile: ".eslintrc"}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .on("error", function(error) { console.log("error: " + error) })
})

gulp.task("clean", function(){
  return gulp.src(folder.build + "/**/*")
    .pipe(clean())
})

gulp.task("default", function(){
  return console.log("gulp working")
})
