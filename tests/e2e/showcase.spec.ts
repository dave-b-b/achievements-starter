import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a real home unlock celebrates and the full collection remains keyboard accessible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Make a little progress' }).click();
  await expect(page.getByTestId('achievement-notice')).toContainText('A little momentum');
  await expect(page.getByTestId('built-in-confetti')).toBeAttached();
  await expect(page.locator('canvas')).toBeVisible();
  const collection = page.getByRole('button', { name: /^View all achievements:/ });
  await expect(collection).toContainText('1 / 2');
  await collection.click();
  const dialog = page.getByRole('dialog', { name: 'Your achievements', exact: true });
  await expect(dialog.locator('.badge-card')).toHaveCount(2);
  await expect(dialog.locator('.badge-card.earned')).toContainText('A little momentum');
  await expect(dialog.getByText('Locked', { exact: true })).toHaveCount(1);
  await expect(
    dialog.getByRole('progressbar', { name: 'Look at you go progress' }),
  ).toHaveAttribute('value', '1');
  await expect(dialog.getByRole('button', { name: 'Close achievements' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close achievements' })).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(collection).toBeFocused();
});

test('guests can inspect every course achievement without signing in', async ({ page }) => {
  await page.goto('/learn');
  await expect(page.locator('.achievement-board .badge-card')).toHaveCount(3);
  await page.getByRole('button', { name: /^View all achievements:/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Your achievements', exact: true });
  await expect(dialog.getByText('Locked', { exact: true })).toHaveCount(3);
  await expect(dialog).toContainText('Ready to build');
  await dialog.getByRole('button', { name: 'Close achievements' }).click();
  await expect(dialog).toHaveCount(0);
});

test('reduced motion keeps unlock notifications and achievement state usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Make a little progress' }).click();
  await expect(page.getByTestId('achievement-notice')).toContainText('Achievement unlocked');
  await expect(page.getByRole('button', { name: /^View all achievements:/ })).toContainText(
    '1 / 2',
  );
  await page.getByRole('button', { name: 'Dismiss achievement notification' }).click();
  await expect(page.getByTestId('achievement-notice')).toHaveCount(0);
});

test('Starfall gameplay earns a real badge, pauses for its collection, and starts a fresh run', async ({
  page,
}) => {
  await page.goto('/arcade');
  await expect(page.locator('.achievement-board .badge-card')).toHaveCount(5);
  await expect(page.getByTestId('arcade-next-achievement')).toContainText('First contact');
  await page.getByRole('button', { name: 'Start mission', exact: true }).click();
  await expect(page.getByTestId('arcade-score')).not.toHaveText('0', { timeout: 10000 });
  const inGameNotice = page.locator('#arcade-stage').getByTestId('achievement-notice');
  await expect(inGameNotice).toContainText('First contact');
  await expect(page.getByTestId('arcade-next-achievement')).not.toContainText('First contact');
  const collection = page.getByRole('button', { name: /^View all achievements:/ });
  await collection.click();
  const dialog = page.getByRole('dialog', { name: 'Your achievements', exact: true });
  await expect(dialog.locator('.badge-card')).toHaveCount(5);
  await expect(dialog.locator('.badge-card.earned')).toContainText('First contact');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Mission paused.' })).toBeVisible();
  const score = await page.getByTestId('arcade-score').innerText();
  await page.waitForTimeout(350);
  await expect(page.getByTestId('arcade-score')).toHaveText(score);
  await page.getByRole('button', { name: 'Resume mission', exact: true }).click();
  await expect(page.getByRole('application', { name: 'Starfall game area' })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { name: 'Mission paused.' })).toBeVisible();
  await page.getByRole('button', { name: 'New run', exact: true }).click();
  await expect(page.getByTestId('arcade-score')).toHaveText('0');
  await expect(collection).toContainText('0 / 5');
  await page.getByRole('button', { name: 'Pause run', exact: true }).click();
});

test('capture Starfall for the repository', async ({ page }, testInfo) => {
  await page.goto('/arcade');
  await page.getByRole('button', { name: 'Start mission', exact: true }).click();
  await expect(page.getByTestId('arcade-score')).not.toHaveText('0', { timeout: 10000 });
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(250);
  await page.keyboard.up('ArrowLeft');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    path: `public/screenshots/starfall-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test('an expired OAuth link explains recovery while keeping the public demos available', async ({
  page,
}) => {
  await page.goto('/?error_code=bad_oauth_state');
  await expect(page.locator('.expired-sign-in')).toContainText('Your sign-in link expired');
  await expect(page.getByRole('button', { name: /^View all achievements:/ })).toBeVisible();
  await page.getByRole('link', { name: 'Open course', exact: false }).click();
  await expect(page.locator('.achievement-board .badge-card')).toHaveCount(3);
  await expect(page.locator('.expired-sign-in')).toHaveCount(0);
});
