const comment_input = [
  `/*!
 * @file FileName.js
 */`,
  `/*!
 * @file FileName.js
 * @brief file description
 */`,
];

const comment_output = [
  `/*!
 * @file FileName.js
 */
`,
  `/*!
 * @brief file description
 * @file FileName.js
 */
`,
];

module.exports = {
  input: comment_input,
  output: comment_output,
};
