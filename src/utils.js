exports.isClassName = function_name =>
  function_name.charAt(0) === function_name.charAt(0).toUpperCase();

exports.isSingleLineComment = line => line.match(/^\s*\/\/\!\s+.*$/);
exports.isCommentStart = line => line.match(/^\s*\/\*\!\s*$/);
exports.isCommentEnd = line => line.match(/^\s*\*\/\s*$/);

exports.argsArray = args =>
  args.split(',').map(arg => arg.trim()).filter(arg => arg.length);
