import { test, expect, type Page } from '@playwright/test';

async function report(page: Page, description: string, priority = 'Urgent') {
  await page.getByLabel('What needs repairing?').fill(description);
  await page.getByLabel('Reporter name').fill('Alex Morgan');
  await page.getByRole('radio', { name: priority, exact: true }).check();
  await page.getByRole('button', { name: 'Report repair', exact: true }).click();
}

test('complete workflow, validation, independent records and refresh persistence', async ({ page }) => {
  await page.goto('/');
  const form = page.getByRole('region', { name: 'Report a repair' });
  const details = page.getByRole('region', { name: 'Repair details' });
  const list = page.getByRole('region', { name: 'Repair jobs' });

  for (const blank of ['', '   ']) {
    await page.getByLabel('What needs repairing?').fill(blank);
    await page.getByLabel('Reporter name').fill('Alex Morgan');
    await form.getByRole('button', { name: 'Report repair', exact: true }).click();
    await expect(form.getByText('Describe the repair needed.')).toBeVisible();
    await expect(list.getByRole('button')).toHaveCount(0);
  }
  for (const blank of ['', '   ']) {
    await page.getByLabel('What needs repairing?').fill('Garden fence damaged');
    await page.getByLabel('Reporter name').fill(blank);
    await form.getByRole('button', { name: 'Report repair', exact: true }).click();
    await expect(form.getByText('Enter the reporter’s name.')).toBeVisible();
    await expect(page.getByLabel('What needs repairing?')).toHaveValue('Garden fence damaged');
    await expect(list.getByRole('button')).toHaveCount(0);
  }

  await report(page, 'Garden fence damaged');
  await expect(page.getByRole('status')).toContainText('Repair reported and saved');
  await expect(details).toContainText('Meadow House');
  await expect(details).toContainText('Alex Morgan');
  await expect(details).toContainText('Urgent');
  await expect(details.locator('.section-title')).toContainText('New');
  const fenceId = await details.locator('.job-id').innerText();
  await expect(details.locator('.details time')).toHaveAttribute('datetime', /\d{4}-\d{2}-\d{2}T/);
  await report(page, 'Kitchen light not working', 'Normal');
  await expect(list.getByRole('button')).toHaveCount(2);
  await expect(details).toContainText('Normal');
  expect(await details.locator('.job-id').innerText()).not.toBe(fenceId);
  await list.getByRole('button', { name: /Garden fence damaged/ }).click();
  await page.getByLabel('Status', { exact: true }).selectOption('In Progress');
  await page.getByLabel(/^Progress note/).fill('Temporary barrier fitted');
  await page.getByRole('button', { name: 'Save update' }).click();
  await expect(page.getByRole('status')).toContainText('Update saved');
  await expect(details.locator('.latest-update')).toContainText('Temporary barrier fitted');
  const historyBefore = await details.locator('.history').innerText();
  const storageBefore = await page.evaluate(() => localStorage.getItem('meadow-house-repairs:v1'));
  await page.getByLabel('Status', { exact: true }).selectOption('Completed');
  for (const blank of ['', '   ']) {
    await page.getByLabel(/^Completion note/).fill(blank);
    await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
    await expect(page.getByText('Explain what was repaired before completing the job.')).toBeVisible();
    await expect(details.locator('.history')).toHaveText(historyBefore, { useInnerText: true });
    await expect(details.locator('.section-title')).toContainText('In Progress');
    expect(await page.evaluate(() => localStorage.getItem('meadow-house-repairs:v1'))).toBe(storageBefore);
  }
  await page.getByLabel(/^Completion note/).fill('Fence repaired and checked');
  await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
  await expect(details.locator('.completion')).toContainText('Fence repaired and checked');
  await expect(details.locator('.history li')).toHaveCount(3);
  const completedStorage = await page.evaluate(() => localStorage.getItem('meadow-house-repairs:v1'));
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem('meadow-house-repairs:v1'))).toBe(completedStorage);
  await expect(list.getByRole('button')).toHaveCount(1);
  await expect(details).toHaveCount(0);
  await expect(page.locator('#repair-record')).not.toHaveAttribute('open', '');
  await page.locator('#repair-record summary').click();
  await page.locator('#repair-record').getByRole('button', { name: /Garden fence damaged/ }).click();
  await expect(details.locator('.completion')).toContainText('Fence repaired and checked');
  await expect(details.locator('.history li')).toHaveCount(3);
  await list.getByRole('button', { name: /Kitchen light not working/ }).click();
  await expect(details.locator('.section-title')).toContainText('New');
  await expect(details.locator('.history li')).toHaveCount(1);
  await expect(details).toContainText('Normal');
  await expect(details).not.toContainText('Temporary barrier fitted');
});

test('literal text and long records remain readable without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const text = '<b>check gate</b>';
  await report(page, text);
  const details = page.getByRole('region', { name: 'Repair details' });
  await expect(details.locator('.repair-description')).toHaveText(text);
  await expect(details.locator('.repair-description b')).toHaveCount(0);
  await page.getByLabel('Status', { exact: true }).selectOption('In Progress');
  await page.getByLabel(/^Progress note/).fill(text);
  await page.getByRole('button', { name: 'Save update' }).click();
  await expect(details.locator('.history li').last().locator('p')).toHaveText(text);
  await expect(details.locator('.history b')).toHaveCount(0);
  const long = 'R'.repeat(200);
  await report(page, long);
  await page.getByLabel('Status', { exact: true }).selectOption('In Progress');
  await page.getByLabel(/^Progress note/).fill(long);
  await page.getByRole('button', { name: 'Save update' }).click();
  await expect(details.locator('.repair-description')).toHaveText(long);
  await expect(details.locator('.history li').last().locator('p')).toHaveText(long);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${test.info().project.name}-layout.png`, fullPage: true });
});

test('the core journey works by keyboard and creation focuses the named repair', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to repairs' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByLabel('What needs repairing?').focus();
  await page.keyboard.type('Garden fence damaged');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Alex Morgan');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Report repair', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  const details = page.getByRole('region', { name: 'Repair details' });
  await expect(details).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Status', { exact: true })).toBeFocused();
  const outline = await page.getByLabel('Status', { exact: true }).evaluate(el => {
    const style = getComputedStyle(el); return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });
  expect(outline.style).toBe('solid');
  expect(outline.width).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Tab');
  await page.keyboard.type('Temporary barrier fitted');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(details.locator('.latest-update')).toContainText('Temporary barrier fitted');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByLabel('Status', { exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Fence repaired and checked');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(details.locator('.completion')).toContainText('Fence repaired and checked');
  await expect(details.locator('.history li')).toHaveCount(3);
});

test('a failed storage write preserves saved state and the note draft', async ({ page }) => {
  await page.goto('/');
  await report(page, 'Garden fence damaged');
  const before = await page.evaluate(() => localStorage.getItem('meadow-house-repairs:v1'));
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage full', 'QuotaExceededError'); }; });
  await page.getByLabel(/^Progress note/).fill('Temporary barrier fitted');
  await page.getByRole('button', { name: 'Save update' }).click();
  await expect(page.getByRole('region', { name: 'Repair details' }).getByRole('alert')).toContainText('could not be saved');
  await expect(page.getByLabel(/^Progress note/)).toHaveValue('Temporary barrier fitted');
  await expect(page.locator('.detail-panel .section-title')).toContainText('New');
  await expect(page.locator('.history li')).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem('meadow-house-repairs:v1'))).toBe(before);
});
