# Patricoda chess-engine

Node module to create chess game sessions.

Uses [Patricoda chess-engine](https://www.npmjs.com/package/@patricoda/chess-engine) for game logic, and [Socket.io](https://socket.io/) for connection management.

Developed to be used in conjunction with the [Patricoda chess-client](https://github.com/patricoda/chess-client).    

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

//get current game state
game.getGameState();

//promote
game.promote('QUEEN');

//forfeit
game.forfeit();
```
