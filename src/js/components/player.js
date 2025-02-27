export class Player {
  dots = [];
  label;
  constructor(label, sets, startingDot) {
    this.label = label;
    for (let i = 0; i < sets; i++) {
      this.dots.push(startingDot);
    }
  }

  static fromJSON({dots, label}) {
    const newPlayer = new Player(label, []);
    newPlayer.dots = dots;
    return newPlayer;
  }

  changeSet(set, {x, y}) {
    this.dots[set] = {x, y};
  }

  addSet(x, y) {
    this.dots.push({x, y});
  }

  getLeftToRight(set) {
    if (this.dots[set].x === 0) {
      return "On 50";
    }

    const side = this.dots[set].x < 0 ? "Side 1" : "Side 2";
    if (this.dots[set].x % 8 === 0) {
      return `On ${50 - Math.abs(this.dots[set].x) * 0.625} ${side}`;
    }

    if (Math.abs(this.dots[set].x) % 8 <= 4) {
      const closestLine = 50 - Math.floor(Math.abs(this.dots[set].x) * 0.125) * 5;
      return `${Math.abs(this.dots[set].x) % 8} outside ${closestLine} ${side}`;
    }

    const closestLine = 50 - Math.floor(Math.abs(this.dots[set].x) * 0.125) * 5 - 5;
    return `${8 - (Math.abs(this.dots[set].x) % 8)} inside ${closestLine} ${side}`;
  };

  getFrontToBack(set) {
    if (this.dots[set].y % 8 === 0) {
      return `On ${String.fromCharCode(
        "A".charCodeAt(0) + Math.floor(Math.abs(this.dots[set].y) * 0.125)
      )}`;
    }
    if (Math.abs(this.dots[set].y) % 8 <= 4) {
      const closestLine = String.fromCharCode(
        "A".charCodeAt(0) + Math.floor(Math.abs(this.dots[set].y) * 0.125)
      );
      return `${Math.abs(this.dots[set].y) % 8} behind ${closestLine}`;
    }

    const closestLine = String.fromCharCode(
      "A".charCodeAt(0) + Math.floor(Math.abs(this.dots[set].y) * 0.125 + 1)
    );
    return `${8 - (Math.abs(this.dots[set].y) % 8)} in front of ${closestLine}`;
  };
}