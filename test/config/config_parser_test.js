const chai = require('chai');
const expect = chai.expect;
const ConfigParser = require('../../src/config/config_parser.js');

describe('ConfigParser', function() {
  describe('#getComponent()', function() {
    it('returns component scan include pattern', function() {
      const configFile = 'test/config/sample-config.json';
      const parser = new ConfigParser(configFile);
      const includePattern = parser.getConfig().componentScan.include;
      expect(includePattern).to.be.eql('src/**/*.js')
    });
  });
});