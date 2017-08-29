const { version } = require('../package.json');
const program = require('commander');
const env = require('../env');

function collect(value, values) {
  values.push(value);
}

program
  .version(version)
  .command('check', 'Checks database connectivity and settings.')
  .command('upgrade', 'Deploys database upgrade.')
  .command('dump', 'Creates a database dump.')
  .command('verify', 'Runs the gamut of schema-tests.')
  .parse(process.argv);
