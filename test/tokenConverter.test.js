const tokenConverter = require('../src/tokenConverter');

describe('tokenConverter', () => {
  it('converts global variable', () => {
    const token = { name: 'x' };

    expect(tokenConverter.convertGlobalVariable(token)).toEqual({
      type: 'var',
      name: 'x',
      comment: null,
    });
  });

  it('converts documented global variable', () => {
    const token = {
      name: 'x',
      comment: {
        brief: 'Variable description',
        type: 'String',
      },
    };

    expect(tokenConverter.convertGlobalVariable(token)).toEqual({
      type: 'String',
      name: 'x',
      comment: {
        brief: 'Variable description',
        type: 'String',
      },
    });
  });

  it('converts function', () => {
    const token = { name: 'foo', args: ['bar', 'baz'] };

    expect(tokenConverter.convertGlobalFunction(token)).toEqual({
      type: 'void',
      name: 'foo',
      comment: null,
      args: [{ type: 'var', name: 'bar' }, { type: 'var', name: 'baz' }],
    });
  });

  it('converts documented function', () => {
    const token = {
      name: 'foo',
      args: ['bar', 'baz'],
      comment: {
        brief: 'Function description',
        params: {
          bar: { brief: 'bar description', type: 'Object' },
          baz: { brief: 'baz description', type: 'Date' },
        },
        return: {
          brief: 'Return description',
          type: 'String',
        },
      },
    };

    expect(tokenConverter.convertGlobalFunction(token)).toEqual({
      type: 'String',
      name: 'foo',
      comment: {
        brief: 'Function description',
        params: {
          bar: { brief: 'bar description', type: 'Object' },
          baz: { brief: 'baz description', type: 'Date' },
        },
        return: {
          brief: 'Return description',
          type: 'String',
        },
      },
      args: [{ type: 'Object', name: 'bar' }, { type: 'Date', name: 'baz' }],
    });
  });

  it('converts class', () => {
    const token = {
      name: 'Foo',
      constructor: { args: ['class_bar'] },
      base_class: 'Bar',
      methods: [{ name: 'foo', args: ['bar'] }],
    };

    expect(tokenConverter.convertClass(token)).toEqual({
      name: 'Foo',
      base_class: 'Bar',
      constructor: {
        type: 'void',
        name: '',
        comment: null,
        args: [{ type: 'var', name: 'class_bar' }],
      },
      methods: [
        {
          type: 'void',
          name: 'foo',
          args: [{ type: 'var', name: 'bar' }],
          comment: null,
        },
      ],
      comment: null,
    });
  });

  it('converts documented class', () => {
    const token = {
      name: 'Foo',
      constructor: {
        args: ['class_bar'],
        comment: {
          brief: 'Class description',
          params: { class_bar: { brief: 'param description', type: 'String' } },
        },
      },
      base_class: 'Bar',
      methods: [
        {
          name: 'foo',
          args: ['bar'],
          comment: {
            brief: 'Method description',
            params: { bar: { brief: 'param description', type: 'Date' } },
            return: { brief: 'return description', type: 'Object' },
          },
        },
      ],
    };

    expect(tokenConverter.convertClass(token)).toEqual({
      name: 'Foo',
      base_class: 'Bar',
      constructor: {
        type: 'void',
        name: '',
        args: [{ type: 'String', name: 'class_bar' }],
        comment: {
          brief: 'Class description',
          params: { class_bar: { brief: 'param description', type: 'String' } },
        },
      },
      methods: [
        {
          type: 'Object',
          name: 'foo',
          args: [{ type: 'Date', name: 'bar' }],
          comment: {
            brief: 'Method description',
            params: { bar: { brief: 'param description', type: 'Date' } },
            return: { brief: 'return description', type: 'Object' },
          },
        },
      ],
      comment: {
        brief: 'Class description',
        params: { class_bar: { brief: 'param description', type: 'String' } },
      },
    });
  });
});
