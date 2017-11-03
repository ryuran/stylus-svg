# Stylus-svg

Add stylus function to import svg from a path and include it inline in css.

## Why?

This js module add to stylus a function to read a svg file and import it inline in your css.

## Installation

```bash
npm install svg-stylus
```

## Initalize

### Directly with stylus

```stylus
use('./node_modules/stylus-svg/index.js')
```

### With stylus API

```javascript
var stylus = require('stylus'),
    stylusSvgImport = require('stylus-svg');

stylus(str)
  .set('filename', 'nesting.css')
  .use(stylusSvgImport())
  .render(function(err, css){
    // logic
  });
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
      use: [
        stylusSvgImport()
      ]
    }))
    .pipe(gulp.dest('css'));
});
```

#### options

You can add some bases directories to resolve path of your svg files.

```javascript
  stylusSvgImport({svgDirs: [__dirname]})
```

```stylus
  use('./node_modules/stylus-svg/index.js', {svgDirs: ['/assets']})
```
## How to use?

```stylus
.foo
  background-image: svgImport('../svg/logo.svg')
```

You can also use the second argument to give some css to your svg (in stylus language)

```stylus
.foo
  background-image: svgImport('../svg/logo.svg', '
    path
      fill: rgba(255, 255, 255, .5)
  ')
```

This Stylus code do not access to outside stylus context (do not use variable defined outside).
