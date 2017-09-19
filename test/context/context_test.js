const chai = require('chai');
const expect = chai.expect;
const ContextLoader = require('../../src/context/context_loader.js');

describe('Context', function() {
  describe('#getComponent()', function() {
    it('returns component by id with injected definitions', function() {
      const componentScan = [
          {
            "dir": "",
            "include": 'test/context/resources/**/*.js'
          }
        ];

      const contextLoader = new ContextLoader(componentScan);
      const context = contextLoader.createContext();

      const controller = context.getComponent('sampleController');
      const service = context.getComponent('sampleService');
      expect(controller.sampleService).to.be.eql(service)
    });

    it('wraps find method on a service and uses a handler', async function() {
      const componentScan = [
        {
          "dir": "",
          "include": 'test/context/resources/**/*.js'
        }
      ];

      const handlers = [
        {
          "components": ['.*Controller'],
          'methods': ['.*'],
          'handler': {
            apply: function(target, thisArg, args) {
              return "TO TEST CONTROLLER HANDLER WAS CALLED"
            }
          }
        },
        {
          "components": ['.*Service'],
          'methods': ['find.*'],
          'handler': {
            apply: function(target, thisArg, args) {
              return "TO TEST SERVICE HANDLER WAS CALLED"
            }
          }
        }
      ];
      const contextLoader = new ContextLoader(componentScan, handlers);
      const context = contextLoader.createContext();

      const controller = context.getComponent('sampleController');
      const service = context.getComponent('sampleService');
      expect(controller.sampleService).to.be.eql(service)

      const ctx = {};
      const controllerResult = await controller.show(ctx, 1);
      const serviceResult = await service.findById(1);
      expect(controllerResult).to.be.eql("TO TEST CONTROLLER HANDLER WAS CALLED")
      expect(serviceResult).to.be.eql("TO TEST SERVICE HANDLER WAS CALLED")
    });
  });
});