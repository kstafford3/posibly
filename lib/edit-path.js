
class EditPath {
  constructor(taggedSentence, grammar, costMatrix) {
    this.taggedSentence = taggedSentence;
    this.grammar = grammar;
    this.costMatrix = costMatrix;
    this.distance = this.costMatrix[taggedSentence.length][grammar.length];
  }

  _retag(i, j, retagged) {
    if (j === 0 && i === 0) {
      return retagged;
    } else if (i === 0) {
      const toTag = this.grammar[j - 1];
      return this._retag(i, j - 1, ([ [ null, toTag ] ]).concat(retagged));
    } else if (j === 0) {
      const fromWord = this.taggedSentence[i - 1][0];
      return this._retag(i - 1, j, ([ [ fromWord, null ] ]).concat(retagged));
    }

    const fromWord = this.taggedSentence[i - 1][0];
    // const fromTag = this.taggedSentence[i - 1][1];
    const toTag = this.grammar[j - 1];

    const removeCost = this.costMatrix[i - 1][j];
    const insertCost = this.costMatrix[i][j - 1];
    const substituteCost = this.costMatrix[i - 1][j - 1]; // could also be keep, the cost is already calculated.
    const min = Math.min(substituteCost, removeCost, insertCost);

    if (substituteCost === min) {
      return this._retag(i - 1, j - 1, ([ [ fromWord, toTag ] ]).concat(retagged));
    } else if (insertCost === min) {
      return this._retag(i, j - 1, ([ [ null, toTag ] ]).concat(retagged));
    } else if (removeCost === min) {
      return this._retag(i - 1, j, ([ [ fromWord, null ] ]).concat(retagged));
    } else {
      throw new Error(`No min value among [ ${substituteCost}, ${removeCost}, ${insertCost} ].`);
    }
  }

  retag() {
    return this._retag(this.taggedSentence.length, this.grammar.length, []);
  }
};

module.exports = EditPath;
