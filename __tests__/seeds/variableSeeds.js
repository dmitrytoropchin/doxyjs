const variables_input = [
  `var x;`,
  `let x;`,
  `const x;`,
  `//! variable description
var x;
`,
  `//! variable description
let x;
`,
  `//! variable description
const x;
`,
  `//! type:String variable description
var x;
`,
];

const variables_output = [
  `var x;
`,
  `var x;
`,
  `var x;
`,
  `//! variable description
var x;
`,
  `//! variable description
var x;
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
