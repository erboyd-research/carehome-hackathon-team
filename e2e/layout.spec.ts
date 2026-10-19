import { test, expect } from '@playwright/test';

test('two large panels, closed completed record and no unsolicited details', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('region', { name: 'Repair details' })).toHaveCount(0);
  await expect(page.locator('#repair-record')).not.toHaveAttribute('open', '');
  await expect(page.getByText(/Fictional data|Saved in this browser|Repairs save in this browser|University hackathon/)).toHaveCount(0);
  const form = page.getByRole('region', { name: 'Report a repair' });
  const list = page.getByRole('region', { name: 'Repair jobs' });
  if (test.info().project.name === 'desktop') {
    const formBox = (await form.boundingBox())!;
    const listBox = (await list.boundingBox())!;
    expect(formBox.width).toBeGreaterThanOrEqual(500);
    expect(listBox.width).toBeGreaterThanOrEqual(500);
    expect(formBox.y).toBe(listBox.y);
    const action = (await page.getByRole('button', { name: 'Report repair', exact: true }).boundingBox())!;
    expect(action.y + action.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  }
  await page.getByLabel('What needs repairing?').fill('Garden fence damaged');
  await page.getByLabel('Reporter name').fill('Alex Morgan');
  await page.getByRole('button', { name: 'Report repair', exact: true }).click();
  await page.getByLabel('Status', { exact: true }).selectOption('Completed');
  await page.getByLabel(/^Completion note/).fill('Fence repaired and checked');
  await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
  await page.getByRole('button', { name: 'Close repair' }).click();
  await expect(list).toBeFocused();
  await page.getByLabel('What needs repairing?').fill('Kitchen light not working');
  await page.getByLabel('Reporter name').fill('Sam Taylor');
  await page.getByRole('button', { name: 'Report repair', exact: true }).click();
  await page.reload();
  await expect(list.getByRole('button', { name: /Kitchen light/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Repair details' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Garden fence/ })).not.toBeVisible();
  await expect(page.locator('#repair-record summary')).toContainText('1 completed');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${test.info().project.name}-workspace.png`, fullPage: true });
  await page.locator('#repair-record summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Garden fence/ })).toBeVisible();
  await page.getByRole('button', { name: /Garden fence/ }).click();
  await expect(page.locator('.completion')).toContainText('Fence repaired and checked');
  await page.getByRole('button', { name: 'Close repair' }).click();
  await page.locator('#repair-record summary').click();
  await expect(page.getByRole('button', { name: /Garden fence/ })).not.toBeVisible();
});
