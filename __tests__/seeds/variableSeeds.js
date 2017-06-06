const variables_input = [
  `var x;`,
  `//! variable description
var x;
`,
  `//! type:String variable description
var x;
`,
];

const variables_output = [
  `var x;
`,
  `//! variable description
var x;
`,
  `//! variable description
String x;
`,
];

module.exports = {
  input: variables_input,
  output: variables_output,
};
