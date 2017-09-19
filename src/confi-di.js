const ContextLoader = require('./context/context_loader');

class ConfiDI {

  constructor(componentScan, handlers = []) {
    const contextLoader = new ContextLoader(componentScan, handlers);
    this.context = Object.freeze(contextLoader.createContext());
  }

  getContext() {
    return this.context;
  }
}

module.exports = ConfiDI;


