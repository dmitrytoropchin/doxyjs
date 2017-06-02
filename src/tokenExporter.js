const exportGlobalVariable = (global_variable, linebreak) => {
  let variable_export = '';

  if (global_variable.comment && global_variable.comment.brief) {
    variable_export += `//! ${global_variable.comment.brief || ''}${linebreak}`;
  }

  variable_export += `${global_variable.type} ${global_variable.name};${linebreak}`;

  return variable_export;
};

const exportGlobalFunction = (global_function, linebreak) => {
  let function_export = '';

  if (global_function.comment) {
    const comment = global_function.comment;

    function_export += `/*!${linebreak}`;

    if (comment.brief) {
      function_export += ` * @brief ${comment.brief}${linebreak}`;
    }

    if (comment.params) {
      Object.keys(comment.params)
        .map(param_name => comment.params[param_name])
        .forEach(param => {
          function_export += ` * @param ${param.name || ''} ${param.brief || ''}${linebreak}`;
        });
    }

    if (comment.return) {
      function_export += ` * @return ${comment.return.brief || ''}${linebreak}`;
    }

    function_export += ` */${linebreak}`;
  }

  function_export += `${global_function.type} ${global_function.name}(${global_function.args
    .map(arg => `${arg.type} ${arg.name}`)
    .join(', ')});${linebreak}`;

  return function_export;
};

const exportClass = (_class, linebreak) => {
  let class_export = '';

  if (_class.constructor && _class.constructor.comment) {
    class_export += `//! ${_class.constructor.comment.brief || ''}${linebreak}`;
  }

  class_export += `class ${_class.name}`;

  if (_class.base_class) {
    class_export += `: public ${_class.base_class}`;
  }

  class_export += ` {${linebreak}`;
  class_export += `public:${linebreak}`;

  if (_class.constructor) {
    if (_class.constructor.comment) {
      const comment = _class.constructor.comment;

      class_export += `/*!${linebreak}`;
      class_export += ` * @brief Constructor${linebreak}`;

      if (comment.params) {
        Object.keys(comment.params)
          .map(param_name => comment.params[param_name])
          .forEach(param => {
            class_export += ` * @param ${param.name || ''} ${param.brief || ''}${linebreak}`;
          });
      }

      class_export += ` */${linebreak}`;
    }

    class_export += `${_class.name}(${_class.constructor.args
      .map(arg => `${arg.type} ${arg.name}`)
      .join(', ')});${linebreak}`;
  }

  _class.methods.forEach(method => {
    class_export += `${exportGlobalFunction(method, linebreak)}`;
  });

  class_export += `};${linebreak}`;

  return class_export;
};

exports.exportGlobalVariable = exportGlobalVariable;
exports.exportGlobalFunction = exportGlobalFunction;
exports.exportClass = exportClass;
