const utils = require('./utils');

const extractVariable = line => {
  const variable_expr = /^var\s+(\w+)/;
  const variable_match = line.match(variable_expr);
  if (variable_match) {
    const [, variable_name] = variable_match;
    return {
      type: 'global_variable',
      name: variable_name,
    };
  }

  return null;
};

const extractFunction = line => {
  const function_expr = /^function\s+(\w+)\s*\((.*)\)/;
  const function_match = line.match(function_expr);
  if (function_match) {
    const [, function_name, function_args] = function_match;
    if (!utils.isClassName(function_name)) {
      return {
        type: 'global_function',
        name: function_name,
        args: utils.argsArray(function_args),
      };
    }
  }

  return null;
};

const extractClass = line => {
  const function_expr = /^function\s+(\w+)\s*\((.*)\)/;
  const function_match = line.match(function_expr);
  if (function_match) {
    const [, function_name, function_args] = function_match;
    if (utils.isClassName(function_name)) {
      return {
        type: 'class_constructor',
        class: function_name,
        args: utils.argsArray(function_args),
      };
    }
  }

  return null;
};

const extractBaseClass = line => {
  const base_class_expr = /^\s*(\w+)\.prototype\s*\=\s*Object\.create\((\w+)\.prototype\)/;
  const base_class_match = line.match(base_class_expr);

  if (base_class_match) {
    const [, class_name, base_class_name] = base_class_match;
    return {
      type: 'base_class',
      class: class_name,
      base_class: base_class_name,
    };
  }

  return null;
};

const extractClassMethod = line => {
  const class_method_expr = /^(\w+)\.prototype\.(\w+)\s*\=\s*function\((.*)\)/;
  const class_method_match = line.match(class_method_expr);
  if (class_method_match) {
    const [, class_name, method_name, method_args] = class_method_match;
    return {
      type: 'class_method',
      class: class_name,
      name: method_name,
      args: utils.argsArray(method_args),
    };
  }

  return null;
};

const extractComment = comment_array => {
  const oneliner_expr = /^\s*\/\/\!\s*(type\:(\w+))?\s*(.*)$/;
  const brief_expr = /^\s*\*\s*@brief\s*(.*)$/;
  const param_expr = /^\s*\*\s*@param\s*(type\:(\w+))?\s*(\w+)\s*(.*)$/;
  const return_expr = /^\s*\*\s*@return\s*(type\:(\w+))?\s*(.*)$/;

  const comment = comment_array.reduce((comment, line) => {
    const oneliner_match = line.match(oneliner_expr);
    if (oneliner_match) {
      const [, , type, brief] = oneliner_match;
      comment.brief = brief;
      comment.type = type;
      return comment;
    }

    const brief_match = line.match(brief_expr);
    if (brief_match) {
      const [, brief] = brief_match;
      comment.brief = brief;
      return comment;
    }

    const param_match = line.match(param_expr);
    if (param_match) {
      if (!comment.params) {
        comment.params = {};
      }
      const [, , type, name, brief] = param_match;
      comment.params[name] = { brief, name, type };
      return comment;
    }

    const return_match = line.match(return_expr);
    if (return_match) {
      const [, , type, brief] = return_match;
      comment.return = { brief, type };
    }

    return comment;
  }, {});

  return comment;
};

var reading_comment = false;
var comment_ready = false;
var comment_lines = [];
var comment = null;

const extractToken = (tokens, line) => {
  if (utils.isSingleLineComment(line)) {
    comment_lines = [line];
    comment = extractComment(comment_lines);
    comment_ready = true;
    return tokens;
  }

  if (utils.isCommentEnd(line)) {
    comment = extractComment(comment_lines);
    comment_ready = true;
    reading_comment = false;
    return tokens;
  }

  if (reading_comment) {
    comment_lines.push(line);
    return tokens;
  }

  if (utils.isCommentStart(line)) {
    comment_lines = [];
    comment = null;
    comment_ready = false;
    reading_comment = true;

    return tokens;
  }

  var token =
    extractVariable(line) ||
    extractFunction(line) ||
    extractClass(line) ||
    extractClassMethod(line) ||
    extractBaseClass(line);

  if (token) {
    if (comment_ready) {
      token.comment = comment;
      comment_ready = false;
    }

    tokens.push(token);
  }

  return tokens;
};

exports = module.exports = extractToken;

exports.extractVariable = extractVariable;
exports.extractFunction = extractFunction;
exports.extractClass = extractClass;
exports.extractClassMethod = extractClassMethod;
exports.extractBaseClass = extractBaseClass;
exports.extractComment = extractComment;
