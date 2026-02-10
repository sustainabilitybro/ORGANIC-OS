/**
 * End-to-End Tests with Playwright

Test critical user flows:
- Dashboard loading
- Wellness check-in
- Module navigation
- AI chat interaction
*/
import { test, expect, describe } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

describe('Dashboard', () => {
  test('should load dashboard successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveTitle(/Dashboard|Organic OS/);
    await expect(page.locator('main, [role="main"], .dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('should display wellness widget', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    const wellnessWidget = page.locator('text=Mood, Wellness, Check-in').first();
    await expect(wellnessWidget).toBeVisible({ timeout: 5000 });
  });

  test('should show habit tracking', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=Habits, Streak').first()).toBeVisible({ timeout: 5000 });
  });
});

describe('Wellness Check-in', () => {
  test('should open check-in modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    const checkInButton = page.locator('button:has-text("Check"), button:has-text("Check-in")').first();
    await checkInButton.click();
    await expect(page.locator('dialog, [role="dialog"], .modal').first()).toBeVisible({ timeout: 5000 });
  });

  test('should submit mood rating', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    const moodButton = page.locator('button[data-value="4"], button:has-text("4")').first();
    if (await moodButton.isVisible()) {
      await moodButton.click();
    }
  });
});

describe('Modules', () => {
  test('should load modules page', async ({ page }) => {
    await page.goto(`${BASE_URL}/modules`);
    await expect(page.locator('h1:has-text("Modules")').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to identity module', async ({ page }) => {
    await page.goto(`${BASE_URL}/modules`);
    const identityModule = page.locator('a[href*="identity"], text=Identity').first();
    await identityModule.click();
    await expect(page).toHaveURL(/identity|modules/);
  });

  test('should display emotional module', async ({ page }) => {
    await page.goto(`${BASE_URL}/modules/emotional`);
    await expect(page.locator('h1:has-text("Emotional")').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show wellness module', async ({ page }) => {
    await page.goto(`${BASE_URL}/modules/wellness`);
    await expect(page.locator('h1:has-text("Wellness")').first()).toBeVisible({ timeout: 5000 });
  });
});

describe('AI Chat', () => {
  test('should open AI chat', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    const chatButton = page.locator('button:has-text("Chat"), [data-testid="chat-open"]').first();
    await chatButton.click();
    await expect(page.locator('[data-testid="chat"], .chat-interface').first()).toBeVisible({ timeout: 5000 });
  });

  test('should send message to AI', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    const chatInput = page.locator('input[placeholder*="Message"], textarea[placeholder*="Ask"]').first();
    if (await chatInput.isVisible()) {
      await chatInput.fill('Hello, I need advice');
      await page.locator('button:has-text("Send")').first().click();
    }
  });
});

describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('[role="main"], main').first()).toBeVisible();
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').element();
    expect(focusedElement).toBeTruthy();
  });
});

describe('Mobile Responsiveness', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('h1, main').first()).toBeVisible({ timeout: 10000 });
  });

  test('should have touch-friendly targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/dashboard`);
    const buttons = page.locator('button').all();
    let hasSmallButton = false;
    for (const button of buttons.slice(0, 10)) {
      const box = await button.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        hasSmallButton = true;
        break;
      }
    }
    expect(hasSmallButton).toBe(false);
  });
});
