const inputTokens = require('./src/inputTokens');
const inputStructure = require('./src/inputStructure');
const outputSource = require('./src/outputSource');

const doxyjs = (input_data, linebreak, ts) => {
  const input_lines = input_data.split(linebreak).filter(line => line.length);
  const input_tokens = inputTokens(input_lines);
  const input_structure = inputStructure(input_tokens);
  const output_source = outputSource(input_structure, linebreak, ts);

  return output_source;
};

module.exports = doxyjs;
