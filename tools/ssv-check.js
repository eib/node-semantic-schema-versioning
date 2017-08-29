const Db = require('../lib/db');
const { getDriver } = require('../lib/drivers');
const env = require('../env');
const logger = require('../lib/logger');

function check() {
  logger.writeLine('Beginning health checks...');
  Promise.resolve()
    .then(() => checkVersion())
    .then(() => checkDriver())
    .catch(err => console.log('ERROR:', err))
    .then(() => logger.writeLine('Done.'));
};

function checkVersion() {
  logger.writeLine(` -> Checking schema version... ${env.currentVersion}`);
}

async function checkDriver() {
  logger.write(' -> Checking DB driver...');
  let db;
  try {
    db = await Db.connect();
    await db.execute('SELECT 1');
    logger.writeLine(' OK!');
  } catch (err) {
    logger.writeLine('! ERROR !');
    logger.writeLine(err);
  } finally {
    if (db) {
      await db.dispose();
    }
  }
}

exports = module.exports = check;

check();
