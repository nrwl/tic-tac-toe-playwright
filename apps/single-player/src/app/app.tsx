// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import {
  Board,
  BoardIndex,
  TicTacToeState,
  createEmptyBoard,
  nextState,
} from 'tic-tac-toe-logic';

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

interface TicTacToeBoardProps {
  board: Board;
  onSquareClick: (row: BoardIndex, column: BoardIndex) => void;
}

export function TicTacToeBoard({ board, onSquareClick }: TicTacToeBoardProps) {
  return (
    <div className="border">
      <div className="board">
        {([0, 1, 2] as const)
          .map((row) => ([0, 1, 2] as const).map((column) => [row, column]))
          .flat()
          .map(([row, column]) => (
            <div>
              <button
                onClick={() => onSquareClick(row, column)}
                data-e2e={`space-button-${row}-${column}`}
              >
                {board[row][column].toUpperCase()}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
