const class_input = [
  `
function ClassName();
`,
  `
function ClassName();
ClassName.prototype = Object.create(BaseClassName.prototype);
`,
  `
//! class description
function ClassName(class_arg);
ClassName.prototype = Object.create(BaseClassName.prototype);
`,
  `
function ClassName(class_arg);
ClassName.prototype = Object.create(BaseClassName.prototype);
ClassName.prototype.foo = function() {}
ClassName.prototype.bar = function(method_arg1, method_arg2) {}
`,
  `
/*!
 * @brief class description
 * @param type:Date class_arg class arg description
 */
function ClassName(class_arg);
ClassName.prototype = Object.create(BaseClassName.prototype);
/*!
 * @brief class method foo description
 * @return type:Object return foo description
 */
ClassName.prototype.foo = function() {}
/*!
 * @brief class method bar description
 * @param method_arg1 class method arg 1 description
 * @param type:String method_arg2 class method arg 1 description
 */
ClassName.prototype.bar = function(method_arg1, method_arg2) {}
//! baz description
ClassName.prototype.baz = function(args);
`,
];

const class_output = [
  `class ClassName {
public:
ClassName();
};
`,
  `class ClassName: public BaseClassName {
public:
ClassName();
};
`,
  `//! class description
class ClassName: public BaseClassName {
public:
/*!
 * @brief Constructor
 */
ClassName(var class_arg);
};
`,
  `class ClassName: public BaseClassName {
public:
ClassName(var class_arg);
void foo();
void bar(var method_arg1, var method_arg2);
};
`,
  `//! class description
class ClassName: public BaseClassName {
public:
/*!
 * @brief Constructor
 * @param class_arg class arg description
 */
ClassName(Date class_arg);
/*!
 * @brief class method foo description
 * @return return foo description
 */
Object foo();
/*!
 * @brief class method bar description
 * @param method_arg1 class method arg 1 description
 * @param method_arg2 class method arg 1 description
 */
void bar(var method_arg1, String method_arg2);
/*!
 * @brief baz description
 */
void baz(var args);
};
`,
];

module.exports = {
  input: class_input,
  output: class_output,
};
