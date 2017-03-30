# Stylus-svg

Add stylus function to import svg from a path and include it inline in css.

## Why?

This js module add to stylus a function to read a svg file and import it inline in your css.

## Installation

```bash
npm install ryuran/svg-stylus#0.0.0
```

> NB: It’s an install from github but this module will be register on NPM as soon as possible

## How to use?

### Directly with stylus

```javascript
var stylus = require('stylus'),
    stylusSvgImport = require('stylus-svg');

stylus(str)
  .set('filename', 'nesting.css')
  .define('svgImport', stylusSvgImport(stylus.stylus, [BASE_PATH_TO_SVG]))
  .render(function(err, css){
    // logic
  });;
```

### With gulp-stylus

```javascript
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    stylusSvgImport = require('stylus-svg');

// css
gulp.task('styles', function () {
    return gulp.src('*.styl')
        .pipe(stylus({
            rawDefine: {
                'svgImport': stylusSvgImport(stylus.stylus, [
                    BASE_PATH_TO_SVG
                ])
            }
        }))
        .pipe(gulp.dest('css'));
});
```
