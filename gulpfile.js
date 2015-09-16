'use strict';

var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    sourcemaps = require('gulp-sourcemaps');

var bc = './bower_components/';

//Здесь конкатенируется app.js из кастомного кода, внимание сначала нужно собирать модули
gulp.task('js', function() {
    gulp.src(
        [
            'builds/development/app/app.js',
            'builds/development/app/**/*.module.js',
            'builds/development/app/**/*.js'
        ]
    )
    .pipe(concat('app.js'))
    .pipe(gulp.dest('builds/dist/app/'))
});
// -----

gulp.task('html', function() {
  gulp.src('builds/development/**/*.html')
    .pipe(gulp.dest('builds/dist/'))
});

gulp.task('sass', function () {
  gulp.src('builds/development/sass/**/*.scss')
      .pipe(sass())
      .pipe(concat('style.min.css'))
      .pipe(csso())
      .pipe(gulp.dest('builds/dist/css/'));
});

gulp.task('img', function() {
  gulp.src('builds/development/img/**/*')
    .pipe(gulp.dest('builds/dist/img/'));
});

// Копирование папки со вспомогательными JS файлами
gulp.task('jsHelpers', function() {
    gulp.src('builds/development/js/**/*')
        .pipe(gulp.dest('builds/dist/js/'));
});
// -----

// вотчеры которые будут отрабатывать автоматом при каком-то изменении
gulp.task('watch', function() {
    gulp.watch('builds/development/app/**/*.js', ['js']);
    gulp.watch('builds/development/sass/**/*', ['sass']);
    gulp.watch('builds/development/**/*.html', ['html']);
    gulp.watch('builds/development/img/**/*', ['img']);
});
// -----

gulp.task('libs', function() {
    gulp.src(bc+'jquery/dist/jquery.js')
      .pipe(gulp.dest('./builds/dist/libs/jquery/'));

    gulp.src(bc+'bootstrap/dist/**/*.*')
      .pipe(gulp.dest('./builds/dist/libs/bootstrap/'));

    gulp.src(bc+'bootstrap-material-design/dist/**/*.*')
      .pipe(gulp.dest('./builds/dist/libs/bootstrap-material-design/'));

    // Копирование библиотеки jasny-bootstrap для бокового меню
    gulp.src(bc+'jasny-bootstrap/dist/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/jasny-bootstrap/'));
    // -----

    // Копирование библиотеки bootstrap-datepicker
    gulp.src(bc+'bootstrap-datepicker/dist/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/bootstrap-datepicker/'));
    // -----

    // Графики для ангуляра angular-charts
    gulp.src(bc+'angular-chart.js/dist/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/angular-chart.js/'));
    gulp.src(bc+'Chart.js/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/Chart.js/'));
    // -----

    // Подключение angular bootstrap-ui
    gulp.src(bc+'angular-bootstrap/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/angular-bootstrap/'));
    // -----

    // Подключение angular ui-router
    gulp.src(bc+'angular-ui-router/release/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/angular-ui-router/'));
    // -----

    // Подключение angular-bootstrap-material
    gulp.src(bc+'angular-bootstrap-material/**/*.*')
        .pipe(gulp.dest('./builds/dist/libs/angular-bootstrap-material/'));
    // -----

    // Подключение arrive
    gulp.src(bc+'arrive/minified/*.js')
        .pipe(gulp.dest('./builds/dist/libs/arrive/'));
    // -----

    // Подключение angular-bootstrap-datetimepicker
    gulp.src(bc+'angular-bootstrap-datetimepicker/src/**/*')
        .pipe(gulp.dest('./builds/dist/libs/angular-bootstrap-datetimepicker/'));
    // -----

    // Подключение шрифта с иконками whhg
    gulp.src('builds/development/non_bower_components/whhg-font/**/*')
        .pipe(gulp.dest('./builds/dist/libs/whhg-font/'));
    // -----

    // Подключение angular-storage
    gulp.src(bc + 'a0-angular-storage/dist/**/*')
        .pipe(gulp.dest('./builds/dist/libs/a0-angular-storage/'));
    // -----

    // Подключение angular-toastr
    gulp.src(bc + 'angular-toastr/dist/**/*')
        .pipe(gulp.dest('./builds/dist/libs/angular-toastr/'));
    // -----

    gulp.src([bc+'angular/angular.js',
            bc+'angular-animate/angular-animate.js',
            bc+'angular-cookies/angular-cookies.js',
            bc+'angular-i18n/angular-locale_ru-ru.js',
            bc+'angular-loader/angular-loader.js',
            bc+'angular-resource/angular-resource.js',
            bc+'angular-route/angular-route.js',
            bc+'angular-sanitize/angular-sanitize.js',
            bc+'angular-touch/angular-touch.js',

            // подключение firebase + angularFire
            bc+'firebase/firebase.js',
            bc+'angularfire/dist/angularfire.js',

          ])
      .pipe(gulp.dest('./builds/dist/libs/angular/'));
});

gulp.task('webserver', function() {
  gulp.src('builds/dist/')
      .pipe(webserver({
        livereload: true,
        open: true
      }));
});

gulp.task('default', [
    'libs',
    'html',
    'js',
    'sass',
    'img',
    'jsHelpers',
    'webserver',
    'watch'
]);
