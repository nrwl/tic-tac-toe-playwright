import { Page, test, expect } from '@playwright/test';
import {
  Board,
  BoardIndex,
  SpaceContent,
  SpaceCoordinates,
} from '../../../libs/tic-tac-toe-logic/src';
import { startServer } from '../../multi-player-server/src/start-server';

let serverProcess;

test.beforeEach(() => {
  const { server } = startServer();
  serverProcess = server;
});

test.afterEach(() => {
  serverProcess.close();
});

test('starts with an empty board', async ({ page: xPlayer, browser }) => {
  const oPlayer = await browser.newPage();
  await xPlayer.goto('/');
  await oPlayer.goto('/');
  await assertBoardMatches(xPlayer, [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertBoardMatches(oPlayer, [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertTurn(xPlayer, `Your turn`);
  await assertTurn(oPlayer, `Waiting on opponent...`);
});

test('clicking works', async ({ page: xPlayer, browser }) => {
  const oPlayer = await browser.newPage();
  await xPlayer.goto('/');
  await oPlayer.goto('/');
  await assertBoardMatches(xPlayer, [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertBoardMatches(oPlayer, [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await clickSpace(xPlayer, { row: 0, column: 0 });
  await assertBoardMatches(xPlayer, [
    ['x', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertBoardMatches(oPlayer, [
    ['x', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertTurn(xPlayer, `Waiting on opponent...`);
  await assertTurn(oPlayer, `Your turn`);
});

test('x wins', async ({ page: xPlayer, browser }) => {
  const oPlayer = await browser.newPage();
  await xPlayer.goto('/');
  await oPlayer.goto('/');
  await clickSpace(xPlayer, { row: 0, column: 0 });
  await clickSpace(oPlayer, { row: 1, column: 0 });
  await clickSpace(xPlayer, { row: 0, column: 1 });
  await clickSpace(oPlayer, { row: 1, column: 1 });
  await clickSpace(xPlayer, { row: 0, column: 2 });
  await assertBoardMatches(xPlayer, [
    ['x', 'x', 'x'],
    ['o', 'o', ''],
    ['', '', ''],
  ]);
  await assertBoardMatches(oPlayer, [
    ['x', 'x', 'x'],
    ['o', 'o', ''],
    ['', '', ''],
  ]);
  await assertTurn(xPlayer, `You win!`);
  await assertTurn(oPlayer, `You lose!`);
});

test('cats game', async ({ page: xPlayer, browser }) => {
  const oPlayer = await browser.newPage();
  await xPlayer.goto('/');
  await oPlayer.goto('/');
  await clickSpace(xPlayer, { row: 0, column: 0 });
  await clickSpace(oPlayer, { row: 0, column: 1 });
  await clickSpace(xPlayer, { row: 0, column: 2 });
  await clickSpace(oPlayer, { row: 1, column: 0 });
  await clickSpace(xPlayer, { row: 1, column: 2 });
  await clickSpace(oPlayer, { row: 1, column: 1 });
  await clickSpace(xPlayer, { row: 2, column: 0 });
  await clickSpace(oPlayer, { row: 2, column: 2 });
  await clickSpace(xPlayer, { row: 2, column: 1 });
  await assertBoardMatches(xPlayer, [
    ['x', 'o', 'x'],
    ['o', 'o', 'x'],
    ['x', 'x', 'o'],
  ]);
  await assertBoardMatches(oPlayer, [
    ['x', 'o', 'x'],
    ['o', 'o', 'x'],
    ['x', 'x', 'o'],
  ]);
  await assertTurn(xPlayer, `Tie game`);
  await assertTurn(oPlayer, `Tie game`);
});

async function clickSpace(
  page: Page,
  { row, column }: SpaceCoordinates
): Promise<void> {
  await page.click(`[data-e2e="space-button-${row}-${column}"]`);
}

async function assertTurn(page: Page, expectedTurnText: string): Promise<void> {
  const turn = await getTurn(page);
  expect(turn).toEqual(expectedTurnText);
}

async function assertBoardMatches(
  page: Page,
  expectedBoard: Board
): Promise<void> {
  const board = await getBoard(page);
  expect(JSON.stringify(board)).toEqual(JSON.stringify(expectedBoard));
}

async function getBoard(page: Page): Promise<Board> {
  const board: Board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  await Promise.all(
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(async (i) => {
      const [row, column] = [i % 3, Math.floor(i / 3)] as [
        BoardIndex,
        BoardIndex
      ];
      const space = await getSpace(page, { row, column });
      board[row][column] = space;
    })
  );
  return board;
}

async function getTurn(page: Page): Promise<string> {
  const turnText = await page.locator('[data-e2e="turn-label"]').innerText();
  return turnText;
}

async function getSpace(
  page: Page,
  { row, column }: SpaceCoordinates
): Promise<SpaceContent> {
  const content = await page
    .locator(`[data-e2e="space-button-${row}-${column}"]`)
    .innerText();
  return content.toLowerCase() as SpaceContent;
}
