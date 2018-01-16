const ContextLoader = require('./context/context_loader');

class ContextBuilder {

  constructor(componentScan, handlers = []) {
    const contextLoader = new ContextLoader(componentScan, handlers);
    this.context = Object.freeze(contextLoader.createContext());
  }

  getContext() {
    return this.context;
  }
}

module.exports = ContextBuilder;


