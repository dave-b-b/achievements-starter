import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('overview offers three clear next steps and optional package details', async ({ page }) => {
  await page.goto('/');
  const paths = page.getByRole('region', { name: 'Where next?' });
  await page.getByRole('link', { name: 'Then choose your next step' }).click();
  await expect(page).toHaveURL(/#next-steps$/);
  await expect(paths.getByRole('link')).toHaveCount(3);
  await expect(paths.getByRole('link', { name: /Make it your own/ })).toHaveAttribute(
    'href',
    '/playground',
  );
  await expect(paths.getByRole('link', { name: /Play Starfall/ })).toHaveAttribute(
    'href',
    '/arcade',
  );
  await expect(paths.getByRole('link', { name: /Add it to your app/ })).toHaveAttribute(
    'href',
    '/setup',
  );
  const packages = page.getByRole('link', { name: /achievements-engine/ });
  await expect(packages).toBeHidden();
  const summary = page.locator('.overview-packages summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(packages).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(packages).toBeHidden();
  await paths.getByRole('link', { name: /Play Starfall/ }).click();
  await expect(page).toHaveURL(/\/arcade$/);
  await expect(page.getByRole('button', { name: 'Start mission', exact: true })).toBeVisible();
});

test('grouped navigation stays accessible and the mobile menu closes after navigation', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const mobile = testInfo.project.name === 'mobile';
  const menu = page.locator('.mobile-menu-button');
  if (mobile) {
    await expect(nav).toBeHidden();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
  } else {
    await expect(menu).toBeHidden();
  }
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link')).toHaveCount(6);
  await expect(nav.getByRole('link', { name: 'Overview', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByText('Try it', { exact: true })).toBeVisible();
  await expect(nav.getByText('Build with it', { exact: true })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  if (mobile) {
    await nav.getByRole('link', { name: 'Short course', exact: true }).focus();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(nav).toBeHidden();
    await menu.click();
  }
  await nav.getByRole('link', { name: 'Short course', exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  if (mobile) {
    await expect(nav).toBeHidden();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
  }
  await expect(nav.getByRole('link', { name: 'Short course', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await nav.getByRole('link', { name: 'How it works', exact: true }).click();
  await expect(page).toHaveURL(/\/architecture$/);
  if (mobile) {
    await expect(nav).toBeHidden();
    await menu.click();
    await nav.getByRole('link', { name: 'How it works', exact: true }).click();
    await expect(nav).toBeHidden();
    // A closed phone menu must not hide navigation after widening the window.
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(nav).toBeVisible();
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
});
