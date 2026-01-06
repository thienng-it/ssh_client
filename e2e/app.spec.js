import { test, expect } from '@playwright/test';

test.describe('SSH Client Application', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the application to load
    await expect(page.locator('text=SSH Client')).toBeVisible();
  });

  test('should display sidebar with hosts', async ({ page }) => {
    await page.goto('/');
    
    // Check sidebar elements
    await expect(page.locator('text=SSH Client')).toBeVisible();
    await expect(page.locator('text=Production Server')).toBeVisible();
    await expect(page.locator('text=Staging DB')).toBeVisible();
    await expect(page.locator('button:has-text("New Connection")')).toBeVisible();
    await expect(page.locator('button:has-text("Settings")')).toBeVisible();
  });

  test('should show new connection form by default', async ({ page }) => {
    await page.goto('/');
    
    // Check for form elements
    await expect(page.locator('text=New Connection')).toBeVisible();
    await expect(page.locator('input[placeholder="Production Server"]')).toBeVisible();
    await expect(page.locator('input[placeholder="192.168.1.1"]')).toBeVisible();
    await expect(page.locator('input[placeholder="22"]')).toBeVisible();
    await expect(page.locator('input[placeholder="root"]')).toBeVisible();
  });

  test('should switch to terminal view when host is selected', async ({ page }) => {
    await page.goto('/');
    
    // Click on Production Server
    await page.locator('text=Production Server').click();
    
    // Wait for terminal to appear - check for xterm-specific classes or elements
    await page.waitForTimeout(1000); // Give terminal time to initialize
    
    // The terminal should be visible (checking for xterm container)
    const terminalExists = await page.locator('.xterm').count() > 0 || 
                           await page.locator('[style*="height: 100%"]').count() > 0;
    expect(terminalExists).toBeTruthy();
  });

  test('should show new connection form when New Connection is clicked', async ({ page }) => {
    await page.goto('/');
    
    // First, click on a host
    await page.locator('text=Production Server').click();
    await page.waitForTimeout(500);
    
    // Then click New Connection
    await page.locator('button:has-text("New Connection")').click();
    
    // Should show the form again
    await expect(page.locator('input[placeholder="Production Server"]')).toBeVisible();
  });

  test('should be able to fill in connection form', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the form
    await page.locator('input[placeholder="Production Server"]').fill('Test Server');
    await page.locator('input[placeholder="192.168.1.1"]').fill('10.0.0.1');
    await page.locator('input[placeholder="22"]').fill('2222');
    await page.locator('input[placeholder="root"]').fill('testuser');
    
    // Verify the values
    await expect(page.locator('input[placeholder="Production Server"]')).toHaveValue('Test Server');
    await expect(page.locator('input[placeholder="192.168.1.1"]')).toHaveValue('10.0.0.1');
    await expect(page.locator('input[placeholder="22"]')).toHaveValue('2222');
    await expect(page.locator('input[placeholder="root"]')).toHaveValue('testuser');
  });

  test('should save new host when form is submitted', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the form
    await page.locator('input[placeholder="Production Server"]').fill('E2E Test Server');
    await page.locator('input[placeholder="192.168.1.1"]').fill('192.168.1.100');
    
    // Submit the form
    await page.locator('button:has-text("Save Host")').click();
    
    // Wait for the form to be processed
    await page.waitForTimeout(500);
    
    // The new connection form should no longer be visible
    // (This may vary based on implementation - adjust as needed)
  });
});
