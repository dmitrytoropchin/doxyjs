const commentSource = (token, br, ts) => {
  let source = ``;

  source += `/*!${br}`;
  source += token.brief ? ` * @brief ${token.brief}${br}` : ``;
  source += token.filename ? ` * @file ${token.filename}${br}` : ``;
  source += token.params
    ? Object.keys(token.params)
        .map(param_name => token.params[param_name])
        .map(param => ` * @param ${param.name || ''} ${param.brief || ''}${br}`)
    : ``;
  source += token.return ? ` * @return ${token.return.brief || ''}${br}` : ``;
  source += ` */${br}`;

  return source;
};

const variableSource = (token, br, ts) => {
  let source = ``;

  source += token.comment ? `//! ${token.comment.brief || ''}${br}` : ``;
  source += `${token.type} ${token.name};${br}`;

  return source;
};

const functionSource = (token, br, ts) => {
  let source = ``;

  source += token.comment ? commentSource(token.comment, br) : ``;
  source += `${token.type} ${token.name}(${token.args
    .map(arg => `${arg.type} ${arg.name}`)
    .join(', ')})${br}`;

  return source;
};

const classSource = (token, br, ts) => {
  let source = ``;

  source += token.comment ? `//! ${token.comment.brief || ''}${br}` : ``;
  source += `class ${token.class_name}`;
  source += token.base_class
    ? `: public ${token.base_class.base_name} {${br}`
    : ` {${br}`;
  source += `public:${br}`;

  if (token.constructor) {
    if (token.constructor.comment) {
      source += `/*!${br}`;
      source += ` * @brief ${ts.translate('Constructor')}${br}`;
      source += token.constructor.comment.params
        ? Object.keys(token.constructor.comment.params)
            .map(param_name => token.constructor.comment.params[param_name])
            .map(
              param => ` * @param ${param.name || ''} ${param.brief || ''}${br}`
            )
        : ``;
      source += ` */${br}`;
    }
    source += `${token.constructor.name}(${token.constructor.args
      .map(arg => `${arg.type} ${arg.name}`)
      .join(', ')})${br}`;
  }

  source += token.methods
    .map(method => functionSource(method, br, ts))
    .join(br);

  source += `};${br}`;

  return source;
};

const outputSource = (structure, br, ts) => {
  let output_sources = [];

  structure.comments.forEach(token => {
    output_sources.push(commentSource(token, br, ts));
  });

  structure.variables.forEach(token => {
    output_sources.push(variableSource(token, br, ts));
  });

  structure.functions.forEach(token => {
    output_sources.push(functionSource(token, br, ts));
  });

  Object.keys(structure.classes)
    .map(class_name => structure.classes[class_name])
    .forEach(_class => {
      output_sources.push(classSource(_class, br, ts));
    });

  return output_sources.join(br);
};

module.exports = outputSource;
