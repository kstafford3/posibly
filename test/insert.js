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
    it('should insert tags', function() {
      const posibly = new Posibly(['V', 'DT', 'N']);

      const tagged = [ [ 'eat', 'V' ], [ 'food', 'N' ] ];
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

    it('should append tags', function() {
      const posibly = new Posibly(['V', 'N', 'N']);

      const tagged = [ [ 'eat', 'V' ], [ 'food', 'N' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(1); // append unspecified noun

      getWord(retagged[0]).should.equal('eat');
      getTag(retagged[0]).should.equal('V');

      getWord(retagged[1]).should.equal('food');
      getTag(retagged[1]).should.equal('N');

      should.not.exist(getWord(retagged[2]));
      getTag(retagged[2]).should.equal('N');
    });

    it('should prepend tags', function() {
      const posibly = new Posibly(['N', 'V', 'N']);

      const tagged = [ [ 'eat', 'V' ], [ 'food', 'N' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(1); // prepend unspecified noun

      should.not.exist(getWord(retagged[0]));
      getTag(retagged[0]).should.equal('N');

      getWord(retagged[1]).should.equal('eat');
      getTag(retagged[1]).should.equal('V');

      getWord(retagged[2]).should.equal('food');
      getTag(retagged[2]).should.equal('N');
    });
  });
});
