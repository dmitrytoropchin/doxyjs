const isDetachedComment = (token) => token.token_type === 'multiline_comment' && token.filename;

const isAttachedComment = (token) =>
  token.token_type === 'singleline_comment' ||
  (token.token_type === 'multiline_comment' && !isDetachedComment(token));

const prev = (array, index) => (index > 0 ? array[index - 1] : null);

const comment = (array, index) => {
  const t = prev(array, index);
  return t && isAttachedComment(t) ? t : null;
};

const prefillClass = (structure, class_name) => {
  if (!(class_name in structure.classes)) {
    structure.classes[class_name] = {class_name, methods: []};
  }
};

const attachVariableComment = (token, comment) => {
  if (comment) {
    token.type = comment.type || 'var';
    token.comment = comment;
  } else {
    token.type = 'var';
  }
  return token;
};

const attachFunctionComment = (token, comment) => {
  if (comment) {
    token.args.forEach((arg) => {
      if (comment.params && arg.name in comment.params) {
        arg.type = comment.params[arg.name].type || 'var';
      } else {
        arg.type = 'var';
      }
    });

    token.type = comment.return ? comment.return.type || 'var' : 'void';
    token.comment = comment;
  } else {
    token.args.forEach((arg) => {
      arg.type = 'var';
    });

    token.type = 'void';
  }
  return token;
};

const attachClassConstructorComment = (token, comment) => {
  if (comment) {
    token.args.forEach((arg) => {
      if (comment.params && arg.name in comment.params) {
        arg.type = comment.params[arg.name].type || 'var';
      } else {
        arg.type = 'var';
      }
    });

    token.comment = comment;
  } else {
    token.args.forEach((arg) => {
      arg.type = 'var';
    });
  }
  return token;
};

const attachClassMethodComment = (token, comment) => {
  if (comment) {
    token.args.forEach((arg) => {
      if (comment.params && arg.name in comment.params) {
        arg.type = comment.params[arg.name].type || 'var';
      } else {
        arg.type = 'var';
      }
    });

    token.type = comment.return ? comment.return.type || 'void' : 'void';
    token.comment = comment;
  } else {
    token.args.forEach((arg) => {
      arg.type = 'var';
    });

    token.type = 'void';
  }
  return token;
};

const inputStructure = (tokens) => {
  const structure = {
    comments: [],
    variables: [],
    functions: [],
    classes: {},
  };

  tokens.forEach((token, index, tokens) => {
    switch (token.token_type) {
      case 'variable':
        structure.variables.push(attachVariableComment(token, comment(tokens, index)));
        break;
      case 'function':
        structure.functions.push(attachFunctionComment(token, comment(tokens, index)));
        break;
      case 'class_constructor':
        prefillClass(structure, token.class_name);
        structure.classes[token.class_name].constructor = attachClassConstructorComment(token, comment(tokens, index));
        structure.classes[token.class_name].comment = comment(tokens, index) || undefined;
        break;
      case 'class_method':
        prefillClass(structure, token.class_name);
        structure.classes[token.class_name].methods.push(
          attachClassMethodComment(token, comment(tokens, index))
        );
        break;
      case 'base_class':
        prefillClass(structure, token.class_name);
        structure.classes[token.class_name].base_class = token;
        break;
      case 'singleline_comment':
        // do nothing, all single lines comments must attach to next token
        break;
      case 'multiline_comment':
        if (isDetachedComment(token)) {
          structure.comments.push(token);
        }
        break;
      default:
        break;
    }
  });

  return structure;
};

export default inputStructure;
