const extractToken = require('../src/extractToken');

describe('extractToken', () => {
  const variable_line = 'var x = {};';
  const function_line = 'function foo() {}';
  const class_constructor_line = 'function Class(args) {}';
  const class_method_line = 'Class.prototype.foo = function(arg) {}';
  const base_class_line = 'Class.prototype.constructor = BaseClass';

  it('extracts global variable', () => {
    expect(extractToken.extractVariable(variable_line)).toEqual({
      type: 'global_variable',
      name: 'x',
    });

    expect(extractToken.extractVariable(function_line)).toBeNull();
    expect(extractToken.extractVariable(class_constructor_line)).toBeNull();
    expect(extractToken.extractVariable(class_method_line)).toBeNull();
    expect(extractToken.extractVariable(base_class_line)).toBeNull();
  });

  it('extracts global function', () => {
    expect(extractToken.extractFunction(function_line)).toEqual({
      type: 'global_function',
      name: 'foo',
      args: [],
    });

    expect(extractToken.extractFunction(class_constructor_line)).toEqual({
      type: 'class_constructor',
      class: 'Class',
      args: ['args'],
    });

    expect(extractToken.extractFunction(variable_line)).toBeNull();
    expect(extractToken.extractFunction(class_method_line)).toBeNull();
    expect(extractToken.extractFunction(base_class_line)).toBeNull();
  });

  it('extracts class method', () => {
    expect(extractToken.extractClassMethod(class_method_line)).toEqual({
      type: 'class_method',
      class: 'Class',
      name: 'foo',
      args: ['arg'],
    });

    expect(extractToken.extractClassMethod(variable_line)).toBeNull();
    expect(extractToken.extractClassMethod(function_line)).toBeNull();
    expect(extractToken.extractClassMethod(class_constructor_line)).toBeNull();
    expect(extractToken.extractClassMethod(base_class_line)).toBeNull();
  });

  it('extracts base class', () => {
    expect(extractToken.extractBaseClass(base_class_line)).toEqual({
      type: 'base_class',
      class: 'Class',
      base_class: 'BaseClass',
    });

    expect(extractToken.extractBaseClass(variable_line)).toBeNull();
    expect(extractToken.extractBaseClass(function_line)).toBeNull();
    expect(extractToken.extractBaseClass(class_constructor_line)).toBeNull();
    expect(extractToken.extractBaseClass(class_method_line)).toBeNull();
  });

  it('extracts doxygen comment', () => {
    const singleline_comment = ['//! type:String string variable'];

    expect(extractToken.extractComment(singleline_comment)).toEqual({
      brief: 'string variable',
      type: 'String',
    });

    const multiline_comment = [
      '/*!',
      ' * @brief Brief description',
      ' * @param type:String param1 first parameter',
      ' * @param type:Date param2 second parameter',
      ' * @return type:Object return value',
      ' */',
    ];

    expect(extractToken.extractComment(multiline_comment)).toEqual({
      brief: 'Brief description',
      params: {
        param1: {
          brief: 'first parameter',
          type: 'String',
          name: 'param1',
        },
        param2: {
          brief: 'second parameter',
          type: 'Date',
          name: 'param2',
        },
      },
      return: {
        brief: 'return value',
        type: 'Object',
      },
    });
  });

  it('extracts tokens', () => {
    const variable_lines = ['//! type:String Variable description', 'var x;'];

    expect(variable_lines.reduce(extractToken, [])).toEqual([
      {
        type: 'global_variable',
        name: 'x',
        comment: { brief: 'Variable description', type: 'String' },
      },
    ]);

    const function_lines = [
      '/*!',
      ' * @brief Brief description',
      ' * @param type:Object arg argument description',
      ' * @return type:String return description',
      ' */',
      'function foo(arg)',
    ];

    expect(function_lines.reduce(extractToken, [])).toEqual([
      {
        type: 'global_function',
        name: 'foo',
        args: ['arg'],
        comment: {
          brief: 'Brief description',
          params: {
            arg: {
              brief: 'argument description',
              type: 'Object',
              name: 'arg',
            },
          },
          return: {
            brief: 'return description',
            type: 'String',
          },
        },
      },
    ]);

    const class_method_lines = [
      '/*!',
      ' * @brief Brief description',
      ' * @param type:Date date param description',
      ' */',
      'Class.prototype.foo = function(date)',
    ];

    expect(class_method_lines.reduce(extractToken, [])).toEqual([
      {
        type: 'class_method',
        class: 'Class',
        name: 'foo',
        args: ['date'],
        comment: {
          brief: 'Brief description',
          params: {
            date: {
              brief: 'param description',
              type: 'Date',
              name: 'date',
            },
          },
        },
      },
    ]);
  });
});
