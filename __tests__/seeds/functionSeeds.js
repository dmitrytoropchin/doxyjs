const functions_input = [
  `function foo()`,
  `function foo(arg1)`,
  `function foo(arg1, arg2)`,
  `//! function description
function foo(arg1, arg2);
`,
  `/*!
 * @brief function description
 */
function foo(arg1, arg2);
`,
  `/*!
 * @brief function description
 * @param arg1 arg 1 description
 * @param type:Date arg2 arg 2 description
 */
function foo(arg1, arg2);
`,
  `/*!
 * @brief function description
 * @param arg1 arg 1 description
 * @param type:Date arg2 arg 2 description
 * @return return description
 */
function foo(arg1, arg2);
`,
  `/*!
 * @brief function description
 * @param arg1 arg 1 description
 * @param type:Date arg2 arg 2 description
 * @return type:String return description
 */
function foo(arg1, arg2);
`,
];

const functions_output = [
  `void foo();
`,
  `void foo(var arg1);
`,
  `void foo(var arg1, var arg2);
`,
  `/*!
 * @brief function description
 */
void foo(var arg1, var arg2);
`,
  `/*!
 * @brief function description
 */
void foo(var arg1, var arg2);
`,
  `/*!
 * @brief function description
 * @param arg1 arg 1 description
 * @param arg2 arg 2 description
 */
void foo(var arg1, Date arg2);
`,
  `/*!
 * @brief function description
 * @param arg1 arg 1 description
 * @param arg2 arg 2 description
 * @return return description
 */
var foo(var arg1, Date arg2);
`,
  `/*!
 * @brief function description
 * @param arg1 arg 1 description
 * @param arg2 arg 2 description
 * @return return description
 */
String foo(var arg1, Date arg2);
`,
];

module.exports = {
  input: functions_input,
  output: functions_output,
};
