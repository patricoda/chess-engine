import { boardDimensions } from "../../utils/config.js";

const COLUMN_VALUES = "abcdefgh";

export default class Tile {
  row;
  col;
  notation;
  piece = null;

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.notation = `${
      COLUMN_VALUES[this.col] + (boardDimensions.rows - this.row)
    }`;
  }
}
