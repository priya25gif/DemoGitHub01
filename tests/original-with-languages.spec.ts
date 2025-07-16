import { test, expect } from '@playwright/test';

// Helper function to click elements with multiple language options
async function clickMultiLanguage(page: any, texts: string[]) {
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

  // 🔷 Navigate to Interlocuteurs (French/English)
  await clickMultiLanguage(page, ['Interlocuteurs', 'Interlocutors', 'Speakers']);
  await expect(page).toHaveURL(/interlocuteurs/);

  // 🔷 Create a new interlocuteur (French/English)
  await clickMultiLanguage(page, ['Nouvel interlocuteur', 'New Interlocutor', 'New Speaker']);

  await page.getByRole('textbox').first().fill('testing interlocuteur');
  await page.getByRole('textbox', { name: /Profession/i }).fill('testing');
  await page.getByRole('textbox', { name: /Description/i }).fill('testing');
  await page.locator('#app-ai-coaching-persona-ai-content').fill('testing');

  await page.getByRole('combobox', { name: /Fournisseur d'IA|AI Provider/i }).click();
  await page.getByRole('option', { name: /OpenAI Realtime/i }).click();

  await page.getByRole('combobox', { name: /Modèle|Model/i }).click();
  await page.locator('text=gpt-4o-realtime-preview').click();

  await clickMultiLanguage(page, ['Valider', 'Validate', 'Submit', 'Confirm']);

  // 🔷 Select gender & language (French/English)
  await clickMultiLanguage(page, ['Femme', 'Female', 'Woman']);
  await clickMultiLanguage(page, ['Sélectionnez une langue', 'Select a language', 'Choose a language']);
  await page.getByRole('option', { name: /Automatique|Automatic/i }).locator('div').first().click();

  await page.getByRole('combobox', { name: /Nom de la voix|Voice Name|Voice/i }).click();
  await page.getByRole('option', { name: /alloy/i }).click();

  await clickMultiLanguage(page, ['Valider', 'Validate', 'Submit', 'Confirm']);

  // 🔷 Navigate to Observateurs (French/English)
  await clickMultiLanguage(page, ['Observateurs', 'Observers']);
  await expect(page).toHaveURL(/observateurs/);

  // 🔷 Navigate to Missions (French/English)
  await clickMultiLanguage(page, ['Missions', 'Missions']);
  await expect(page).toHaveURL(/missions/);

  // 🔷 Create a new mission (French/English)
  await clickMultiLanguage(page, ['Nouvelle mission', 'New Mission']);
  await page.getByRole('group', { name: /Détails|Details/i }).locator('input[type="text"]').fill('testing');
  await page.getByRole('textbox', { name: /Mission de l'utilisateur|User Mission/i }).fill('testing');
  await page.locator('#app-ai-coaching-mission-ai-content').fill('testing');
  await page.locator('#app-ai-coaching-mission-ai-end').fill('testing');

  await clickMultiLanguage(page, ['Valider', 'Validate', 'Submit', 'Confirm']);

  // 🔷 Navigate to Scénarios/Playlists (French/English)
  await clickMultiLanguage(page, ['Scénarios/Playlists', 'Scenarios/Playlists']);
  await expect(page).toHaveURL(/scenarios|playlists/);
});