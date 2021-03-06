function stylusSvg(options) {
  options = options || {};
  var fs = require('fs');
  var path = require('path');
  var stylus = require('stylus')
  var nodes = stylus.nodes;
  var utils = stylus.utils;

  return function(style) {
    var svgDirs = options.svgDirs || [];
    var currentPath = path.dirname(style.options.filename);

    svgDirs = Array.isArray(svgDirs) ? svgDirs : [svgDirs];

    svgDirs = svgDirs.map((element) => path.resolve(currentPath, element));

    svgDirs.push(path.resolve(currentPath));

    style.define('svgImport', function svgImport(pathExpression, stylusExpression, removeSizes) {
      var removeSizesAttributes = true;

      if (typeof removeSizes !== 'undefined') {
        utils.assertType(removeSizes, 'boolean', 'removeSize');
        removeSizesAttributes = removeSizes.isTrue;
      }

      svgDirs.push(path.resolve(path.dirname(pathExpression.filename)));

      var svg = pathExpression;
      // assert that the node (svg) is a String node, passing
      // the param name for error reporting
      utils.assertType(svg, 'string', 'svg');
      var svgPath = svg.string;

      // Grab bytes necessary to retrieve dimensions.
      // if this was real you would do this per format,
      // instead of reading the entire image :)
      var data = fs.readFileSync(utils.lookup(svgPath, svgDirs), {encoding: 'utf8'});

      if (!/xmlns/.test(data)) {
        data = data.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // remove xml tag
      data = data.replace(/<\?xml[^>]*>/, '');

      if (removeSizesAttributes) {
        var match = /<svg[^>]*>/i.exec(data);
        var originalSvgTag = match[0];
        var newSvgTag = originalSvgTag.replace(/\s+(?:height|width)=(?:'[^>']*'|"[^>"]*")/ig, ' ');
        data = data.replace(originalSvgTag, newSvgTag);
      }

      if (typeof stylusExpression !== 'undefined') {
        var css = stylusExpression;
        utils.assertType(css, 'string', 'css');
        if (css.string !== '') {
          css = '<style>' + stylus(css.string).render() + '</style>';
          data = data.replace(/<svg[^>]*>/, "$&" + css);
        }
      }

      // console.log(data);

      // Chunk up string in order to avoid
      // "stack level too deep" error
      var encoded = '';
      var slice = 2000;
      var index = 0;
      var loops = Math.ceil(data.length / slice);

      // console.log('====' + loops + '===');

      for (var i = 0; i < loops; i++) {
        var chunk = data.slice(index, index + slice);

        // remove Line Breaks, tabs and multiple spaces
        chunk = chunk.replace(/\s+/g, ' ');

        // remove spaces between tags
        chunk = chunk.replace(/> /g, '>');
        chunk = chunk.replace(/ </g, '<');

        // Encode
        // for browsers
        chunk = chunk.replace(/"/g, '\'');
        chunk = chunk.replace(/%/g, '%25');
        chunk = chunk.replace(/&/g, '%26');
        chunk = chunk.replace(/#/g, '%23');
        chunk = chunk.replace(/{/g, '%7B');
        chunk = chunk.replace(/}/g, '%7D');
        chunk = chunk.replace(/</g, '%3C');
        chunk = chunk.replace(/>/g, '%3E');

        // some css parsers fail on semicolon or parentheses
        chunk = chunk.replace(/;/g, '%3B');
        chunk = chunk.replace(/\(/g, '%28');
        chunk = chunk.replace(/\)/g, '%29');

        // The maybe list
        //
        // Keep size and compile time down
        // … only add on documented fail

        // chunk = chunk.replace(/\|/g, '%7C');
        // chunk = chunk.replace(/\[/g, '%5B');
        // chunk = chunk.replace(/\]/g, '%5D');
        // chunk = chunk.replace(/\^/g, '%5E');
        // chunk = chunk.replace(/`/g, '%60');
        // chunk = chunk.replace(/\?/g, '%3F');
        // chunk = chunk.replace(/:/g, '%3A');
        // chunk = chunk.replace(/@/g, '%40');
        // chunk = chunk.replace(/=/g, '%3D');

        encoded = encoded + chunk;
        index = index + slice;
      }

      // console.log(encoded);

      var dataUri = 'data:image/svg+xml;utf8,' + encoded;

      return new nodes.Literal('url("' + dataUri + '")');
    });
  };
}

module.exports = stylusSvg;
