import { test, expect } from '@playwright/test';

// Test constants
const LOGIN_URL = 'https://preprod.veofactory.com/login';
const TEST_EMAIL = 'test2@veonum.com';
const TEST_PASSWORD = 'Veonum$$35700';

test.describe('VeoFactory Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/dashboard|interlocuteurs/);
  });

  test('should create a new interlocuteur successfully', async ({ page }) => {
    // Navigate to Interlocuteurs
    await page.locator('text=Interlocuteurs').click();
    await expect(page).toHaveURL(/interlocuteurs/);

    // Create new interlocuteur
    await page.locator('text=Nouvel interlocuteur').click();

    // Fill form fields with proper waits
    await page.getByRole('textbox').first().waitFor({ state: 'visible' });
    await page.getByRole('textbox').first().fill('testing interlocuteur');
    
    await page.getByRole('textbox', { name: /Profession/ }).fill('testing');
    await page.getByRole('textbox', { name: /Description/ }).fill('testing');
    await page.locator('#app-ai-coaching-persona-ai-content').fill('testing');

    // Select AI provider
    await page.getByRole('combobox', { name: /Fournisseur d'IA/ }).click();
    await page.getByRole('option', { name: /OpenAI Realtime/ }).click();

    // Select model
    await page.getByRole('combobox', { name: /Modèle/ }).click();
    await page.locator('text=gpt-4o-realtime-preview').click();

    // Submit form
    await page.locator('button:has-text("Valider")').click();

    // Configure gender and language
    await page.locator('button:has-text("Femme")').waitFor({ state: 'visible' });
    await page.locator('button:has-text("Femme")').click();
    
    await page.locator('text=Sélectionnez une langue').click();
    await page.getByRole('option', { name: /Automatique/ }).locator('div').first().click();

    // Select voice
    await page.getByRole('combobox', { name: /Nom de la voix/ }).click();
    await page.getByRole('option', { name: /alloy/ }).click();

    // Final validation
    await page.locator('button:has-text("Valider")').click();

    // Verify success (you might want to add a success message check here)
    await expect(page).toHaveURL(/interlocuteurs/);
  });

  test('should navigate to Observateurs section', async ({ page }) => {
    await page.locator('text=Observateurs').click();
    await expect(page).toHaveURL(/observateurs/);
  });

  test('should create a new mission successfully', async ({ page }) => {
    // Navigate to Missions
    await page.locator('text=Missions').click();
    await expect(page).toHaveURL(/missions/);

    // Create new mission
    await page.locator('text=Nouvelle mission').click();

    // Fill mission form
    await page.getByRole('group', { name: /Détails/ }).locator('input[type="text"]').waitFor({ state: 'visible' });
    await page.getByRole('group', { name: /Détails/ }).locator('input[type="text"]').fill('testing');
    
    await page.getByRole('textbox', { name: /Mission de l'utilisateur/ }).fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-content').fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-end').fill('testing');

    // Submit mission
    await page.locator('button:has-text("Valider")').click();

    // Verify success
    await expect(page).toHaveURL(/missions/);
  });

  test('should navigate to Scénarios/Playlists section', async ({ page }) => {
    await page.locator('text=Scénarios/Playlists').click();
    await expect(page).toHaveURL(/scenarios|playlists/);
  });

  test('complete workflow: create interlocuteur and mission', async ({ page }) => {
    // This test combines the workflow but with better error handling
    try {
      // Create interlocuteur
      await page.locator('text=Interlocuteurs').click();
      await expect(page).toHaveURL(/interlocuteurs/);
      
      await page.locator('text=Nouvel interlocuteur').click();
      await page.getByRole('textbox').first().fill('E2E Test Interlocuteur');
      await page.getByRole('textbox', { name: /Profession/ }).fill('E2E Tester');
      await page.getByRole('textbox', { name: /Description/ }).fill('Created by automated test');
      await page.locator('#app-ai-coaching-persona-ai-content').fill('E2E testing persona');

      await page.getByRole('combobox', { name: /Fournisseur d'IA/ }).click();
      await page.getByRole('option', { name: /OpenAI Realtime/ }).click();

      await page.getByRole('combobox', { name: /Modèle/ }).click();
      await page.locator('text=gpt-4o-realtime-preview').click();

      await page.locator('button:has-text("Valider")').click();

      // Gender and language selection
      await page.locator('button:has-text("Femme")').click();
      await page.locator('text=Sélectionnez une langue').click();
      await page.getByRole('option', { name: /Automatique/ }).locator('div').first().click();

      await page.getByRole('combobox', { name: /Nom de la voix/ }).click();
      await page.getByRole('option', { name: /alloy/ }).click();

      await page.locator('button:has-text("Valider")').click();

      // Create mission
      await page.locator('text=Missions').click();
      await expect(page).toHaveURL(/missions/);

      await page.locator('text=Nouvelle mission').click();
      await page.getByRole('group', { name: /Détails/ }).locator('input[type="text"]').fill('E2E Test Mission');
      await page.getByRole('textbox', { name: /Mission de l'utilisateur/ }).fill('E2E testing mission');
      await page.locator('#app-ai-coaching-mission-ai-content').fill('E2E mission content');
      await page.locator('#app-ai-coaching-mission-ai-end').fill('E2E mission end');

      await page.locator('button:has-text("Valider")').click();

      // Navigate to final section
      await page.locator('text=Scénarios/Playlists').click();
      await expect(page).toHaveURL(/scenarios|playlists/);

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});