export class Set {
  number
  measure;
  counts;
  constructor(number, measure) {
    this.measure = measure;
    this.number = number;
    this.counts = 0;
  }

  static fromJSON({number, measure, counts}) {
    const newSet = new Set(number, measure);
    newSet.counts = counts;
    return newSet;
  }
}