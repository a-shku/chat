var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect');

//server connect
gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

//html
gulp.task('html', function(){
	gulp.src('./index.html')
	.pipe(connect.reload());
	//.pipe(livereload());
})

//css
gulp.task('css', function(){
	gulp.src('./style.css')
	.pipe(connect.reload());
	//.pipe(livereload());
})

//js
gulp.task('js', function(){
	gulp.src('./chat.js')
	.pipe(connect.reload());
	//.pipe(livereload());
})

//watch
gulp.task('watch', function(){
	
	gulp.watch('./index.html', ['html']);
	gulp.watch('./chat.js', ['js']);
	gulp.watch('./style.css', ['css']);
})


//default
gulp.task('default', ['connect', 'watch']);






