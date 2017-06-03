const reduceToken = (structure, token) => {
  const prefillClass = (struct, _class) => {
    if (!(_class in struct.classes)) {
      struct.classes[_class] = {
        name: _class,
        constructor: null,
        methods: [],
      };
    }
  };

  switch (token.type) {
    case 'global_variable':
      structure.global_variables.push({
        name: token.name,
        comment: token.comment,
      });
      break;
    case 'global_function':
      structure.global_functions.push({
        name: token.name,
        args: token.args,
        comment: token.comment,
      });
      break;
    case 'base_class':
      prefillClass(structure, token.class);

      structure.classes[token.class].base_class = token.base_class;
      break;
    case 'class_constructor':
      prefillClass(structure, token.class);

      structure.classes[token.class].constructor = {
        args: token.args,
        comment: token.comment,
      };
      break;
    case 'class_method':
      prefillClass(structure, token.class);

      structure.classes[token.class].methods.push({
        name: token.name,
        args: token.args,
        comment: token.comment,
      });
      break;
  }

  return structure;
};

module.exports = reduceToken;
