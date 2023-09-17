import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { SpaceCoordinates, TicTacToeState, nextState } from 'tic-tac-toe-logic';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

export function startServer() {
  const app = express();
  const server = http.createServer(app);
  app.use(cors());

  const socketIo = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const connections: Record<string, Socket | undefined> = {};

  let state: TicTacToeState = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    turn: `x's turn`,
  };

  socketIo.on('connection', (socket) => {
    console.log('connected');
    if (!connections['player-one']) {
      connections['player-one'] = socket;
      socket.emit('init', { player: 'x', state });
      socket.on('click', (coordinates: SpaceCoordinates) => {
        if (validateTurn(state, 'x')) {
          state = nextState(state, coordinates);
          socketIo.emit('state', state);
        }
      });
    } else if (!connections['player-two']) {
      connections['player-two'] = socket;
      socket.emit('init', { player: 'o', state });
      console.log('sent init to player two');
      socket.on('click', (coordinates: SpaceCoordinates) => {
        if (validateTurn(state, 'o')) {
          state = nextState(state, coordinates);
          socketIo.emit('state', state);
        }
      });
    }
  });

  server.listen(port, () => {
    console.log(`socket listening on ${host}:${port}`);
  });

  return { server, app };
}

function validateTurn(state: TicTacToeState, player: 'x' | 'o'): boolean {
  if (state.turn === `${player}'s turn`) {
    return true;
  }
  return false;
}
