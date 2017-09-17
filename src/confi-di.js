const ConfigParser = require('./config/config_parser');
const ContextLoader = require('./context/context_loader');

class ConfiDI {

  constructor(configFile, handlers = []) {
    const contextParser = new ConfigParser(configFile);
    const includePattern = contextParser.getConfig().componentScan.include;
    const dir = contextParser.getConfig().componentScan.dir;
    const contextLoader = new ContextLoader(dir, includePattern, handlers);
    this.context = Object.freeze(contextLoader.createContext());
  }

  getContext() {
    return this.context;
  }
}

module.exports = ConfiDI;


