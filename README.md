# Stylus-svg

[![Build Status](https://travis-ci.com/ryuran/stylus-svg.svg?branch=master)](https://travis-ci.com/ryuran/stylus-svg) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/stylus-svg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fryuran%2Fstylus-svg.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fryuran%2Fstylus-svg?ref=badge_shield)


Add stylus function to import svg from a path and include it inline in css.

## Why?

This js module add to stylus a function to read a svg file and import it inline in your css.

## Installation

```bash
npm install stylus-svg
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
  stylusSvgImport({svgDirs: __dirname})
```

```stylus
  use('./node_modules/stylus-svg/index.js', {svgDirs: '/assets'})
```

It’s possible to add several paths:

```javascript
  stylusSvgImport({svgDirs: [__dirname, './other/path']})
```

But stylus syntax can be annoying:
```stylus
  svgDirs = '../node_modules' 'assets'
  use('./node_modules/stylus-svg/index.js', {svgDirs: '/assets'})
```
## How to use?

### basic usage
```stylus
.foo
  background-image: svgImport('../svg/logo.svg')
```

### With custom CSS
You can also use the second argument to give some css to your svg (in stylus language)

```stylus
.foo
  background-image: svgImport('../svg/logo.svg', '
    path
      fill: rgba(255, 255, 255, .5)
  ')
```

This Stylus code do not access to outside stylus context (do not use variable defined outside).

### Do not remove `width` and `height` attributes

By default, svg import remove `width` and `height` attributes to be sure that svg would not be considered as an non-vectorial background image by the browser:

> It’s worth noting that the sizing algorithm only cares about the image's dimensions and proportions, or lack thereof. An SVG image with fixed dimensions will be treated just like a raster image of the same size.

Sources: [MDN – Scaling of SVG backgrounds]( https://developer.mozilla.org/en-US/docs/Web/CSS/Scaling_of_SVG_backgrounds)

You can set the third argument to false to not delete it.

```stylus
.foo
  background-image: svgImport('../svg/logo.svg', '', false)
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fryuran%2Fstylus-svg.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fryuran%2Fstylus-svg?ref=badge_large)
