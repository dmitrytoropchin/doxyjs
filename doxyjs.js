const fs = require('fs');
const extractToken = require('./src/extractToken.js');
const reduceToken = require('./src/reduceToken');
const tokenConverter = require('./src/tokenConverter.js');
const tokenExporter = require('./src/tokenExporter.js');

const doxyjs = (input_data, encoding, linebreak) => {
  const input_lines = input_data.split(linebreak).filter(line => line.length);
  const input_file_tokens = input_lines.reduce(extractToken, []);
  const input_file_structure = input_file_tokens.reduce(reduceToken, {
    global_variables: [],
    global_functions: [],
    classes: {},
  });

  const global_variables = input_file_structure.global_variables.map(
    tokenConverter.convertGlobalVariable
  );
  const global_functions = input_file_structure.global_functions.map(
    tokenConverter.convertGlobalFunction
  );
  const classes = Object.keys(input_file_structure.classes)
    .map(class_name => input_file_structure.classes[class_name])
    .map(tokenConverter.convertClass);

  const exported_variables = global_variables.map(v =>
    tokenExporter.exportGlobalVariable(v, linebreak)
  );
  const exported_functions = global_functions.map(f =>
    tokenExporter.exportGlobalFunction(f, linebreak)
  );

  const exported_classes = classes.map(c =>
    tokenExporter.exportClass(c, linebreak)
  );

  process.stdout.write(
    [...exported_variables, ...exported_functions, ...exported_classes].join(
      ''
    ),
    encoding
  );
};

module.exports = (filename, encoding, linebreak) => {
  fs.readFile(filename, encoding, (error, data) => {
    if (error) {
      console.error(`doxyjs: can't read file ${input_filename}, aborting`);
      process.exit(1);
    }

    doxyjs(data, encoding, linebreak);
  });
};
