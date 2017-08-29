const env = require('../env');
const glob = require('glob');

exports = module.exports = async function readScripts(pattern) {
  const matches = await new Promise(function (resolve, reject) {
    glob(pattern, { cwd: env.schemaDir }, function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
  return matches;
};
