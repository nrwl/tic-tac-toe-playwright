<script setup lang="ts">
import { TicTacToeState, createEmptyBoard, nextState } from 'tic-tac-toe-logic';

const state = useState<TicTacToeState>('state', () => ({
  board: createEmptyBoard(),
  turn: `x's turn`,
}));
</script>

<template>
  <h1>Tic Tac Toe</h1>
  <h2>{{ state.turn }}</h2>
  <div class="border">
    <div class="board">
      <div
        v-for="i in [0, 1, 2]
          .map((row) => [0, 1, 2].map((column) => [row, column]))
          .flat()"
        :key="i[0] + '|' + i[1]"
      >
        <button @click="state = nextState(state, { row: i[0], column: i[1] })">
          {{ state.board[i[0]][i[1]] }}
        </button>
      </div>
    </div>
  </div>
  <button @click="state = { board: createEmptyBoard(), turn: `x's turn` }">
    Reset Game
  </button>
</template>
