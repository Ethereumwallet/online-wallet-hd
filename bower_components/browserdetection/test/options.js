casper.hasClass = function(className) {
  return this.evaluate(function(className) {
    return document.body.parentNode.className.indexOf(className) !== -1;
  }, className);
};

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0');

casper.start('http://localhost:8888/test/resources/index.html', function() {

  this.test.comment('addClasses');

  this.evaluate(function() {
    browserDetection({
      addClasses: true
    });
  });

  this.test.assertTrue(this.hasClass('osx'));
  this.test.assertTrue(this.hasClass('firefox'));
  this.test.assertTrue(this.hasClass('firefox-24'));

});

casper.run();