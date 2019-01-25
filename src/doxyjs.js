import inputTokens from './inputTokens';
import inputStructure from './inputStructure';
import outputSource from './outputSource';

const doxyjs = (input_data, linebreak, ts) => {
  const input_str = input_data.charCodeAt(0) === 0xFEFF ? input_data.slice(1) : input_data;
  const input_lines = input_str.split(linebreak).filter((line) => line.length);
  const input_tokens = inputTokens(input_lines);
  const input_structure = inputStructure(input_tokens);
  const output_source = outputSource(input_structure, linebreak, ts);

  return output_source;
};

export default doxyjs;
