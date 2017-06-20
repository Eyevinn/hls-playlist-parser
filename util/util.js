const TextDiff = require("text-diff");

function getStringDifference(a, b){
  const comparator = new TextDiff();
  return comparator.main(a, b);
}

module.exports.getStringDifference = getStringDifference;
