const Posibly = require('../lib/index');

function getWord(pair) {
  return pair[0];
}

function getTag(pair) {
  return pair[1];
}

describe('To match a pattern,', function() {
  describe('Posibly', function() {
    it('should substitute one tag for another', function() {
      const posibly = new Posibly(['V']);

      // in this case, we are expecting a verb, but run was tagged out of context as "a run" (Noun).
      const tagged = [ [ 'run', 'N' ] ];
      const editPath = posibly.editPath(tagged);
      const retagged = editPath.retag();

      editPath.distance.should.equal(1); // insert a determiner

      getWord(retagged[0]).should.equal('run');
      getTag(retagged[0]).should.equal('V');
    });
  });
});
