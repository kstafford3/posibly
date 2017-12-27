const { CustomEditDistance } = require('custom-edit-distance');
const EditPath = require('./edit-path');

const DEFAULT_COSTS = {
  keep: [
    [/^.*$/, 0],
  ],
  insert: [
    [/^.*$/, 1],
  ],
  remove: [
    [/^.*$/, 1],
  ],
  substitute: [
    [/^.*$/, [
      [/^.*$/, 1],
    ]],
  ],
};

class Posibly {
  constructor(grammar, costs) {
    if (!Array.isArray(grammar)) {
      throw new TypeError('Expected Array for grammar');
    }
    this._grammar = grammar;
    this._costs = Object.assign({}, DEFAULT_COSTS, costs);
  }

  equivalence(from, to) {
    return to === from;
  }

  editPath(taggedSentence) {
    const tags = taggedSentence.map((entry) => entry[1]);
    const costMethods = {
      getKeepCost: this.getKeepCost.bind(this),
      getInsertCost: this.getInsertCost.bind(this),
      getRemoveCost: this.getRemoveCost.bind(this),
      getSubstituteCost: this.getSubstituteCost.bind(this),
    };
    const distanceCalculator = new CustomEditDistance(costMethods, this.equivalence.bind(this));
    const costs = distanceCalculator.editCosts(tags, this._grammar);
    return new EditPath(taggedSentence, this._grammar, costs);
  }

  getKeepCost(keptValue) {
    const costEntry = this._costs.keep.find((entry) => entry[0].test(keptValue));
    return costEntry[1];
  }

  getInsertCost(insertedValue) {
    const costEntry = this._costs.insert.find((entry) => entry[0].test(insertedValue));
    return costEntry[1];
  }

  getRemoveCost(removedValue) {
    const costEntry = this._costs.remove.find((entry) => entry[0].test(removedValue));
    return costEntry[1];
  }

  getSubstituteCost(fromValue, toValue) {
    const costEntry = this._costs.substitute
      .filter((entry) => entry[0].test(fromValue))
      .reduce((a, b) => a.concat(b[1]), []) // flatten
      .find((entry) => entry[0].test(toValue));
    return costEntry[1];
  }
}

module.exports = Posibly;
