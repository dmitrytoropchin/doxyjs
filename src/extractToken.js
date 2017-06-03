const utils = require('./utils');

const extractVariable = line => {
  const variable_expr = /^var\s+(\w+)/;
  const variable_match = line.match(variable_expr);
  if (variable_match) {
    const [_, variable_name] = variable_match;
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
    const [_, function_name, function_args] = function_match;
    if (utils.isClassName(function_name)) {
      return {
        type: 'class_constructor',
        class: function_name,
        args: utils.argsArray(function_args),
      };
    }

    return {
      type: 'global_function',
      name: function_name,
      args: utils.argsArray(function_args),
    };
  }

  return null;
};

const extractBaseClass = line => {
  const base_class_expr = /^\s*(\w+)\.prototype\.constructor\s*\=\s*(\w+)/;
  const base_class_match = line.match(base_class_expr);

  if (base_class_match) {
    const [_, class_name, base_class_name] = base_class_match;
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
    const [_, class_name, method_name, method_args] = class_method_match;
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
  const oneliner_expr = /^\s*\/\/\!\s*type\:(\w+)\s*(.*)$/;
  const brief_expr = /^\s*\*\s*@brief\s*(.*)$/;
  const param_expr = /^\s*\*\s*@param\s*type\:(\w+)\s*(\w+)\s*(.*)$/;
  const return_expr = /^\s*\*\s*@return\s*type\:(\w+)\s*(.*)$/;

  return comment_array.reduce((comment, line) => {
    const oneliner_match = line.match(oneliner_expr);
    if (oneliner_match) {
      comment.brief = oneliner_match[2];
      comment.type = oneliner_match[1];
      return comment;
    }

    const brief_match = line.match(brief_expr);
    if (brief_match) {
      comment.brief = brief_match[1];
      return comment;
    }

    const param_match = line.match(param_expr);
    if (param_match) {
      if (!comment.params) {
        comment.params = {};
      }
      comment.params[param_match[2]] = {
        brief: param_match[3],
        name: param_match[2],
        type: param_match[1],
      };
      return comment;
    }

    const return_match = line.match(return_expr);
    if (return_match) {
      comment.return = { brief: return_match[2], type: return_match[1] };
    }

    return comment;
  }, {});
};

var reading_comment = false;
var comment_ready = false;
var comment = [];

const extractToken = (tokens, line) => {
  if (utils.isSingleLineComment(line)) {
    comment_ready = true;
    comment = [line];
    return tokens;
  }

  if (utils.isCommentEnd(line)) {
    reading_comment = false;
    comment_ready = true;
    return tokens;
  }

  if (reading_comment) {
    comment.push(line);
    return tokens;
  }

  if (utils.isCommentStart(line)) {
    reading_comment = true;
    comment_ready = false;
    comment = [];

    return tokens;
  }

  var token =
    extractVariable(line) ||
    extractFunction(line) ||
    extractClassMethod(line) ||
    extractBaseClass(line);

  if (token) {
    if (comment_ready) {
      token.comment = extractComment(comment);
      comment_ready = false;
    }

    tokens.push(token);
  }

  return tokens;
};

exports = module.exports = extractToken;

exports.extractVariable = extractVariable;
exports.extractFunction = extractFunction;
exports.extractClassMethod = extractClassMethod;
exports.extractBaseClass = extractBaseClass;
exports.extractComment = extractComment;
