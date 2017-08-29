const logger = require('./logger');
const drivers = require('./drivers');

class Db {
  static connect() {
    if (!this.db) {
      const driver = drivers.getDriver();
      this.db = new Db(driver);
    }
    return this.db;
  }

  constructor(driver) {
    this.driver = driver;
  }
  
  async runTests(scripts = []) {
    const results = {
      totalTests: scripts.length,
      numPassed: 0,
      numStarted: 0,
    };
    for (let script of scripts) {
      results.numStarted++;
      logger.write(`Testing "${script.name}"... \t`);
      try {
        await this.execute(script.sql);
        logger.writeLine('Passed');
        results.numPassed++;
      } catch (err) {
        logger.writeLine('FAIL!!!');
      }
    }
    return results;
  }
  
  async runScripts(scripts = []) {
    for (let script of scripts) {
      logger.write(`Running "${script.name}"`);
      if (logger.verbose) {
        logger.writeLine(`:\n${script.sql}`);
      }
      const result = await this.execute(script.sql);
      if (logger.verbose) {
        logger.writeLine(`Result: $result`);
      } else {
        logger.writeLine(` ==> $result`);
      }
    }
  }

  async execute(sql) {
    return await this.driver.execute(sql);
  }

  async dumpSchema(filename) {
    await this.driver.dumpSchema(filename);
  }

  async dispose() {
    await this.driver.dispose();
  }
}

module.exports = Db;
