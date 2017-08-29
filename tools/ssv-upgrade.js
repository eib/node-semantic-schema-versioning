const { version } = require('../package.json');
const program = require('commander');
const upgrade = require('../lib/upgrade');
const env = require('../env');

function collect(value, values) {
  values.push(value);
}

program
  .version(version)
  .usage('[options] [version ...]')
  .option('-p, --pattern <glob>', 'A glob pattern to match script filenames against. (default "*")', collect, [])
  .parse(process.argv);

let versions = program.args || ['*'];
let patterns = program.pattern || ['*'];
upgrade(versions, patterns);
