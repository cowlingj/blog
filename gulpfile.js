var gulp = require("gulp")

var babel = require("gulp-babel")
var newer = require("gulp-newer")
var eslint = require("gulp-eslint")
//var uglify = require("gulp-uglify")

var folder = {
  src: "./src/",
  build: "./build/",
  test: "./test/"
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

gulp.task("default", function(){
  return console.log("gulp working")
})
