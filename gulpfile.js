var gulp = require("gulp")

var babel = require("gulp-babel")
var newer = require("gulp-newer")
var eslint = require("gulp-eslint")
var clean = require("gulp-clean")
var exec = require("child_process").exec
var print = require("gulp-print")
//var uglify = require("gulp-uglify")

var folder = {
  src: "./src/",
  build: "./build/",
  test: "./test/",
  bin: "./bin/",
  views_in: "./src/views/",
  views_out: "./build/views/"
}

gulp.task("build", ["lint", "views", "babel"], function(){
  var out = folder.build;
  return gulp.src(folder.src + "**/*", ["!" + folder.views_in + "**/*", "!" + folder.src + "**/*\.js"])
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

gulp.task("babel", ["lint"], function(){
  var out = folder.build;
  return gulp.src(folder.src + "**/*.js", ["!" + folder.views_in + "**/*"])
    .pipe(newer(out))
    .pipe(babel())
    .pipe(gulp.dest(out))
})

gulp.task("views", ["views-react", "views-handlebars", "views-pug"], function(){
  return
})

gulp.task("views-pug", function(){
  var out = folder.views_out;
  return gulp.src(folder.views_in + "**/*.pug")
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

gulp.task("views-handlebars", function(){
  var out = folder.views_out;
  return gulp.src(folder.views_in + "**/*.hbs")
    .pipe(newer(out))
    .pipe(gulp.dest(out))
})

gulp.task("views-react", function(){
  var out = folder.views_out;
  return gulp.src(folder.views_in + "**/*.jsx")
    .pipe(newer(out))
    .pipe(babel())
    .pipe(gulp.dest(out))
})

gulp.task("lint", function(){
  return gulp.src(folder.src + "**/*\.js", ["!" + folder.views_in + "**/*"])
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
