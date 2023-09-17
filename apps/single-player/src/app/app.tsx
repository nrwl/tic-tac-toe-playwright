// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { TicTacToeState, createEmptyBoard, nextState } from 'tic-tac-toe-logic';
import { TicTacToeBoard } from 'tic-tac-toe-view';

export function App() {
  const [state, setState] = useState<TicTacToeState>({
    board: createEmptyBoard(),
    turn: `x's turn`,
  });
  return (
    <>
      <h1>Tic Tac Toe</h1>
      <h2 data-e2e={'turn-label'}>{state.turn}</h2>
      <TicTacToeBoard
        board={state.board}
        onSquareClick={(row, column) => {
          const next = nextState(state, { row, column });
          setState(next);
        }}
      />
      <button
        onClick={() =>
          setState({
            board: createEmptyBoard(),
            turn: `x's turn`,
          })
        }
      >
        Reset Game
      </button>
    </>
  );
}
