const chai = require('chai');
const expect = chai.expect;
const ContextLoader = require('../../src/context/context_loader.js');

describe('ContextLoader', function() {
  describe('#load()', function() {
    it('loads context', function() {
      const includePattern = '../../test/context/resources/**/*.js';
      const handlers = [
        {
          'classPatterns': ['.*Service'],
          'methodPatterns': ['find.*'],
          'handler': {
            apply: function(target, thisArg, args) {
              console.log('proxy called');
              return target.apply(thisArg, args);
            }
          }
        }
      ];
      const contextLoader = new ContextLoader(__dirname, includePattern, handlers);
      const context = contextLoader.createContext();
      expect(context.definitions.size).to.be.eql(2);
      expect(context.definitions).to.contain.key('sampleController');
      expect(context.definitions).to.contain.key('sampleService');

      const controllerInstance = context.getComponent('sampleController');
      const serviceInstance = controllerInstance.sampleService
    });
  });
});