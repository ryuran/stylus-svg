/**
 * Module dependencies.
 */
var stylus = require('stylus');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

chai.should();

/**
 * Read test/cases directory and filter all `.styl` files, then remove
 * this extension for each file in the collection and prepare to test.
 */
var cases = fs.readdirSync('test/cases').filter(function (file) {
  return file.indexOf('.styl') !== -1;
}).map(function (file) {
  return file.replace('.styl', '');
});

/*
 * For each `.styl` and `.css` pair in `test/cases`, compile stylus to css
 * and compare actual result to expected css.
 */
describe('integration', function () {
  cases.forEach(function (test) {
    var name = test.replace(/[-.]/g, ' ');
    it(name, function (done) {
      var path = 'test/cases/' + test;
      var styl = fs.readFileSync(path + '.styl', 'utf8').replace(/\r/g, '');
      var css = fs.readFileSync(path + '.css', 'utf8').replace(/\r/g, '').trim();

      var style = stylus(styl)
        .set('filename', path + '.styl')
        .define('url', stylus.url());

      if (test.indexOf('compress') !== -1) {
        style.set('compress', true);
      }

      style.render(function (err, actual) {
        if (err) throw err;
        actual.trim().should.equal(css);
        done();
      });
    });
  });
});
