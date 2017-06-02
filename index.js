#!/usr/bin/env node

const program = require('commander');
const doxyjs = require('./doxyjs');
const pkg = require('./package.json');

program
  .description(pkg.description)
  .version(pkg.version)
  .arguments('[files...]')
  .option(
    '-e, --encoding <encoding>',
    'source files encoding (utf8 by default)',
    'utf8'
  )
  .option(
    '-b, --line-break <line break>',
    'line break symbol [lf|crlf] (lf by default)',
    val => (val.match(/^crlf$/i) ? '\r\n' : '\n'),
    '\n'
  );

program.parse(process.argv);

if (program.args.length == 0) {
  console.error(`doxyjs: no input files provided, aborting`);
  process.exit(1);
}

program.args.forEach(file => {
  doxyjs(file, program.encoding, program.lineBreak);
});
