const should = require('chai').should();
const Posibly = require('../lib/index');

function getWord(pair) {
  return pair[0];
}

function getTag(pair) {
  return pair[1];
}

describe('To match a pattern,', function() {
  describe('Posibly', function() {
    it('should remove extra tags', function() {
      const posibly = new Posibly(['V', 'N']);

      const tagged = [ [ 'eat', 'V' ], [ 'the', 'DT' ], [ 'food', 'N' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(1); // remove the determiner

      getWord(retagged[0]).should.equal('eat');
      getTag(retagged[0]).should.equal('V');

      getWord(retagged[1]).should.equal('the');
      should.not.exist(getTag(retagged[1]));

      getWord(retagged[2]).should.equal('food');
      getTag(retagged[2]).should.equal('N');
    });

    it('should truncate tags off the end of a tagged sentence', function() {
      const posibly = new Posibly(['V', 'N']);

      const tagged = [ [ 'eat', 'V' ], [ 'food', 'N' ], [ 'now', 'RB' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(1); // insert a determiner

      getWord(retagged[0]).should.equal('eat');
      getTag(retagged[0]).should.equal('V');

      getWord(retagged[1]).should.equal('food');
      getTag(retagged[1]).should.equal('N');

      getWord(retagged[2]).should.equal('now');
      should.not.exist(getTag(retagged[2]));
    });

    it('should trim tags from the start of a tagged sentence', function() {
      const posibly = new Posibly(['V', 'N']);

      const tagged = [ [ 'we', 'N' ], [ 'eat', 'V' ], [ 'food', 'N' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(1); // insert a determiner

      getWord(retagged[0]).should.equal('we');
      should.not.exist(getTag(retagged[0]));

      getWord(retagged[1]).should.equal('eat');
      getTag(retagged[1]).should.equal('V');

      getWord(retagged[2]).should.equal('food');
      getTag(retagged[2]).should.equal('N');
    });
  });
});
