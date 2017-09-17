const chai = require('chai');
const expect = chai.expect;
const ContextLoader = require('../../src/context/context_loader.js');

describe('Context', function() {
  describe('#getComponent()', function() {
    it('returns component by id with injected definitions', function() {
      const includePattern = '../../test/context/resources/**/*.js';
      const contextLoader = new ContextLoader(__dirname, includePattern);
      const context = contextLoader.createContext();

      const controller = context.getComponent('sampleController');
      const service = context.getComponent('sampleService');
      expect(controller.sampleService).to.be.eql(service)
    });

    it('wraps find method on a service and uses a handler', async function() {
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
        },
        {
          'classPatterns': ['.*Controller'],
          'methodPatterns': ['.*'],
          'handler': {
            apply: function(target, thisArg, args) {
              console.log('controller proxy called')
              return target.apply(thisArg, args)
            }
          }
        }
      ];
      const contextLoader = new ContextLoader(__dirname, includePattern, handlers);
      const context = contextLoader.createContext();

      const controller = context.getComponent('sampleController');
      const service = context.getComponent('sampleService');
      expect(controller.sampleService).to.be.eql(service)

      let ctx = {};
      const controllerResult = await controller.show(ctx, 1);
      const serviceResult = await service.findById(1);
      console.log(ctx);
      console.log(serviceResult);
    });
  });
});