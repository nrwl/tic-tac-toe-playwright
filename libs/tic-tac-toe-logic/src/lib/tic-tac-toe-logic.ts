export interface TicTacToeState {
  board: Board;
  turn: Turn;
}

export type Turn =
  | `x's turn`
  | `o's turn`
  | 'game over - x wins'
  | 'game over - o wins'
  | `game over - it's a tie`;

export type SpaceContent = 'x' | 'o' | '';

export type Board = [
  [SpaceContent, SpaceContent, SpaceContent],
  [SpaceContent, SpaceContent, SpaceContent],
  [SpaceContent, SpaceContent, SpaceContent]
];

export type BoardIndex = 0 | 1 | 2;

export interface SpaceCoordinates {
  row: BoardIndex;
  column: BoardIndex;
}

export function getWinner(board: Board): 'x' | 'o' | false {
  for (const [x, y, z] of winningCombinations) {
    if (
      board[x.row][x.column] === board[y.row][y.column] &&
      board[y.row][y.column] === board[z.row][z.column]
    ) {
      if (board[x.row][x.column] === 'x') {
        return 'x';
      } else if (board[x.row][x.column] === 'o') {
        return 'o';
      }
    }
  }
  return false;
}

export function createEmptyBoard(): Board {
  return [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
}

const winningCombinations: [
  SpaceCoordinates,
  SpaceCoordinates,
  SpaceCoordinates
][] = [
  [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
  ],
  [
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
  ],
  [
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 2, column: 0 },
  ],
  [
    { row: 0, column: 1 },
    { row: 1, column: 1 },
    { row: 2, column: 1 },
  ],
  [
    { row: 0, column: 2 },
    { row: 1, column: 2 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 2 },
    { row: 1, column: 1 },
    { row: 2, column: 0 },
  ],
];

export function nextState(
  state: TicTacToeState,
  { row, column }: SpaceCoordinates
): TicTacToeState {
  switch (state.turn) {
    case `x's turn`: {
      if (!validateMove(state, { row, column })) {
        return state;
      }
      const newBoard: Board = [...state.board];
      newBoard[row][column] = 'x';
      if (getWinner(newBoard)) {
        return {
          board: newBoard,
          turn: 'game over - x wins',
        };
      }
      if (isBoardFull(newBoard)) {
        return {
          board: newBoard,
          turn: `game over - it's a tie`,
        };
      }
      return { board: newBoard, turn: `o's turn` };
    }
    case `o's turn`: {
      if (!validateMove(state, { row, column })) {
        return state;
      }
      validateMove(state, { row, column });
      const newBoard: Board = [...state.board];
      newBoard[row][column] = 'o';
      if (getWinner(newBoard)) {
        return {
          board: newBoard,
          turn: 'game over - o wins',
        };
      }
      if (isBoardFull(newBoard)) {
        return {
          board: newBoard,
          turn: `game over - it's a tie`,
        };
      }
      return { board: newBoard, turn: `x's turn` };
    }
    case 'game over - x wins':
    case 'game over - o wins':
    case `game over - it's a tie`: {
      return state;
    }
  }
}

function isBoardFull(board: Board): boolean {
  for (const row of board) {
    for (const space of row) {
      if (space === '') {
        return false;
      }
    }
  }
  return true;
}

function validateMove(
  state: TicTacToeState,
  { row, column }: SpaceCoordinates
): boolean {
  if (state.board[row][column] === '') {
    return true;
  }
  return false;
}
