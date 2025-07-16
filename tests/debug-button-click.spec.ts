import { test, expect } from '@playwright/test';

test('Debug: Find and click Nouvel interlocuteur button', async ({ page }) => {
  // Login first
  await page.goto('https://preprod.veofactory.com/login');
  await page.fill('input[type="email"]', 'test2@veonum.com');
  await page.fill('input[type="password"]', 'Veonum$$35700');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/dashboard|interlocuteurs/);

  // Navigate to Interlocuteurs 
  await page.locator('text=Interlocuteurs').click();
  await expect(page).toHaveURL(/interlocuteurs/);

  // Try different ways to find the "Nouvel interlocuteur" button
  console.log('Trying different selectors for Nouvel interlocuteur button...');

  // Method 1: Try exact button text
  try {
    await page.locator('button:has-text("Nouvel interlocuteur")').click({ timeout: 5000 });
    console.log('✅ Method 1 worked: button:has-text("Nouvel interlocuteur")');
    return;
  } catch (error) {
    console.log('❌ Method 1 failed');
  }

  // Method 2: Try partial text match
  try {
    await page.locator('button', { hasText: 'Nouvel' }).click({ timeout: 5000 });
    console.log('✅ Method 2 worked: button with hasText Nouvel');
    return;
  } catch (error) {
    console.log('❌ Method 2 failed');
  }

  // Method 3: Try any element with text
  try {
    await page.locator('*:has-text("Nouvel interlocuteur")').click({ timeout: 5000 });
    console.log('✅ Method 3 worked: *:has-text("Nouvel interlocuteur")');
    return;
  } catch (error) {
    console.log('❌ Method 3 failed');
  }

  // Method 4: Try by aria-label or title
  try {
    await page.locator('[aria-label*="Nouvel"], [title*="Nouvel"]').click({ timeout: 5000 });
    console.log('✅ Method 4 worked: aria-label or title');
    return;
  } catch (error) {
    console.log('❌ Method 4 failed');
  }

  // Method 5: Try by data-testid or class containing "new" or "add"
  try {
    await page.locator('[data-testid*="new"], [class*="add"], [class*="new"]').click({ timeout: 5000 });
    console.log('✅ Method 5 worked: data-testid or class');
    return;
  } catch (error) {
    console.log('❌ Method 5 failed');
  }

  // Method 6: Try to find by position (top-right button)
  try {
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on page`);
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`Button ${i}: "${text}"`);
      if (text?.includes('Nouvel') || text?.includes('interlocuteur')) {
        await buttons[i].click();
        console.log(`✅ Method 6 worked: Found button at index ${i}`);
        return;
      }
    }
  } catch (error) {
    console.log('❌ Method 6 failed');
  }

  // Method 7: Try role-based approach
  try {
    await page.getByRole('button', { name: /nouvel/i }).click({ timeout: 5000 });
    console.log('✅ Method 7 worked: getByRole with name nouvel');
    return;
  } catch (error) {
    console.log('❌ Method 7 failed');
  }

  // Method 8: Try CSS selector approach
  try {
    await page.locator('button.btn, a.btn, .btn').filter({ hasText: 'Nouvel' }).click({ timeout: 5000 });
    console.log('✅ Method 8 worked: CSS selector with filter');
    return;
  } catch (error) {
    console.log('❌ Method 8 failed');
  }

  // Debug: Get page HTML to see what's available
  const html = await page.content();
  console.log('Page HTML around buttons:', html.substring(html.indexOf('Nouvel') - 200, html.indexOf('Nouvel') + 200));

  // Take screenshot for debugging
  await page.screenshot({ path: 'debug-nouvel-interlocuteur.png' });
  
  throw new Error('Could not find or click the Nouvel interlocuteur button with any method');
});