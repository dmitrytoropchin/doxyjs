const reduceToken = require('../src/reduceToken');

describe('reduceToken', () => {
  it('', () => {
    const variable_token = {
      type: 'global_variable',
      name: 'x',
    };

    const function_token = {
      type: 'global_function',
      name: 'foo',
      args: ['bar', 'baz'],
    };

    const class_constructor_token = {
      type: 'class_constructor',
      class: 'Foo',
      args: ['class_bar'],
    };

    const base_class_token = {
      type: 'base_class',
      class: 'Foo',
      base_class: 'Bar',
    };

    const class_method_token = {
      type: 'class_method',
      class: 'Foo',
      name: 'foo',
      args: ['bar'],
    };

    let out = {
      global_variables: [],
      global_functions: [],
      classes: {},
    };

    const tokens = [
      variable_token,
      function_token,
      class_constructor_token,
      base_class_token,
      class_method_token,
    ];

    expect(tokens.reduce(reduceToken, out)).toEqual({
      global_variables: [{ name: 'x' }],
      global_functions: [{ name: 'foo', args: ['bar', 'baz'] }],
      classes: {
        Foo: {
          name: 'Foo',
          constructor: { args: ['class_bar'] },
          base_class: 'Bar',
          methods: [{ name: 'foo', args: ['bar'] }],
        },
      },
    });
  });
});
