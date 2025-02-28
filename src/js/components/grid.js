export class Grid {
  columns;
  rows;

  constructor(rows = 4, columns = 3) {
    this.rows = rows;
    this.columns = columns * 2 + 1;
  }

  static fromJSON({rows, columns}) {
    const newGrid = new Grid(rows, 0);
    newGrid.columns = columns;
    return newGrid;
  }

  changeRows(newRows) {
    this.rows = newRows;
  }

  changeColumns(newColumns) {
    this.columns = newColumns * 2 + 1;
  }

  getBounds() {
    return {
      left: -(this.columns - 1) * 0.5 * 8,
      right: (this.columns - 1) * 0.5 * 8,
      top: (this.rows - 1) * 8,
      bottom: 0,
    }
  }
}