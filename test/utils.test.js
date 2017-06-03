const utils = require('../src/utils');

describe('utils', () => {
  it('identifies class name', () => {
    expect(utils.isClassName('Class')).toBeTruthy();
    expect(utils.isClassName('class')).toBeFalsy();
  });

  it('identifies single line doxygen comment', () => {
    expect(utils.isSingleLineComment('//! doxygen comment')).toBeTruthy();
    expect(utils.isSingleLineComment('// regular comment')).toBeFalsy();
    expect(utils.isSingleLineComment('regular code')).toBeFalsy();
  });

  it('identifies multi line doxygen comment start', () => {
    expect(utils.isCommentStart('/*!')).toBeTruthy();
    expect(utils.isCommentStart('//')).toBeFalsy();
    expect(utils.isCommentStart('regular code')).toBeFalsy();
  });

  it('identifies multi line doxygen comment end', () => {
    expect(utils.isCommentEnd('*/')).toBeTruthy();
    expect(utils.isCommentEnd('//')).toBeFalsy();
    expect(utils.isCommentEnd('regular code')).toBeFalsy();
  });

  it('extracts function arguments', () => {
    const args_string = 'param1, param2,param3';

    expect(utils.argsArray('')).toEqual([]);
    expect(utils.argsArray(args_string)).toEqual([
      'param1',
      'param2',
      'param3',
    ]);
  });
});
