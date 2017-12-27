const Posibly = require('../lib/index');

function getWord(pair) {
  return pair[0];
}

function getTag(pair) {
  return pair[1];
}

describe('To match a pattern,', function() {
  describe('Posibly', function() {
    it('should keep appropriate tags throughout a sentence', function() {
      const posibly = new Posibly(['V', 'N']);

      const tagged = [ [ 'eat', 'V' ], [ 'food', 'N' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(0); // insert a determiner

      getWord(retagged[0]).should.equal('eat');
      getTag(retagged[0]).should.equal('V');

      getWord(retagged[1]).should.equal('food');
      getTag(retagged[1]).should.equal('N');
    });
  });
});
