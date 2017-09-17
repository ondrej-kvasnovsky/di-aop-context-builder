const chai = require('chai');
const expect = chai.expect;
const Condi = require('../src/confi-di');

describe('Condi', function() {
  describe('#constructor()', function() {
    it('creates context', function() {
      const configFile = 'test/sample-config.json';
      const condi = new Condi(configFile);
      expect(condi.getContext().definitions.size).to.be.eql(2);
    });
  });
});