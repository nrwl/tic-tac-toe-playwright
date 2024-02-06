<script setup lang="ts">
import {
  TicTacToeState,
  createEmptyBoard,
  nextState,
  SpaceCoordinates,
} from 'tic-tac-toe-logic';
import partysocket from 'partysocket';

const state = ref<TicTacToeState>({
  board: createEmptyBoard(),
  turn: `x's turn`,
});
const local = ref<'x' | 'o' | null>(null);

let server: partysocket;

if (import.meta.client) {
  server = new partysocket({
    host: 'localhost:1999',
    room: 'tic-tac-toe',
  });
  server.onmessage = (event) => {
    console.log(event.data);
    if (event.data === 'you are X') {
      local.value = 'x';
    } else if (event.data === 'you are O') {
      local.value = 'o';
    } else {
      const decoded = event.data.replace('state: ', '');
      state.value = JSON.parse(decoded);
    }
  };

  // watch(state, (newState) => {
  //   server.send('state: ' + JSON.stringify(newState));
  // });
}

function sendCoordinatesOfMove(coors: SpaceCoordinates) {
  console.log(coors);
  if (state.value.turn !== `${local.value}'s turn`) {
    return;
  }
  server.send(JSON.stringify(coors));
}

function sendReset() {
  server.send('reset');
}

// const state = useState<TicTacToeState>('state', () => {

// });
</script>

<template>
  <div id="root">
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
          <button
            :disabled="state.turn !== `${local}'s turn`"
            @click="sendCoordinatesOfMove({ row: i[0], column: i[1] })"
          >
            {{ state.board[i[0]][i[1]] }}
          </button>
        </div>
      </div>
    </div>
    <button @click="sendReset()">Reset Game</button>
  </div>
</template>

<style scoped lang="css">
/* @tailwind base;
@tailwind components;
@tailwind utilities; */
/* You can add global styles to this file, and also import other style files */

.border {
  background-color: black;
  width: 200px;
  text-align: center;
}

.board {
  display: grid;
  grid-template-columns: fit-content(40px) fit-content(40px) fit-content(40px);
  grid-template-rows: fit-content(40px) fit-content(40px) fit-content(40px);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin: 0;
}

.board > div {
  background-color: white;
  padding: 10px;
}

.board button {
  text-align: center;
  height: 40px;
  width: 40px;
}

.reset {
  margin-top: 40px;
}

#root {
  display: grid;
  font-family: sans-serif;
  min-width: 300px;
  max-width: 600px;
  margin: 50px auto;
  align-content: center;
  justify-items: center;
}

#root > button {
  margin-top: 20px;
}
</style>
