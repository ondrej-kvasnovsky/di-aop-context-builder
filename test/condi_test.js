const chai = require('chai');
const expect = chai.expect;
const ConfiDI = require('../src/confi-di');

describe('Condi', function () {
  describe('#constructor()', function () {
    it('creates context', function () {
      const componentScan = [
        {
          "dir": "",
          "include": "test/context/resources/**/*.js"
        }
      ];

      const condi = new ConfiDI(componentScan);
      expect(condi.getContext().definitions.size).to.be.eql(2);
    });

    it('creates context with method handler', function () {
      const componentScan = [
        {
          "dir": "",
          "include": "test/context/resources/**/*.js"
        }
      ];

      const handlers = [
        {
          "components": ['.*Service'],
          'methods': ['.*'],
          'handler': {
            apply: async function (target, thisArg, args) {
              console.log('proxy called');
              const start = new Date();

              // call a method on service
              const result = await target.apply(thisArg, args);

              const diff = new Date() - start;
              console.log(`Time: ${diff}`); // report time it took to execute
              return result;
            }
          }
        }
      ]

      const condi = new ConfiDI(componentScan, handlers);
      expect(condi.getContext().definitions.size).to.be.eql(2);
    });
  });
});