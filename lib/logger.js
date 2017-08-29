const util = require('util');

exports.write = function (...args) {
  for (let arg of args.map(format)) {
    process.stdout.write(arg);
  }
};

exports.writeLine = function (...args) {
  for (let arg of args.map(format)) {
    process.stdout.write(arg);
  }
  process.stdout.write('\n');
};

function format(arg) {
  return (typeof arg === 'string') ? arg : util.inspect(arg);
}
