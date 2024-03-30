// src= identificar un archivo. dest= Guardarlo
const { src, dest, watch, parallel } = require("gulp");
// css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer= require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps =require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache'); //optimizacion de imagenes al cargar
const imagemin = require('gulp-imagemin'); //optimizacion de imagenes
const webp = require('gulp-webp'); //Imagenes
const avif = require ('gulp-avif');
function css(donde) {

// JavaScript
const terser = require('gulp-terser-js');

  src("src/scss/**/*.scss") //Identificar el archivo de sass
    .pipe(sourcemaps.init()) 
    .pipe(plumber()) //Compilarlo
    .pipe(sass()) //Compilarlo
    .pipe(postcss([autoprefixer(), cssnano]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css")); //Almacenarlo en el disco duro
  donde(); //callback que avisa a gulp cuando llegamos al final
}

// funcion de imagenes
function imagenes (done) {
  const opciones ={ 
    optimizationLevel: 3
  }
 src('src/img/**/*.{png,jpg}')
.pipe(cache(imagemin(opciones)))
.pipe(dest('build/img'))
done();
}

// funcion de webp
 function versionWebp(done) {
  const opciones = {
    quality: 50,
  }; 
 
  src("src/img/**/*.{png,jpg}") // forma para buscar dos formatos
  .pipe(webp(opciones))
  .pipe(dest("build/img"))
  done(); // Llama a done cuando la tarea está completa
}


function versionAvif(done) { // versionAvif
  const opciones = {
    quality: 50,
  }; 
  // forma para buscar dos formatos
  src("src/img/**/*.{png,jpg}")
  .pipe(avif(opciones))
  .pipe(dest("build/img"))
  done(); // Llama a done cuando la tarea está completa
}

function javascript(done){ 
  src('src/js/**/*.js') //forma de busqueda con formato
  .pipe(sourcemaps.init())
  .pipe( terser() )
  .pipe(sourcemaps.write('.'))
  .pipe(dest('build/js'));
  done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);
  done();
}
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp,versionAvif, javascript, dev);

