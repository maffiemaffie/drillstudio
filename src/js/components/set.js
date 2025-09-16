export class Set {
  number
  measure;
  counts;
  constructor(number, measure, tempo = 120) {
    this.measure = measure;
    this.number = number;
    this.tempo = tempo;
    this.counts = 0;
  }

  static fromJSON({number, measure, counts, tempo}) {
    const newSet = new Set(number, measure, tempo);
    newSet.counts = counts;
    return newSet;
  }
}