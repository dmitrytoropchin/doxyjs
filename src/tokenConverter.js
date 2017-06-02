const convertGlobalVariable = global_variable => {
  const type = global_variable.comment && global_variable.comment.type
    ? global_variable.comment.type
    : 'var';
  const name = global_variable.name || '';

  return { type, name, comment: global_variable.comment || null };
};

const convertGlobalFunction = global_function => {
  const type = global_function.comment && global_function.comment.return
    ? global_function.comment.return.type || 'void'
    : 'void';
  const name = global_function.name || '';
  const args = global_function.args.map(arg => {
    const type = global_function.comment &&
      global_function.comment.params &&
      arg in global_function.comment.params
      ? global_function.comment.params[arg].type || 'var'
      : 'var';
    const name = arg;
    return { type, name };
  });

  return { type, name, args, comment: global_function.comment || null };
};

const convertClass = _class => {
  const name = _class.name;
  const constructor = _class.constructor
    ? convertGlobalFunction(_class.constructor)
    : null;
  const base_class = _class.base_class || null;
  const methods = _class.methods.map(convertGlobalFunction);
  const comment = _class.constructor
    ? _class.constructor.comment || null
    : null;
  return { name, base_class, constructor, methods, comment };
};

exports.convertGlobalVariable = convertGlobalVariable;
exports.convertGlobalFunction = convertGlobalFunction;
exports.convertClass = convertClass;
