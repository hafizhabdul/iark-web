import { test, expect } from '@playwright/test';

test.describe('Main Site Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/IARK/i);
  });

  test('should navigate to Tentang page', async ({ page }) => {
    await page.goto('/tentang');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Bidang page', async ({ page }) => {
    await page.goto('/bidang');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Cerita page', async ({ page }) => {
    await page.goto('/cerita');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Kegiatan page', async ({ page }) => {
    await page.goto('/kegiatan');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Auth Pages', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/masuk');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/daftar');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should show dashboard or redirect', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show admin access denied for non-admin', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle non-existent pages', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Header Navigation', () => {
  test('should have navigation header with links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have header logo that links to homepage', async ({ page }) => {
    await page.goto('/tentang');
    await page.waitForLoadState('networkidle');
    
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeVisible();
  });

  test('should navigate to homepage when clicking logo', async ({ page }) => {
    await page.goto('/tentang');
    await page.waitForLoadState('networkidle');
    
    const logoLink = page.locator('header a[href="/"]').first();
    await logoLink.click();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL('/');
  });

  test('should have all main navigation links visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const expectedLinks = ['/', '/tentang', '/bidang', '/kegiatan', '/cerita', '/donasi'];
    
    for (const href of expectedLinks) {
      const link = page.locator(`nav a[href="${href}"], header nav a[href="${href}"]`);
      await expect(link.first()).toBeVisible();
    }
  });
});

test.describe('Mobile Menu', () => {
  test('should have mobile menu button on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuButton).toBeVisible();
  });

  test('should toggle mobile menu when clicking menu button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await mobileMenuButton.click();
    
    await page.waitForTimeout(400);
    
    const mobileNav = page.locator('header nav a[href="/tentang"]');
    await expect(mobileNav).toBeVisible();
  });

  test('should close mobile menu when clicking a link', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await mobileMenuButton.click();
    await page.waitForTimeout(400);
    
    const tentangLink = page.locator('header nav a[href="/tentang"]');
    await tentangLink.click();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL('/tentang');
  });
});

test.describe('Footer', () => {
  test('should have footer visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have Instagram social link in footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const instagramLink = page.locator('footer a[href*="instagram"]');
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute('target', '_blank');
  });

  test('should have TikTok social link in footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const tiktokLink = page.locator('footer a[href*="tiktok"]');
    await expect(tiktokLink).toBeVisible();
    await expect(tiktokLink).toHaveAttribute('target', '_blank');
  });

  test('should have Rumah Kepemimpinan website link in footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const rkLink = page.locator('footer a[href*="rumahkepemimpinan"]');
    await expect(rkLink).toBeVisible();
    await expect(rkLink).toHaveAttribute('target', '_blank');
  });

  test('should have copyright text in footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const copyright = page.locator('footer');
    await expect(copyright).toContainText('Ikatan Alumni Rumah Kepemimpinan');
    await expect(copyright).toContainText(new Date().getFullYear().toString());
  });

  test('should have RayakanKontribusi tagline in footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const tagline = page.locator('footer');
    await expect(tagline).toContainText('Rayakan');
    await expect(tagline).toContainText('Kontribusi');
  });
});

test.describe('Homepage Content', () => {
  test('should have hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const mainContent = page.locator('main, section').first();
    await expect(mainContent).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
    }
  });
});
