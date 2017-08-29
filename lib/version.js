const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

exports.readVersion = function (schemaDir, defaultVersion = '0.0.1') {
  let fileName = path.join(schemaDir, 'version.txt');
  try {
    return fs.readFileSync(fileName, 'ascii').trim();
  } catch (err) {
    console.log(`Error reading ${fileName}. Will attempt to create it with value ${defaultVersion}`);
    exports.writeVersion(defaultVersion, schemaDir);
    return defaultVersion;
  }
};

exports.writeVersion = function (version, schemaDir) {
  mkdirp.sync(schemaDir);
  fs.writeFileSync(path.join(schemaDir, 'version.txt'), version, 'ascii');
};
