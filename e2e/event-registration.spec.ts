import { test, expect } from '@playwright/test';

test.describe('Event Links on Homepage', () => {
  test('should have event-related links on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const eventLinks = page.locator('a[href*="event"], a[href*="kegiatan"]');
    const count = await eventLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have kegiatan link in navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const kegiatanNavLink = page.locator('nav a[href="/kegiatan"], header a[href="/kegiatan"]');
    await expect(kegiatanNavLink.first()).toBeVisible();
  });
});

test.describe('Kegiatan Archive Page', () => {
  test('should display kegiatan page with hero section', async ({ page }) => {
    await page.goto('/kegiatan');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Kegiatan');
  });

  test('should have search input on kegiatan page', async ({ page }) => {
    await page.goto('/kegiatan');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[placeholder*="Cari"]');
    await expect(searchInput).toBeVisible();
  });

  test('should have filter buttons for categories', async ({ page }) => {
    await page.goto('/kegiatan');
    await page.waitForLoadState('networkidle');
    
    const semua = page.locator('button:has-text("Semua")');
    await expect(semua).toBeVisible();
  });

  test('should display activity count', async ({ page }) => {
    await page.goto('/kegiatan');
    await page.waitForLoadState('networkidle');
    
    const countText = page.locator('text=/Menampilkan.*dari/');
    await expect(countText).toBeVisible();
  });

  test('should allow searching activities', async ({ page }) => {
    await page.goto('/kegiatan');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[placeholder*="Cari"]');
    await searchInput.fill('test');
    
    await expect(searchInput).toHaveValue('test');
  });
});

test.describe('Event Detail Page', () => {
  test('should handle event slug route gracefully', async ({ page }) => {
    await page.goto('/event/test-event');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle my-events page', async ({ page }) => {
    await page.goto('/event/my-events');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle event registration page route', async ({ page }) => {
    await page.goto('/event/register/test-event');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Event Page Main Route', () => {
  test('should handle /event page gracefully', async ({ page }) => {
    const response = await page.goto('/event');
    
    if (response) {
      const status = response.status();
      expect([200, 301, 302, 307, 308]).toContain(status);
    }
    
    await expect(page.locator('body')).toBeVisible();
  });
});
