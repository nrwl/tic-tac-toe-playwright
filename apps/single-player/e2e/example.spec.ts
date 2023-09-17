import { Page, expect, test } from '@playwright/test';
import {
  Board,
  BoardIndex,
  SpaceContent,
  SpaceCoordinates,
  Turn,
} from 'tic-tac-toe-logic';

test('starts with an empty board', async ({ page }) => {
  await page.goto('/');
  await assertBoardMatches(page, [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertTurn(page, `x's turn`);
});

test('clicking works', async ({ page }) => {
  await page.goto('/');
  await assertBoardMatches(page, [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await clickSpace(page, { row: 0, column: 0 });
  await assertBoardMatches(page, [
    ['x', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  await assertTurn(page, `o's turn`);
});

test('x wins', async ({ page }) => {
  await page.goto('/');
  await clickSpace(page, { row: 0, column: 0 });
  await clickSpace(page, { row: 1, column: 0 });
  await clickSpace(page, { row: 0, column: 1 });
  await clickSpace(page, { row: 1, column: 1 });
  await clickSpace(page, { row: 0, column: 2 });
  await assertBoardMatches(page, [
    ['x', 'x', 'x'],
    ['o', 'o', ''],
    ['', '', ''],
  ]);
  await assertTurn(page, `game over - x wins`);
});

test('cats game', async ({ page }) => {
  await page.goto('/');
  await clickSpace(page, { row: 0, column: 0 });
  await clickSpace(page, { row: 0, column: 1 });
  await clickSpace(page, { row: 0, column: 2 });
  await clickSpace(page, { row: 1, column: 0 });
  await clickSpace(page, { row: 1, column: 2 });
  await clickSpace(page, { row: 1, column: 1 });
  await clickSpace(page, { row: 2, column: 0 });
  await clickSpace(page, { row: 2, column: 2 });
  await clickSpace(page, { row: 2, column: 1 });
  await assertBoardMatches(page, [
    ['x', 'o', 'x'],
    ['o', 'o', 'x'],
    ['x', 'x', 'o'],
  ]);
  await assertTurn(page, `game over - it's a tie`);
});

async function clickSpace(
  page: Page,
  { row, column }: SpaceCoordinates
): Promise<void> {
  await page.click(`[data-e2e="space-button-${row}-${column}"]`);
}

async function assertTurn(page: Page, expectedTurn: Turn): Promise<void> {
  const turn = await getTurn(page);
  expect(turn).toEqual(expectedTurn);
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

async function getTurn(page: Page): Promise<Turn> {
  const turn = await page.locator('[data-e2e="turn-label"]').innerText();
  return turn.toLowerCase() as Turn;
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
