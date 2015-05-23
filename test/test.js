'use strict';
//var assert = require('assert');
var NoFear = require('../');

describe('nofear node module', function () {
  this.timeout(40000);
  it('must be able to search pages', function (done) {
    var nofear = new NoFear();
    nofear.findQuoteOnPage("for a muse", "Henry V", "2", done);
  });
  it('must be able to search scenes', function (done) {
    var nofear = new NoFear();
    nofear.findQuoteInScene("for a muse", "Henry V", "1", "Prologue", done);
  });
  it('must be able to search acts', function (done) {
    var nofear = new NoFear();
    nofear.findQuoteInAct("for a muse", "Henry V", "1", done);
  });
  it('must be able to search plays', function (done) {
    var nofear = new NoFear();
    nofear.findQuoteInPlay("for a muse", "Henry V", done);
  });
  it('must be able to search all plays', function (done) {
    var nofear = new NoFear();
    nofear.findQuoteInPlay("for a muse", done);
  });
});
