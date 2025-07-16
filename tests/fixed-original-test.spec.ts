import { test, expect } from '@playwright/test';

// Quick fix helper function
async function clickElementWithMultipleTexts(page: any, texts: string[]) {
  for (const text of texts) {
    try {
      const element = page.locator(`text=${text}`);
      if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
        await element.click();
        return;
      }
    } catch (error) {
      console.log(`Text "${text}" not found, trying next...`);
    }
  }
  throw new Error(`None of these texts found: ${texts.join(', ')}`);
}

test.describe('Fixed Original Test', () => {
  test('Login, create interlocuteur & mission, navigate scenarios/playlists', async ({ page }) => {
    // 🔷 Go to login page
    await page.goto('https://preprod.veofactory.com/login');

    // 2. Fill in login credentials
    await page.fill('input[type="email"]', 'test2@veonum.com');
    await page.fill('input[type="password"]', 'Veonum$$35700');

    // 3. Click login (submit button)
    await page.locator('button[type="submit"]').click();

    // 🔷 Wait for dashboard/home to load
    await expect(page).toHaveURL(/dashboard|interlocuteurs/);

    // 🔷 Navigate to Interlocuteurs (handle multiple languages)
    await clickElementWithMultipleTexts(page, ['Interlocuteurs', 'Interlocutors', 'Speakers']);
    await expect(page).toHaveURL(/interlocuteurs/);

    // 🔷 Create a new interlocuteur
    await clickElementWithMultipleTexts(page, ['Nouvel interlocuteur', 'New Interlocutor', 'New Speaker']);

    await page.getByRole('textbox').first().fill('testing interlocuteur');
    await page.getByRole('textbox', { name: /Profession/i }).fill('testing');
    await page.getByRole('textbox', { name: /Description/i }).fill('testing');
    await page.locator('#app-ai-coaching-persona-ai-content').fill('testing');

    await page.getByRole('combobox', { name: /Fournisseur d'IA|AI Provider/i }).click();
    await page.getByRole('option', { name: /OpenAI Realtime/i }).click();

    await page.getByRole('combobox', { name: /Modèle|Model/i }).click();
    await page.locator('text=gpt-4o-realtime-preview').click();

    await clickElementWithMultipleTexts(page, ['Valider', 'Validate', 'Submit', 'Confirm']);

    // 🔷 Select gender & language
    await clickElementWithMultipleTexts(page, ['Femme', 'Female', 'Woman']);
    await clickElementWithMultipleTexts(page, ['Sélectionnez une langue', 'Select a language', 'Choose a language']);
    await page.getByRole('option', { name: /Automatique|Automatic/i }).locator('div').first().click();

    await page.getByRole('combobox', { name: /Nom de la voix|Voice Name|Voice/i }).click();
    await page.getByRole('option', { name: /alloy/i }).click();

    await clickElementWithMultipleTexts(page, ['Valider', 'Validate', 'Submit', 'Confirm']);

    // 🔷 Navigate to Observateurs
    await clickElementWithMultipleTexts(page, ['Observateurs', 'Observers']);
    await expect(page).toHaveURL(/observateurs/);

    // 🔷 Navigate to Missions
    await clickElementWithMultipleTexts(page, ['Missions', 'Missions']);
    await expect(page).toHaveURL(/missions/);

    // 🔷 Create a new mission
    await clickElementWithMultipleTexts(page, ['Nouvelle mission', 'New Mission']);
    await page.getByRole('group', { name: /Détails|Details/i }).locator('input[type="text"]').fill('testing');
    await page.getByRole('textbox', { name: /Mission de l'utilisateur|User Mission/i }).fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-content').fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-end').fill('testing');

    await clickElementWithMultipleTexts(page, ['Valider', 'Validate', 'Submit', 'Confirm']);

    // 🔷 Navigate to Scénarios/Playlists
    await clickElementWithMultipleTexts(page, ['Scénarios/Playlists', 'Scenarios/Playlists']);
    await expect(page).toHaveURL(/scenarios|playlists/);
  });
});