function stylusSvg(stylus, svgDirs) {
    var nodes = stylus.nodes;
    var utils = stylus.utils;
    var fs = require('fs');
    var path = require('path');


    function svgImport(expression, css) {
        var svg = expression.nodes[0];
        // assert that the node (svg) is a String node, passing
        // the param name for error reporting
        utils.assertType(svg, 'string', 'svg');
        var svgPath = svg.string;

        var file = utils.lookup(svgPath, svgDirs);

        // Grab bytes necessary to retrieve dimensions.
        // if this was real you would do this per format,
        // instead of reading the entire image :)
        var data = fs.readFileSync(utils.lookup(svgPath, svgDirs), {encoding: 'utf8'});

        if (!/xmlns/.test(data)) {
            data = data.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        // remove xml tag
        data = data.replace(/<\?xml .*\?>/, '');

        // if (css !== undefined) {
        //     css = '<style>' + stylus.render(css) + '</style>';
        // }

        // Chunk up string in order to avoid
        // "stack level too deep" error
        var encoded = '';
        var slice = 2000;
        var index = 0;
        var loops = Math.ceil(data.length / slice);

        for (var i = 0; i < loops; i++) {
            var chunk = data.slice(index, index + slice - 1);

            // remove Line Breaks
            chunk = chunk.replace(/(?:\r\n|\n|\r)/gm, ' ');

            // remove multiple spaces
            chunk = chunk.replace(/(?: +)/g, ' ');

            // remove spaces between tags
            chunk = chunk.replace(/> /g, '>');
            chunk = chunk.replace(/ </g, '<');

            // Encode
            chunk = chunk.replace(/"/g, '\'');
            chunk = chunk.replace(/%/g, '%25');
            chunk = chunk.replace(/&/g, '%26');
            chunk = chunk.replace(/#/g, '%23');
            chunk = chunk.replace(/{/g, '%7B');
            chunk = chunk.replace(/}/g, '%7D');
            chunk = chunk.replace(/</g, '%3C');
            chunk = chunk.replace(/>/g, '%3E');

            // The maybe list
            //
            // Keep size and compile time down
            // … only add on documented fail

            // chunk = chunk.replace(/\|/g, '%7C');
            // chunk = chunk.replace(/\[/g, '%5B');
            // chunk = chunk.replace(/\]/g, '%5D');
            // chunk = chunk.replace(/\^/g, '%5E');
            // chunk = chunk.replace(/`/g, '%60');
            // chunk = chunk.replace(/;/g, '%3B');
            // chunk = chunk.replace(/\?/g, '%3F');
            // chunk = chunk.replace(/:/g, '%3A');
            // chunk = chunk.replace(/@/g, '%40');
            // chunk = chunk.replace(/=/g, '%3D');

            encoded = encoded + chunk;
            index = index + slice;
        }

        var dataUri = 'data:image/svg+xml;utf8,' + encoded;

        return new nodes.Literal('url("' + dataUri + '")');
    }

    return svgImport;
}

module.exports = stylusSvg;