import Tile from "./tile.js";
import {
  COLUMN_VALUES,
  ROW_VALUES,
  boardDimensions,
} from "../../utils/config.js";

export default class Board {
  tiles = [];

  constructor() {
    this.generateTiles();
  }

  generateTiles() {
    this.tiles = [...Array(boardDimensions.rows)].map((row, r) =>
      [...Array(boardDimensions.columns)].map((col, c) => new Tile(r, c))
    );
  }

  getTile(row, col) {
    return this.tiles[row][col];
  }

  getTileByCoords(coords) {
    const [col, row] = coords.split("");

    return this.getTile(
      ROW_VALUES.length - 1 - ROW_VALUES.indexOf(row),
      COLUMN_VALUES.indexOf(col)
    );
  }

  getBoardRepresentation() {
    return this.tiles;
  }
}
