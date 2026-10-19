import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('required screens and error states pass WCAG A/AA automated checks', async ({ page }) => {
  await page.goto('/');
  const scan = async () => {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  };
  const undersizedControls = await page.locator('a, button, input, select, textarea, summary, label').evaluateAll(elements =>
    elements.filter(el => el.checkVisibility() && parseFloat(getComputedStyle(el).fontSize) < 14)
      .map(el => ({ text: el.textContent?.trim(), tag: el.tagName, size: getComputedStyle(el).fontSize })),
  );
  expect(undersizedControls).toEqual([]);
  await scan();
  await page.getByRole('button', { name: 'Report repair', exact: true }).click();
  await expect(page.getByLabel('What needs repairing?')).toBeFocused();
  await expect(page.getByLabel('What needs repairing?')).toHaveAttribute('aria-describedby', 'description-error');
  await scan();
  await page.getByLabel('What needs repairing?').fill('Garden fence damaged');
  await page.getByLabel('Reporter name').fill('Alex Morgan');
  await page.getByRole('radio', { name: 'Urgent', exact: true }).check();
  await page.getByRole('button', { name: 'Report repair', exact: true }).click();
  await page.getByLabel(/^Progress note/).fill('Temporary barrier fitted');
  await page.getByRole('button', { name: 'Save update' }).click();
  await scan();
  await page.getByLabel('Status', { exact: true }).selectOption('Completed');
  await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
  await expect(page.getByLabel(/^Completion note/)).toBeFocused();
  await expect(page.getByLabel(/^Completion note/)).toHaveAttribute('aria-describedby', 'note-hint note-error');
  await scan();
  await page.getByLabel(/^Completion note/).fill('Fence repaired and checked');
  await page.getByRole('button', { name: 'Complete repair', exact: true }).click();
  await scan();
  await page.locator('#repair-record summary').click();
  await scan();
  await page.locator('#repair-record summary').click();
  await page.screenshot({ path: `test-results/${test.info().project.name}-completed.png`, fullPage: true });
});
