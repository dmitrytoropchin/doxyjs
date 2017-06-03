#!/usr/bin/env node

const program = require('commander');
const localize = require('localize');
const doxyjs = require('./doxyjs');
const pkg = require('./package.json');

const translator = new localize('./translations');

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
  )
  .option(
    '-l, --lang <language code>',
    'output language (en by default)',
    'en'
  );

program.parse(process.argv);

if (program.args.length == 0) {
  console.error(`doxyjs: no input files provided, aborting`);
  process.exit(1);
}

translator.setLocale(program.lang);

program.args.forEach(file => {
  doxyjs(file, program.encoding, program.lineBreak, translator);
});
