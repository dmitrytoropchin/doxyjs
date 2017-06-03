const tokenExporter = require('../src/tokenExporter');

describe('tokenExporter', () => {
  const linebreak = '\n';

  it('exports variable', () => {
    const description = {
      type: 'String',
      name: 'x',
      comment: {
        brief: 'Variable description',
        type: 'String',
      },
    };

    expect(tokenExporter.exportGlobalVariable(description, linebreak)).toEqual(
      `//! Variable description${linebreak}String x;${linebreak}`
    );
  });

  it('exports function', () => {
    const description = {
      type: 'String',
      name: 'foo',
      comment: {
        brief: 'Function description',
        params: {
          bar: { brief: 'bar description', type: 'Object', name: 'bar' },
          baz: { brief: 'baz description', type: 'Date', name: 'baz' },
        },
        return: {
          brief: 'Return description',
          type: 'String',
        },
      },
      args: [{ type: 'Object', name: 'bar' }, { type: 'Date', name: 'baz' }],
    };

    expect(tokenExporter.exportGlobalFunction(description, linebreak)).toEqual(
      `/*!
 * @brief Function description
 * @param bar bar description
 * @param baz baz description
 * @return Return description
 */
String foo(Object bar, Date baz);
`
    );
  });

  it('exports class', () => {
    const description = {
      name: 'Foo',
      base_class: 'Bar',
      constructor: {
        type: 'void',
        name: '',
        args: [{ type: 'String', name: 'class_bar' }],
        comment: {
          brief: 'Class description',
          params: {
            class_bar: {
              brief: 'param description',
              type: 'String',
              name: 'class_bar',
            },
          },
        },
      },
      methods: [
        {
          type: 'Object',
          name: 'foo',
          args: [{ type: 'Date', name: 'bar' }],
          comment: {
            brief: 'Method description',
            params: {
              bar: { brief: 'param description', type: 'Date', name: 'bar' },
            },
            return: { brief: 'return description', type: 'Object' },
          },
        },
      ],
      comment: {
        brief: 'Class description',
        params: {
          class_bar: {
            brief: 'param description',
            type: 'String',
            name: 'class_bar',
          },
        },
      },
    };

    expect(tokenExporter.exportClass(description, linebreak)).toEqual(
      `//! Class description
class Foo: public Bar {
public:
/*!
 * @brief Constructor
 * @param class_bar param description
 */
Foo(String class_bar);
/*!
 * @brief Method description
 * @param bar param description
 * @return return description
 */
Object foo(Date bar);
};
`
    );
  });
});
