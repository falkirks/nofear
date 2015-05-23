'use strict';
var assert = require('assert');
var nofear = require('../');

describe('nofear node module', function () {
  it('must have at least one test', function () {
    new nofear();
    assert(true, 'I was too lazy to write any tests. Shame on me.');
  });
});
