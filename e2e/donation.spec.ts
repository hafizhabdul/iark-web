import { test, expect } from '@playwright/test';

test.describe('Donation Links on Homepage', () => {
  test('should have donation link on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const donationLinks = page.locator('a[href*="donasi"]');
    const count = await donationLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have donasi link in navigation header', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const donasiNavLink = page.locator('nav a[href="/donasi"], header a[href="/donasi"]');
    await expect(donasiNavLink.first()).toBeVisible();
  });
});

test.describe('Donors Wall Page', () => {
  test('should load donors page', async ({ page }) => {
    await page.goto('/donasi/donors');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display Wall of Fame heading', async ({ page }) => {
    await page.goto('/donasi/donors');
    await page.waitForLoadState('networkidle');
    
    const heading = page.locator('h1:has-text("Wall of Fame")');
    await expect(heading).toBeVisible();
  });

  test('should have back link to donasi page', async ({ page }) => {
    await page.goto('/donasi/donors');
    await page.waitForLoadState('networkidle');
    
    const backLink = page.locator('a[href="/donasi"]');
    await expect(backLink.first()).toBeVisible();
  });

  test('should display donor statistics', async ({ page }) => {
    await page.goto('/donasi/donors');
    await page.waitForLoadState('networkidle');
    
    const donorStats = page.locator('text=/Donatur/');
    await expect(donorStats.first()).toBeVisible();
  });
});

test.describe('Donation Checkout Page', () => {
  test('should load checkout page', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display donation form header', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    const heading = page.locator('h1:has-text("Donasi")');
    await expect(heading).toBeVisible();
  });

  test('should have donation amount buttons', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    const amountButton = page.locator('button:has-text("Rp")');
    const count = await amountButton.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should have donor information form fields', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should have custom amount input field', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    const customInput = page.locator('input[placeholder="0"]');
    await expect(customInput).toBeVisible();
  });

  test('should have back link to donasi page', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    const backLink = page.locator('a[href="/donasi"]');
    await expect(backLink).toBeVisible();
  });

  test('should have anonymous checkbox', async ({ page }) => {
    await page.goto('/donasi/checkout');
    await page.waitForLoadState('networkidle');
    
    const anonymousCheckbox = page.locator('input[name="isAnonymous"]');
    await expect(anonymousCheckbox).toBeVisible();
  });

  test('should handle amount query param', async ({ page }) => {
    await page.goto('/donasi/checkout?amount=250000');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Donation Success Page', () => {
  test('should display success page structure', async ({ page }) => {
    await page.goto('/donasi/success');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle missing order_id gracefully', async ({ page }) => {
    await page.goto('/donasi/success');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle success page with order_id param', async ({ page }) => {
    await page.goto('/donasi/success?order_id=test-123');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle success page with status param', async ({ page }) => {
    await page.goto('/donasi/success?order_id=test-123&status=success');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Donation Main Page', () => {
  test('should handle /donasi page gracefully', async ({ page }) => {
    const response = await page.goto('/donasi');
    
    if (response) {
      const status = response.status();
      expect([200, 301, 302, 307, 308]).toContain(status);
    }
    
    await expect(page.locator('body')).toBeVisible();
  });
});
