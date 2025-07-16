import { test, expect } from '@playwright/test';

test('Quick fix: Click Nouvel interlocuteur button', async ({ page }) => {
  // Login
  await page.goto('https://preprod.veofactory.com/login');
  await page.fill('input[type="email"]', 'test2@veonum.com');
  await page.fill('input[type="password"]', 'Veonum$$35700');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/dashboard|interlocuteurs/);

  // Navigate to Interlocuteurs 
  await page.locator('text=Interlocuteurs').click();
  await expect(page).toHaveURL(/interlocuteurs/);

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Try the most likely approaches for the button
  console.log('Looking for Nouvel interlocuteur button...');

  // Method 1: Button with exact text
  const button1 = page.locator('button:has-text("Nouvel interlocuteur")');
  if (await button1.isVisible()) {
    await button1.click();
    console.log('✅ Clicked with button:has-text');
    return;
  }

  // Method 2: Role-based with case insensitive
  const button2 = page.getByRole('button', { name: /nouvel interlocuteur/i });
  if (await button2.isVisible()) {
    await button2.click();
    console.log('✅ Clicked with getByRole');
    return;
  }

  // Method 3: Any clickable element with the text
  const button3 = page.locator('*:has-text("Nouvel interlocuteur")').first();
  if (await button3.isVisible()) {
    await button3.click();
    console.log('✅ Clicked with *:has-text');
    return;
  }

  // Method 4: Button containing "Nouvel"
  const button4 = page.locator('button', { hasText: 'Nouvel' });
  if (await button4.isVisible()) {
    await button4.click();
    console.log('✅ Clicked with button hasText Nouvel');
    return;
  }

  // Method 5: Look for common button classes/selectors
  const commonSelectors = [
    'button[class*="btn"]',
    'a[class*="btn"]', 
    '.btn',
    'button[class*="button"]',
    '[role="button"]'
  ];

  for (const selector of commonSelectors) {
    const elements = await page.locator(selector).all();
    for (const element of elements) {
      const text = await element.textContent();
      if (text?.includes('Nouvel interlocuteur')) {
        await element.click();
        console.log(`✅ Clicked with selector: ${selector}`);
        return;
      }
    }
  }

  throw new Error('Could not find Nouvel interlocuteur button');
});