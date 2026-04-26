import gulp from 'gulp';
import pug from 'gulp-pug';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);
const server = browserSync.create();
// Gulp 5 uses text encoding by default, which corrupts binary assets during copy.
const binaryAssetOptions = { encoding: false };

// Пути
const paths = {
    pug: {
        src: 'src/pug/pages/**/*.pug',
        watch: 'src/pug/**',
        dest: 'docs/',
    },
    styles: {
        src: 'src/scss/index.scss',
        watch: 'src/scss/**',
        dest: 'docs/css/',
    },
    scripts: {
        src: 'src/js/**',
        watch: 'src/js/**',
        dest: 'docs/js/',
    },
    libs: {
        src: 'src/libs/**',
        watch: 'src/libs/**',
        dest: 'docs/libs/',
    },
    images: {
        src: 'src/assets/images/**',
        watch: 'src/assets/images/**',
        dest: 'docs/img/',
    },
    fonts: {
        src: 'src/assets/fonts/**/*',
        watch: 'src/assets/fonts/**',
        dest: 'docs/fonts/',
    },
};

// Компиляция Pug в HTML
function html() {
    return gulp
        .src(paths.pug.src)
        .pipe(plumber())
        .pipe(
            pug({
                pretty: true,
            })
        )
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(server.stream());
}

// Компиляция и минификация SCSS
function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(server.stream());
}

// Объединение и минификация JS
function libs() {
    return gulp
        .src(paths.libs.src)
        .on('error', console.log)
        .pipe(gulp.dest(paths.libs.dest));
}

function scripts() {
    return (
        gulp
            .src(paths.scripts.src)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            // .pipe(babel({ presets: ['@babel/env'] }))
            .pipe(concat('index.js'))
            // .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.scripts.dest))
            .pipe(server.stream())
    );
}

function fonts() {
    return gulp
        .src(paths.fonts.src, binaryAssetOptions)
        .on('error', console.log)
        .pipe(gulp.dest(paths.fonts.dest, binaryAssetOptions));
}

function images() {
    return (
        gulp
            .src(paths.images.src, binaryAssetOptions)
            .pipe(plumber())
            // .pipe(
            //     imagemin({
            //         optimizationLevel: 5,
            //         progressive: true,
            //         interlaced: true,
            //         multipass: true,
            //     })
            // )
            .pipe(gulp.dest(paths.images.dest, binaryAssetOptions))
    );
}

// Слежение за изменениями
function watch() {
    server.init({
        server: {
            baseDir: './docs',
            index: 'index.html',
        },
        open: false,
    });
    gulp.watch(paths.pug.watch, html);
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.libs.watch, libs);
    gulp.watch(paths.scripts.watch, scripts);
    gulp.watch(paths.fonts.watch, fonts);
    gulp.watch(paths.images.watch, images);
}

export const start = gulp.series(
    libs,
    html,
    styles,
    scripts,
    images,
    fonts,
    watch
);
export const build = gulp.series(libs, html, styles, scripts, images, fonts);

export default build;
