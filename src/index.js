#!/usr/bin/env node

import fs from 'fs';
import program from 'commander';
import Localize from 'localize';
import doxyjs from './doxyjs';
import pkg from '../package.json';
import ts from './translations/translations.json';

const translator = new Localize(ts);

program
  .description(pkg.description)
  .version(pkg.version)
  .arguments('[files...]')
  .option('-e, --encoding <encoding>', 'source files encoding (utf8 by default)', 'utf8')
  .option(
    '-b, --line-break <line break>',
    'line break symbol [lf|crlf] (lf by default)',
    (val) => (val.match(/^crlf$/i) ? '\r\n' : '\n'),
    '\n'
  )
  .option('-l, --lang <language code>', 'output language (en by default)', 'en');

program.parse(process.argv);

if (program.args.length === 0) {
  console.error('doxyjs: no input files provided, aborting');
  process.exit(1);
}

translator.setLocale(program.lang);

program.args.forEach((file) => {
  fs.readFile(file, program.encoding, (error, data) => {
    if (error) {
      console.error(`doxyjs: can't read file ${file}, aborting`);
      process.exit(1);
    }

    const output = doxyjs(data, program.lineBreak, translator);

    process.stdout.write(output, program.encoding);
  });
});
