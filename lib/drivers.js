const URL = require('url');
const env = require('../env');

exports.getDriver = function () {
  const driverName = env.driverName;
  const connectionString = env.connectionString;
  const Driver = exports[driverName];
  if (!Driver) {
    throw new Error(`No driver named "${driverName}"`);
  }
  return new Driver(connectionString, driverName);
}

/*
 * DB Drivers currently need to implement the following:
 *   constructor(connectionString:string, driverName:String) => new instance
 *         Note: connectionString should be parse-able via parseConnectionString()
 *   async execute(sql:String) => boolean
 *   async dumpSchema(filename:String) => void
 *   dispose() => void
 */

exports.postgresql = class PostgreSqlDriver {
  constructor(connectionString, driverName) {
    const { Client } = tryRequire('pg', driverName);
    this.client = null;
    this.clientFactory = async () => {
      const client = new Client({ connectionString });
      await client.connect();
      return client;
    };
  }
  async getClient() {
    if (!this.client) {
      this.client = await this.clientFactory();
    }
    return this.client;
  }
  async execute(sql) {
    const client = await this.getClient();
    const result = await new Promise((resolve, reject) => {
      client.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    return !!result;
  }
  async dumpSchema(filename) {
    throw new Error('Not implemented');
  }
  async dispose() {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }
};

/**
 * Expects "protocol://username:password@hostname:port/dbName"
 */
function parseConnectionString(connectionString) {
  let { protocol, username, password, hostname, port, path } = new URL(connectionString);
  path = path.replace(/^\//g, '');
  return {
    driver: protocol,
    username,
    password,
    hostname,
    port,
    dbName: path,
  };
}

function tryRequire(moduleName, driverName) {
  try {
    return require(moduleName);
  } catch (err) {
    throw new Error(`Error: In order to use the ${driverName} driver, you must first install the "${moduleName}" node module.`);
  }
}
