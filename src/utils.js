exports.isClassName = function_name => function_name.match(/^[A-Z]\w*$/)

exports.isSingleLineComment = line => line.match(/^\s*\/\/\!\s+.*$/);
exports.isCommentStart = line => line.match(/^\s*\/\*\!\s*$/);
exports.isCommentEnd = line => line.match(/^\s*\*\/\s*$/);

exports.argsArray = args =>
  args.split(',').map(arg => arg.trim()).filter(arg => arg.length);
