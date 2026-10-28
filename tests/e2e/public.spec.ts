import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('a real unlock works on the landing page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Make a little progress' }).click();
  await expect(page.getByRole('status')).toContainText('1 of 2');
  await page.getByRole('button', { name: 'Make a little progress' }).click();
  await page.getByRole('button', { name: 'Make a little progress' }).click();
  await expect(page.getByRole('button', { name: 'All wins unlocked' })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset live demo' }).click();
  await expect(page.getByRole('status')).toContainText('0 of 2');
  expect(errors).toEqual([]);
});
test('playground presets, customization, and reset use actual SDK state', async ({ page }) => {
  await page.goto('/playground');
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('button', { name: 'Skip tour', exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Complete a lesson', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Achievement unlocked', exact: true }),
  ).toBeDisabled();
  await page.getByLabel('Achievement name').fill('My small win');
  await expect(page.getByRole('heading', { name: 'My small win' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Complete a lesson', exact: true })).toBeEnabled();
  await expect(page.getByLabel('Complete integration code')).toHaveValue(/My small win/);
  await page.getByRole('button', { name: 'Onboarding', exact: true }).click();
  await page.getByRole('button', { name: 'Complete your profile', exact: true }).click();
  await expect(page.locator('.preview-status')).toContainText('Nicely done');
  await page.getByRole('button', { name: 'Reset preview', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Complete your profile', exact: true }),
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Task completion', exact: true }).click();
  await page.getByLabel('Unlock threshold').fill('1');
  await page.getByRole('button', { name: 'Finish a task', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Achievement unlocked', exact: true }),
  ).toBeDisabled();
});
test('lessons are readable without backend configuration', async ({ page }) => {
  await page.goto('/learn');
  await expect(
    page.getByRole('heading', { name: 'Define a small win', exact: true }),
  ).toBeVisible();
  await page
    .locator('.lesson-list')
    .getByRole('button', { name: /Connect an action/ })
    .click();
  await expect(page.getByRole('heading', { name: 'Connect an action', exact: true })).toBeVisible();
  await page
    .locator('.lesson-list')
    .getByRole('button', { name: /Make progress feel good/ })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Make progress feel good', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Complete lesson', exact: true })).toHaveCount(0);
});
test('cross-origin mutations are denied and unsupported commands are absent', async ({
  request,
}) => {
  expect(
    (
      await request.post('/api/complete', {
        headers: { origin: 'https://attacker.example' },
        data: { lessonId: 'define' },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/track', { data: { metric: 'lessonsCompleted', value: 99 } })
    ).status(),
  ).toBe(404);
  expect((await request.get('/api/progress')).headers()['cache-control']).toContain('no-store');
});
for (const path of ['/', '/playground', '/learn', '/setup', '/architecture', '/privacy'])
  test(`accessible page ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      accessibility.violations.map((rule) => ({
        id: rule.id,
        nodes: rule.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
  });
test('capture the actual product for the repository', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.screenshot({
    path: `public/screenshots/overview-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test('automatic playground tour demonstrates a real unlock, remembers completion, and replays', async ({
  page,
}) => {
  await page.goto('/playground');
  const start = page.getByRole('button', { name: 'Show me around', exact: true });
  let dialog = page.getByRole('alertdialog');
  await expect(dialog).toContainText('Start with a familiar moment');
  await dialog.getByRole('button', { name: /Next/ }).click();
  await expect(dialog).toContainText('See a real achievement unlock');
  await dialog.getByRole('button', { name: 'Preview an unlock', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Achievement unlocked', exact: true }),
  ).toBeDisabled();
  await expect(page.getByTestId('floater')).toHaveCSS('opacity', '1');
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    accessibility.violations.map((rule) => ({
      id: rule.id,
      targets: rule.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
  await dialog.getByRole('button', { name: /Next/ }).click();
  await expect(dialog).toContainText('Give it your personality');
  await expect(page.getByTestId('floater')).toHaveCSS('opacity', '1');
  await dialog.getByRole('button', { name: /Next/ }).click();
  await expect(dialog).toContainText('Take the working code with you');
  await expect(page.getByTestId('floater')).toHaveCSS('opacity', '1');
  await dialog.getByRole('button', { name: 'Got it', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.reload();
  await expect(start).toBeVisible();
  await page.getByRole('button', { name: 'Complete a lesson', exact: true }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Preview achievement progress' }),
  ).toHaveAttribute('value', '1');
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await start.click();
  dialog = page.getByRole('alertdialog');
  await expect(dialog).toContainText('Start with a familiar moment');
  await dialog.getByRole('button', { name: 'Skip tour', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
});

test('Escape exits the tour and leaves the preview usable', async ({ page }) => {
  await page.goto('/playground');
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Show me around', exact: true })).toBeVisible();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Complete a lesson', exact: true }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Preview achievement progress' }),
  ).toHaveAttribute('value', '1');
});

test('setup guide walks through minimal, saved progress, and free hosting', async ({ page }) => {
  await page.goto('/setup');
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toContainText('Get your first unlock quickly');
  await dialog.getByRole('button', { name: /Next/ }).click();
  await expect(dialog).toContainText('Add saved progress when you need it');
  await dialog.getByRole('button', { name: /Next/ }).click();
  await expect(dialog).toContainText('Put it online on the free plans');
  await dialog.getByRole('button', { name: 'Got it', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Guide me through setup', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.goto('/playground');
  await expect(page.getByRole('alertdialog')).toContainText('Start with a familiar moment');
});

test('automatic tour can be dismissed and replayed when browser storage is blocked', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage is blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/setup');
  await expect(page.getByRole('alertdialog')).toContainText('Get your first unlock quickly');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Guide me through setup', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toContainText('Get your first unlock quickly');
});
