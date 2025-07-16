import { test, expect } from '@playwright/test';

test.describe('Login and Navigation Tests', () => {
  test('Login, create interlocuteur & mission, navigate scenarios/playlists', async ({ page }) => {
    // 🔷 Go to login page
    await page.goto('https://preprod.veofactory.com/login');

    // 2. Fill in login credentials
    await page.fill('input[type="email"]', 'test2@veonum.com');
    await page.fill('input[type="password"]', 'Veonum$$35700');
    //await page.locator('#pv_id_0_12').fill('Veonum$$35700');

    // 3. Click login (submit button)
    await page.locator('button[type="submit"]').click();

    // 🔷 Wait for dashboard/home to load
    await expect(page).toHaveURL(/dashboard|interlocuteurs/);

    // 🔷 Navigate to Interlocuteurs
    await page.locator('text=Interlocuteurs').click();
    await expect(page).toHaveURL(/interlocuteurs/);

    // 🔷 Create a new interlocuteur
    await page.locator('text=Nouvel interlocuteur').click();

    await page.getByRole('textbox').first().fill('testing interlocuteur');
    await page.getByRole('textbox', { name: /Profession/ }).fill('testing');
    await page.getByRole('textbox', { name: /Description/ }).fill('testing');
    await page.locator('#app-ai-coaching-persona-ai-content').fill('testing');

    await page.getByRole('combobox', { name: /Fournisseur d'IA/ }).click();
    await page.getByRole('option', { name: /OpenAI Realtime/ }).click();

    await page.getByRole('combobox', { name: /Modèle/ }).click();
    await page.locator('text=gpt-4o-realtime-preview').click();

    await page.locator('button:has-text("Valider")').click();

    // 🔷 Select gender & language
    await page.locator('button:has-text("Femme")').click();
    await page.locator('text=Sélectionnez une langue').click();
    await page.getByRole('option', { name: /Automatique/ }).locator('div').first().click();

    await page.getByRole('combobox', { name: /Nom de la voix/ }).click();
    await page.getByRole('option', { name: /alloy/ }).click();

    await page.locator('button:has-text("Valider")').click();

    // 🔷 Navigate to Observateurs
    await page.locator('text=Observateurs').click();
    await expect(page).toHaveURL(/observateurs/);

    // 🔷 Navigate to Missions
    await page.locator('text=Missions').click();
    await expect(page).toHaveURL(/missions/);

    // 🔷 Create a new mission
    await page.locator('text=Nouvelle mission').click();
    await page.getByRole('group', { name: /Détails/ }).locator('input[type="text"]').fill('testing');
    await page.getByRole('textbox', { name: /Mission de l'utilisateur/ }).fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-content').fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-end').fill('testing');

    await page.locator('button:has-text("Valider")').click();

    // 🔷 Navigate to Scénarios/Playlists
    await page.locator('text=Scénarios/Playlists').click();
    await expect(page).toHaveURL(/scenarios|playlists/);
  });
});