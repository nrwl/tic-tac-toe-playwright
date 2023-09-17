import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { TicTacToeState, Turn } from 'tic-tac-toe-logic';
import { TicTacToeBoard } from 'tic-tac-toe-view';

const socket = io('ws://localhost:3333');
socket.connect();

export function App() {
  const [player, setPlayer] = useState<'x' | 'o' | undefined>();
  const [state, setState] = useState<TicTacToeState | undefined>();
  useEffect(() => {
    socket.on(
      'init',
      ({ player, state }: { player: 'x' | 'o'; state: TicTacToeState }) => {
        console.log('init received');
        setPlayer(player);
        setState(state);
      }
    );
    socket.on('state', (state: TicTacToeState) => {
      console.log('state received');
      setState(state);
    });
    console.log('callbacks set');
  }, []);
  return (
    <>
      <h1>Tic Tac Toe</h1>
      <h2 data-e2e={'turn-label'}>
        {player && state ? turnText(player, state.turn) : ''}
      </h2>
      {state ? (
        <TicTacToeBoard
          board={state.board}
          onSquareClick={(row, column) => {
            socket.emit('click', { row, column });
          }}
        />
      ) : null}
    </>
  );
}

function turnText(
  player: 'x' | 'o',
  turn: Turn
):
  | 'Your turn'
  | 'Waiting on opponent...'
  | 'You win!'
  | 'You lose!'
  | 'Tie game' {
  switch (turn) {
    case `o's turn`: {
      return player === 'o' ? 'Your turn' : 'Waiting on opponent...';
    }
    case `x's turn`: {
      return player === 'x' ? 'Your turn' : 'Waiting on opponent...';
    }
    case 'game over - o wins': {
      return player === 'o' ? 'You win!' : 'You lose!';
    }
    case 'game over - x wins': {
      return player === 'x' ? 'You win!' : 'You lose!';
    }
    case `game over - it's a tie`: {
      return 'Tie game';
    }
  }
}

export default App;
