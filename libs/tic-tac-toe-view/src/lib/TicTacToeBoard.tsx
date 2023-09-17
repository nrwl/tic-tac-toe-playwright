import { Board, BoardIndex } from 'tic-tac-toe-logic';

export interface TicTacToeBoardProps {
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
            <div key={`row-${row}-column-${column}`}>
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
