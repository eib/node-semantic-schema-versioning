const Db = require('../lib/db');
const env = require('../env');
const logger = require('../lib/logger');
const { runTests } = require('./verify');
const { dumpSchema } = require('./dump');
const readScripts = require('../lib/readScripts');

module.exports = async function upgrade(versions, patterns) {
  logger.writeLine('Beginning database upgrades.');
  logger.writeLine('Versions:', versions);
  logger.writeLine('Pattern globs:', patterns);

  await runUpgrades(versions, patterns);
  await runTests(versions, patterns);
  if (isFullUpgrade(versions, patterns) && !env.skipSchemaDump) {
    await dumpSchema(`${env.schemaDir}/${env.currentVersion}/schema.sql`);
  }
  logger.writeLine('Done.');
};

runUpgrades = async function (versions, patterns) {
  const db = Db.connect();
  for (let version in versions) {
    for (let pattern in patterns) {
      const globs = [
        `./${version}/tables/${pattern}.upgrade.sql`,
        `./${version}/columns/${pattern}.upgrade.sql`,
        `./${version}/constraints/${pattern}.upgrade.sql`,
        `./${version}/data/${pattern}.upgrade.sql`,
      ];
      if (globs.length) {
        await Promise.all(globs.map(async glob => {
          const scripts = await readScripts(glob);
          await db.runScripts(scripts);
        }));
      }
    }
  }
}

function isFullUpgrade(versions, patterns) {
  return versions[0] === '*' && patterns[0] === '*';
}
