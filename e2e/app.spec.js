import { test, expect } from '@playwright/test';

test.describe('SSH Client Application', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the application to load - check for landing page
    await expect(page.getByRole('heading', { name: 'Modern SSH Client' })).toBeVisible();
  });

  test('should display sidebar with hosts', async ({ page }) => {
    await page.goto('/');
    
    // Check sidebar elements - use data-testid for sidebar
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.locator('text=Production Server')).toBeVisible();
    await expect(page.locator('text=Staging DB')).toBeVisible();
    await expect(page.locator('button:has-text("New Connection")')).toBeVisible();
  });

  test('should show landing page by default', async ({ page }) => {
    await page.goto('/');
    
    // Check for landing page elements
    await expect(page.getByRole('heading', { name: 'Modern SSH Client' })).toBeVisible();
    await expect(page.getByText('Select a host from the sidebar to start a session')).toBeVisible();
  });

  test('should switch to terminal view when host is selected', async ({ page }) => {
    await page.goto('/');
    
    // Click on Production Server
    await page.locator('text=Production Server').first().click();
    
    // Wait for terminal to appear
    await page.waitForTimeout(1000);
    
    // Check that landing page is gone and terminal is present
    await expect(page.getByRole('heading', { name: 'Modern SSH Client' })).not.toBeVisible();
  });

  test('should show new connection form when New Connection is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click New Connection
    await page.locator('button:has-text("New Connection")').click();
    
    // Should show the form
    await expect(page.getByTestId('host-manager')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New Connection' })).toBeVisible();
    await expect(page.locator('input[placeholder="Production Server"]')).toBeVisible();
  });

  test('should be able to fill in connection form', async ({ page }) => {
    await page.goto('/');
    
    // Click New Connection first
    await page.locator('button:has-text("New Connection")').click();
    
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

  test('should save new host and return to landing page', async ({ page }) => {
    await page.goto('/');
    
    // Click New Connection
    await page.locator('button:has-text("New Connection")').click();
    
    // Fill in the form
    await page.locator('input[placeholder="Production Server"]').fill('E2E Test Server');
    await page.locator('input[placeholder="192.168.1.1"]').fill('192.168.1.100');
    await page.locator('input[placeholder="root"]').fill('testuser');
    
    // Submit the form
    await page.locator('button:has-text("Save Host")').click();
    
    // Should return to landing page
    await expect(page.getByRole('heading', { name: 'Modern SSH Client' })).toBeVisible();
    
    // New host should appear in sidebar
    await expect(page.locator('text=E2E Test Server')).toBeVisible();
  });
});
