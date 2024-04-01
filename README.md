# Patricoda chess-engine

Node module to create chess game sessions for two human players.

Developed to be used in conjunction with the [Patricoda chess-client](https://github.com/patricoda/chess-client) and [Patricoda chess-server](https://github.com/patricoda/chess-server).    

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install:

```bash
npm install @patricoda/chess-engine
```

## Usage

```js
import { Game } from "@patricoda/chess-engine";

//create new game instance
const game = new Game();

//start new game
game.init();

//make a move
game.move({from: 'a1', to:'b1');

//get current game state, including game status, board state, legal moves, and player turn
game.getGameState();

//promote
game.promote('QUEEN');

//forfeit
game.forfeit();
```
