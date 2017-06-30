const args_matcher = arguments_string =>
  (arguments_string && arguments_string.trim().length
    ? arguments_string.split(',').map(arg => ({ name: arg.trim() }))
    : []);

const variable_matcher = (tokens, line) => {
  const expr = /^var\s(\w+)/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;
    const [, name] = match;
    new_tokens = [...new_tokens, { token_type: 'variable', name }];
    return new_tokens;
  }

  return null;
};

const function_matcher = (tokens, line) => {
  const expr = /^function\s+([^A-Z]\w*)\s*\((.*)\)/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;

    const [, name, args] = match;
    new_tokens = [...new_tokens, { token_type: 'function', name, args: args_matcher(args) }];

    return new_tokens;
  }

  return null;
};

const class_constructor_matcher = (tokens, line) => {
  const expr = /^function\s+([A-Z]\w*)\s*\((.*)\)/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;

    const [, class_name, args] = match;
    new_tokens = [
      ...new_tokens,
      {
        token_type: 'class_constructor',
        class_name,
        name: class_name,
        args: args_matcher(args),
      },
    ];

    return new_tokens;
  }

  return null;
};

const class_method_matcher = (tokens, line) => {
  const expr = /^(\w+)\.prototype\.(\w+)\s*=\s*function\((.*)\)/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;

    const [, class_name, method_name, method_args] = match;
    new_tokens = [
      ...new_tokens,
      {
        token_type: 'class_method',
        class_name,
        name: method_name,
        args: args_matcher(method_args),
      },
    ];

    return new_tokens;
  }

  return null;
};

const base_class_matcher = (tokens, line) => {
  const expr = /^(\w+)\.prototype\s*=\s*Object\.create\((\w+)\.prototype\)/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;

    const [, class_name, base_name] = match;
    new_tokens = [
      ...new_tokens,
      {
        token_type: 'base_class',
        class_name,
        base_name,
      },
    ];

    return new_tokens;
  }

  return null;
};

const single_line_comment_matcher = (tokens, line) => {
  const expr = /^\/\/!\s*(type:(\w+))?\s*(.*)$/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;
    const [, , variable_type, variable_brief] = match;
    new_tokens = [
      ...new_tokens,
      {
        token_type: 'singleline_comment',
        type: variable_type,
        brief: variable_brief,
      },
    ];
    return new_tokens;
  }

  return null;
};

const multiline_comment_begin_matcher = (tokens, line) => {
  const expr = /^\/\*!\s*$/;
  const match = line.match(expr);

  if (match) {
    let new_tokens = tokens;
    new_tokens = [...new_tokens, { token_type: 'multiline_comment' }];
    return new_tokens;
  }

  return null;
};

const multiline_comment_file_matcher = (tokens, line) => {
  const expr = /^\s*\*\s+@file\s+(.+)$/;
  const match = line.match(expr);

  if (match) {
    const new_tokens = tokens;
    const [, filename] = match;
    new_tokens[new_tokens.length - 1].filename = filename;
    return new_tokens;
  }

  return null;
};

const multiline_comment_brief_matcher = (tokens, line) => {
  const expr = /^\s*\*\s+@brief\s+(.+)$/;
  const match = line.match(expr);

  if (match) {
    const new_tokens = tokens;
    const [, brief] = match;
    new_tokens[new_tokens.length - 1].brief = brief;
    return new_tokens;
  }

  return null;
};

const multiline_comment_param_matcher = (tokens, line) => {
  const expr = /^\s*\*\s+@param\s+(type:(\w+)\s+)*(\w+)\s*(.*)$/;
  const match = line.match(expr);

  if (match) {
    const new_tokens = tokens;

    const [, , param_type, param_name, param_brief] = match;

    if (!('params' in new_tokens[new_tokens.length - 1])) {
      new_tokens[new_tokens.length - 1].params = {};
    }

    if (!(param_name in new_tokens[new_tokens.length - 1].params)) {
      new_tokens[new_tokens.length - 1].params[param_name] = {};
    }

    new_tokens[new_tokens.length - 1].params[param_name].type = param_type;
    new_tokens[new_tokens.length - 1].params[param_name].name = param_name;
    new_tokens[new_tokens.length - 1].params[param_name].brief = param_brief;

    return new_tokens;
  }

  return null;
};

const multiline_comment_return_matcher = (tokens, line) => {
  const expr = /^\s*\*\s+@return\s+(type:(\w+)\s+)*(.*)$/;
  const match = line.match(expr);

  if (match) {
    const new_tokens = tokens;

    const [, , return_type, return_brief] = match;

    new_tokens[new_tokens.length - 1].return = {};
    new_tokens[new_tokens.length - 1].return.type = return_type;
    new_tokens[new_tokens.length - 1].return.brief = return_brief;

    return new_tokens;
  }

  return null;
};

const multiline_comment_end_matcher = (tokens, line) => {
  const expr = /^\s*\*\/\s*$/;
  const match = line.match(expr);

  if (match) {
    return tokens;
  }

  return null;
};

const inputTokens = (input_lines) => {
  const input_tokens = input_lines.reduce((tokens, line) => {
    const new_tokens =
      variable_matcher(tokens, line) ||
      function_matcher(tokens, line) ||
      class_constructor_matcher(tokens, line) ||
      class_method_matcher(tokens, line) ||
      base_class_matcher(tokens, line) ||
      single_line_comment_matcher(tokens, line) ||
      multiline_comment_begin_matcher(tokens, line) ||
      multiline_comment_file_matcher(tokens, line) ||
      multiline_comment_brief_matcher(tokens, line) ||
      multiline_comment_param_matcher(tokens, line) ||
      multiline_comment_return_matcher(tokens, line) ||
      multiline_comment_end_matcher(tokens, line);
    return new_tokens || tokens;
  }, []);

  return input_tokens;
};

export default inputTokens;
