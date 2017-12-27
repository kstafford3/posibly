const should = require('chai').should();
const pos = require('pos');
const Posibly = require('../lib/index');

const LEXER = new pos.Lexer();
const TAGGER = new pos.Tagger();

const NOUN = /^N.*$/;
const VERB = /^V.*$/;

const NOUNS_AND_VERBS = {
  keep: [
    [/^.*$/, 0],
  ],
  insert: [
    // make it hard to hallucinate nouns or verbs
    [NOUN, Infinity],
    [VERB, Infinity],
    [/^.*$/, 1],
  ],
  remove: [
    // make it hard to ignore nouns or verbs
    [NOUN, Infinity],
    [VERB, Infinity],
    [/^.*$/, 1],
  ],
  substitute: [
    // make it easy to change noun/verb tense/number/possessiveness etc.
    [VERB, [
      [VERB, 0],
    ]],
    [NOUN, [
      [NOUN, 0],
    ]],
    [/^.*$/, [
      [/^.*$/, 1],
    ]],
  ],
};

function getWord(pair) {
  return pair[0];
}

function getTag(pair) {
  return pair[1];
}

function tagSentence(sentence) {
  return TAGGER.tag(LEXER.lex(sentence));
}

describe('When using pos (https://www.npmjs.com/package/pos) to tag sentences;', function() {
  describe('To match a pattern', function() {
    describe('Posibly', function() {
      it('should substitute any number of tags', function() {
        const posibly = new Posibly(['V', 'DT', 'N'], NOUNS_AND_VERBS);

        const tagged = tagSentence('one two three');
        const editPath = posibly.editPath(tagged);
        const retagged = editPath.retag();

        editPath.distance.should.equal(2); // change one from noun to verb, change two from noun to determiner, three is already a noun

        getWord(retagged[0]).should.equal('one');
        getTag(retagged[0]).should.equal('V');

        getWord(retagged[1]).should.equal('two');
        getTag(retagged[1]).should.equal('DT');

        getWord(retagged[2]).should.equal('three');
        getTag(retagged[2]).should.equal('N');
      });

      it('should insert missing tags', function() {
        const posibly = new Posibly(['V', 'DT', 'N'], NOUNS_AND_VERBS);

        const tagged = tagSentence('eat food');
        const editPath = posibly.editPath(tagged);
        const retagged = editPath.retag();

        editPath.distance.should.equal(1); // insert a determiner

        getWord(retagged[0]).should.equal('eat');
        getTag(retagged[0]).should.equal('V');

        should.not.exist(getWord(retagged[1]));
        getTag(retagged[1]).should.equal('DT');

        getWord(retagged[2]).should.equal('food');
        getTag(retagged[2]).should.equal('N');
      });

      it('should substitute a single tag', function() {
        const posibly = new Posibly(['V'], NOUNS_AND_VERBS);

        const tagged = tagSentence('jump');
        const editPath = posibly.editPath(tagged);
        const retagged = editPath.retag();

        editPath.distance.should.equal(1); // replace jump(N) with jump(V)

        getWord(retagged[0]).should.equal('jump');
        getTag(retagged[0]).should.equal('V');
      });

      it('should remove appended tags', function() {
        const posibly = new Posibly(['V'], NOUNS_AND_VERBS);

        const tagged = tagSentence('run quickly');
        const editPath = posibly.editPath(tagged);
        const retagged = editPath.retag();

        editPath.distance.should.equal(1); // remove tag from quickly

        getWord(retagged[0]).should.equal('run');
        getTag(retagged[0]).should.equal('V');

        getWord(retagged[1]).should.equal('quickly');
        should.not.exist(getTag(retagged[1]));
      });

      it('should remove prepended tags', function() {
        const posibly = new Posibly(['V'], NOUNS_AND_VERBS);

        const tagged = tagSentence('quickly run');
        const editPath = posibly.editPath(tagged);
        const retagged = editPath.retag();

        editPath.distance.should.equal(1); // remove tag from quickly

        getWord(retagged[0]).should.equal('quickly');
        should.not.exist(getTag(retagged[0]));

        getWord(retagged[1]).should.equal('run');
        getTag(retagged[1]).should.equal('V');
      });

      it('should not be expected to reorder words', function() {
        const posibly = new Posibly(['V', 'N'], NOUNS_AND_VERBS);

        const tagged = tagSentence('dog run');
        const editPath = posibly.editPath(tagged);
        const retagged = editPath.retag();

        editPath.distance.should.equal(2); // remove tag from quickly

        getWord(retagged[0]).should.equal('dog');
        getTag(retagged[0]).should.equal('V');

        getWord(retagged[1]).should.equal('run');
        getTag(retagged[1]).should.equal('N');
      });
    });
  });
});
