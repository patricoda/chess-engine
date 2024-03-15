import Board from "./board/board.js";
import {
  getCheckingPieces,
  getLegalMoves,
  isPromotable,
  movePiece,
  promotePiece,
  setPieces,
} from "../engine.js";
import { Allegiance, GameStatus, PieceType } from "../enums/enums.js";
export default class Game {
  status = GameStatus.NOT_STARTED;
  playerTurn = Allegiance.WHITE;
  legalMoves = {};
  board = [];
  moveHistory = [];
  promotionState = { isAwaitingPromotionSelection: false, coords: "" };
  winningPlayer = null;
  //TODO: don't like these as game state fields
  checkingPieces = [];

  constructor() {
    this.board = new Board();
  }

  init() {
    //TODO: pass FEN string to determine initial state
    setPieces(this.board);
    this.legalMoves = getLegalMoves({
      board: this.board,
      allegiance: this.playerTurn,
      checkingPieces: this.checkingPieces,
      moveHistory: this.moveHistory,
    });
    this.status = GameStatus.IN_PROGRESS;
  }

  move(move) {
    const { from, to } = move;

    if (this.legalMoves[from]?.some((legalMove) => legalMove === to)) {
      this.#processMove(move);

      //if piece is promotable, delay next turn until promotion has been actioned
      if (!this.promotionState.isAwaitingPromotionSelection) {
        this.#startNextTurn();
      }
    } else {
      throw new Error("Move is not legal");
    }
  }

  #processMove({ from, to }) {
    if (isPromotable(this.board, from, to)) {
      this.promotionState.isAwaitingPromotionSelection = true;
      this.promotionState.coords = to;
    }

    movePiece(this.board, from, to);

    this.moveHistory.push({
      from,
      to,
    });
  }

  promote(newType) {
    if (
      this.promotionState.isAwaitingPromotionSelection &&
      PieceType[newType]
    ) {
      this.#processPromotion(newType);
      this.#startNextTurn();
    } else {
      throw new Error("Promotion selection is not valid");
    }
  }

  #processPromotion(newType) {
    promotePiece(this.board, this.promotionState.coords, newType);
    this.promotionState.isAwaitingPromotionSelection = false;
    this.promotionState.coords = null;
  }

  #startNextTurn() {
    this.#togglePlayerTurn();

    this.checkingPieces = getCheckingPieces(this.board, this.playerTurn);

    this.legalMoves = getLegalMoves({
      board: this.board,
      allegiance: this.playerTurn,
      checkingPieces: this.checkingPieces,
      moveHistory: this.moveHistory,
    });

    //check for checkmate / stalemate
    this.#checkGameCondition();
  }

  forfeit(allegiance) {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game cannot be forfeit as it is not in progress");
    } else {
      const winner =
        allegiance === Allegiance.WHITE ? Allegiance.BLACK : Allegiance.WHITE;

      this.#endGame(GameStatus.FORFEIT, winner);
    }
  }

  #togglePlayerTurn() {
    this.playerTurn =
      this.playerTurn === Allegiance.WHITE
        ? Allegiance.BLACK
        : Allegiance.WHITE;
  }

  #checkGameCondition() {
    if (!Object.keys(this.legalMoves).length) {
      if (this.checkingPieces.length) {
        const winner =
          this.playerTurn === Allegiance.WHITE
            ? Allegiance.BLACK
            : Allegiance.WHITE;

        this.#endGame(GameStatus.CHECKMATE, winner);
      } else {
        this.#endGame(GameStatus.STALEMATE);
      }
    }
  }

  #endGame(status, winningPlayer) {
    this.status = status;
    this.winningPlayer = winningPlayer;
    this.legalMoves = {};

    if (status === GameStatus.CHECKMATE) {
      console.log(
        `${this.id} has ended in checkmate. Winner: ${winningPlayer.allegiance}`
      );
    } else if (status === GameStatus.STALEMATE) {
      console.log(`${this.id} has ended in stalemate.`);
    } else {
      console.log(
        `${this.id} has ended with a forfeit. Winner: ${winningPlayer.allegiance}`
      );
    }
  }

  //construct game state object intended to be sent to clients on each turn
  getGameState() {
    const {
      id,
      status,
      playerTurn,
      legalMoves,
      board,
      moveHistory,
      promotionState,
      winningPlayer,
    } = this;

    return {
      id,
      status,
      playerTurn,
      legalMoves,
      //TODO send board as FEN string
      boardState: JSON.stringify(board),
      moveHistory,
      isAwaitingPromotionSelection: promotionState.isAwaitingPromotionSelection,
      winningPlayer,
    };
  }
}
