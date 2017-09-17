const AsyncFs = require('mz/fs');

class ConfigParser {
  constructor(configFile) {
    this.configFile = configFile;
  }

  getConfig() {
    const config = AsyncFs.readFileSync(this.configFile);
    return JSON.parse(config);
  }
}

module.exports = ConfigParser;