import type { PartyKitServer } from 'partykit/server';
import { SpaceCoordinates, TicTacToeState, nextState } from '../../libs/tic-tac-toe-logic/src/index.ts';

const startingBoard = {
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ],
    turn: `x's turn`,
} satisfies TicTacToeState;

export default {
    onConnect: async (webSocketConnection, room) => {
        
        // checkIfRoomInitialized
        let board = await room.storage.get<TicTacToeState>('board');
        const numPlayers = Array.from(room.getConnections()).length;

        // 1 player, initialize room
        if (!board || numPlayers === 1) {
            board = startingBoard;
            await room.storage.put('board', board);
            webSocketConnection.send('you are X');
        }
        // 2 players, join exisiting room
        if (numPlayers === 2) {
            webSocketConnection.send('you are O');
            room.broadcast(`state: ${JSON.stringify(board)}`);
        // more than 2 players, reject connection
        } else if (numPlayers > 2) {
            webSocketConnection.send('game full');
            webSocketConnection.close();
        }

        async function advance(coordinates: SpaceCoordinates) {
            const state = await room.storage.get<TicTacToeState>('board');
            if (!state) {
                // better to throw?
                return;
            }
            const next = nextState(state, coordinates);
            await room.storage.put('board', next);
            room.broadcast(`state: ${JSON.stringify(next)}`);
        }

        // 
        webSocketConnection.addEventListener('message', ({ data }) => {
            console.log(data);
            if (data.toString().startsWith('reset')) {
                room.storage.put('board', startingBoard);
                room.broadcast(`state: ${JSON.stringify(startingBoard)}`);
                return;
            }
            const coordinates = JSON.parse(data.toString());
            advance(coordinates);
        })
    }
} satisfies PartyKitServer;

