const localize = require('localize');
const ts = require('../translations/translations.json');

const commentSeeds = require('./seeds/commentSeeds');
const variableSeeds = require('./seeds/variableSeeds');
const functionSeeds = require('./seeds/functionSeeds');
const classSeeds = require('./seeds/classSeeds');

const doxyjs = require('../doxyjs');

const translator = new localize(ts);
const linebreak = '\n';

describe('doxyjs', () => {
  const testSeeds = seed => {
    seed.input.forEach((input, index) => {
      expect(doxyjs(input, linebreak, translator)).toEqual(seed.output[index]);
    });
  };

  it('converts comments', () => {
    testSeeds(commentSeeds);
  });

  it('converts variables', () => {
    testSeeds(variableSeeds);
  });

  it('converts functions', () => {
    testSeeds(functionSeeds);
  });

  it('converts classes', () => {
    testSeeds(classSeeds);
  });
});
