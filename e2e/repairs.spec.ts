import { test, expect, type Page } from '@playwright/test';

async function report(page: Page, description: string, priority = 'Urgent') {
  await page.getByLabel('What needs repairing?').fill(description);
  await page.getByLabel('Reporter name').fill('Alex Morgan');
  await page.getByLabel('Priority', { exact: true }).selectOption(priority);
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
    await form.getByRole('button').click();
    await expect(form.getByText('Describe the repair needed.')).toBeVisible();
    await expect(list.getByRole('button')).toHaveCount(0);
  }
  for (const blank of ['', '   ']) {
    await page.getByLabel('What needs repairing?').fill('Garden fence damaged');
    await page.getByLabel('Reporter name').fill(blank);
    await form.getByRole('button').click();
    await expect(form.getByText('Enter the reporter’s name.')).toBeVisible();
    await expect(page.getByLabel('What needs repairing?')).toHaveValue('Garden fence damaged');
    await expect(list.getByRole('button')).toHaveCount(0);
  }

  await report(page, 'Garden fence damaged');
  await expect(page.getByRole('status')).toContainText('Repair reported and saved');
  await expect(details).toContainText('Meadow House');
  await expect(details).toContainText('Alex Morgan');
  await expect(details).toContainText('Urgent');
  await report(page, 'Kitchen light not working', 'Normal');
  await expect(list.getByRole('button')).toHaveCount(2);
  await expect(details).toContainText('Normal');
  await list.getByRole('button', { name: /Garden fence damaged/ }).click();
  await details.getByRole('button', { name: 'Start repair' }).click();
  await page.getByLabel('Progress or completion note').fill('Temporary barrier fitted');
  await page.getByRole('button', { name: 'Save progress note' }).click();
  await expect(page.getByRole('status')).toContainText('Progress note saved');
  const historyBefore = await details.locator('.history').innerText();
  for (const blank of ['', '   ']) {
    await page.getByLabel('Progress or completion note').fill(blank);
    await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
    await expect(page.getByText('Explain what was repaired before completing the job.')).toBeVisible();
    await expect(details.locator('.history')).toHaveText(historyBefore, { useInnerText: true });
    await expect(details.locator('.section-title')).toContainText('In Progress');
  }
  await page.getByLabel('Progress or completion note').fill('Fence repaired and checked');
  await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
  await expect(details.locator('.completion')).toContainText('Fence repaired and checked');
  await expect(details.locator('.history li')).toHaveCount(4);
  await page.reload();
  await expect(list.getByRole('button')).toHaveCount(2);
  await list.getByRole('button', { name: /Garden fence damaged/ }).click();
  await expect(details.locator('.completion')).toContainText('Fence repaired and checked');
  await expect(details.locator('.history li')).toHaveCount(4);
  await list.getByRole('button', { name: /Kitchen light not working/ }).click();
  await expect(details.locator('.section-title')).toContainText('New');
  await expect(details.locator('.history li')).toHaveCount(1);
  await expect(details).not.toContainText('Temporary barrier fitted');
});

test('literal text and long records remain readable without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const text = '<b>check gate</b>';
  await report(page, text);
  const details = page.getByRole('region', { name: 'Repair details' });
  await expect(details.locator('.repair-description')).toHaveText(text);
  await expect(details.locator('.repair-description b')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start repair', exact: true }).click();
  await page.getByLabel('Progress or completion note').fill(text);
  await page.getByRole('button', { name: 'Save progress note' }).click();
  await expect(details.locator('.history li').last().locator('p')).toHaveText(text);
  await expect(details.locator('.history b')).toHaveCount(0);
  const long = 'R'.repeat(200);
  await report(page, long);
  await page.getByRole('button', { name: 'Start repair', exact: true }).click();
  await page.getByLabel('Progress or completion note').fill(long);
  await page.getByRole('button', { name: 'Save progress note' }).click();
  await expect(details.locator('.repair-description')).toHaveText(long);
  await expect(details.locator('.history li').last().locator('p')).toHaveText(long);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${test.info().project.name}-layout.png`, fullPage: true });
});
