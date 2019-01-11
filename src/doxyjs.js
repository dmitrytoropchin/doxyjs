import inputTokens from './inputTokens';
import inputStructure from './inputStructure';
import outputSource from './outputSource';

const doxyjs = (input_data, linebreak, ts) => {
  const input_lines = input_data.split(linebreak).filter((line) => line.length);
  const input_tokens = inputTokens(input_lines);
  const input_structure = inputStructure(input_tokens);
  const output_source = outputSource(input_structure, linebreak, ts);

  return output_source;
};

export default doxyjs;
