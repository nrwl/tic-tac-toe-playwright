import { test, expect } from '@playwright/test';
import { Board } from 'tic-tac-toe-logic';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Tic-Tac-Toe');
});

function getBoard(): Board {}
