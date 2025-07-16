import { test, expect } from '@playwright/test';

// Test constants
const LOGIN_URL = 'https://preprod.veofactory.com/login';
const TEST_EMAIL = 'test2@veonum.com';
const TEST_PASSWORD = 'Veonum$$35700';

// Multi-language text mappings
const TEXTS = {
  interlocuteurs: ['Interlocuteurs', 'Interlocutors', 'Speakers'],
  nouvelInterlocuteur: ['Nouvel interlocuteur', 'New Interlocutor', 'New Speaker'],
  missions: ['Missions', 'Missions'],
  nouvelleMission: ['Nouvelle mission', 'New Mission'],
  observateurs: ['Observateurs', 'Observers'],
  scenarios: ['Scénarios/Playlists', 'Scenarios/Playlists'],
  valider: ['Valider', 'Validate', 'Submit', 'Confirm'],
  profession: ['Profession', 'Profession'],
  description: ['Description', 'Description'],
  fournisseurIA: ['Fournisseur d\'IA', 'AI Provider', 'AI Supplier'],
  modele: ['Modèle', 'Model'],
  femme: ['Femme', 'Female', 'Woman'],
  langue: ['Sélectionnez une langue', 'Select a language', 'Choose a language'],
  automatique: ['Automatique', 'Automatic', 'Auto'],
  nomVoix: ['Nom de la voix', 'Voice Name', 'Voice'],
  missionUtilisateur: ['Mission de l\'utilisateur', 'User Mission', 'User\'s Mission'],
  details: ['Détails', 'Details']
};

// Helper function to create multi-language locator
function createMultiLanguageLocator(page: any, textOptions: string[]) {
  // Try each text option and return the first one that exists
  const locators = textOptions.map(text => 
    page.locator(`text=${text}`).or(page.locator(`[aria-label*="${text}"]`))
      .or(page.locator(`[title*="${text}"]`))
      .or(page.locator(`[placeholder*="${text}"]`))
  );
  
  return page.locator(locators.map(l => l._selector).join(', '));
}

// Helper function to click multi-language element
async function clickMultiLanguageElement(page: any, textOptions: string[], timeout = 30000) {
  for (const text of textOptions) {
    try {
      // Try different locator strategies
      const selectors = [
        `text=${text}`,
        `[aria-label*="${text}"]`,
        `[title*="${text}"]`,
        `button:has-text("${text}")`,
        `a:has-text("${text}")`,
        `span:has-text("${text}")`,
        `div:has-text("${text}")`
      ];
      
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          await element.click({ timeout: 5000 });
          return true;
        }
      }
    } catch (error) {
      console.log(`Could not find element with text: ${text}`);
    }
  }
  throw new Error(`Could not find element with any of these texts: ${textOptions.join(', ')}`);
}

// Helper function to fill multi-language input
async function fillMultiLanguageInput(page: any, textOptions: string[], value: string) {
  for (const text of textOptions) {
    try {
      const selectors = [
        `input[placeholder*="${text}"]`,
        `textarea[placeholder*="${text}"]`,
        `[aria-label*="${text}"] input`,
        `[aria-label*="${text}"] textarea`,
        `label:has-text("${text}") + input`,
        `label:has-text("${text}") + textarea`
      ];
      
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          await element.fill(value);
          return true;
        }
      }
    } catch (error) {
      console.log(`Could not find input with text: ${text}`);
    }
  }
  
  // Fallback to role-based selectors
  try {
    const textbox = page.getByRole('textbox', { name: new RegExp(textOptions.join('|'), 'i') });
    if (await textbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await textbox.fill(value);
      return true;
    }
  } catch (error) {
    console.log(`Could not find textbox with role-based selector`);
  }
  
  throw new Error(`Could not find input with any of these labels: ${textOptions.join(', ')}`);
}

test.describe('VeoFactory Multi-Language Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/dashboard|interlocuteurs/);
  });

  test('should create a new interlocuteur (multi-language)', async ({ page }) => {
    // Navigate to Interlocuteurs using multi-language support
    await clickMultiLanguageElement(page, TEXTS.interlocuteurs);
    await expect(page).toHaveURL(/interlocuteurs/);

    // Create new interlocuteur
    await clickMultiLanguageElement(page, TEXTS.nouvelInterlocuteur);

    // Fill form fields using multi-language support
    await page.getByRole('textbox').first().waitFor({ state: 'visible' });
    await page.getByRole('textbox').first().fill('testing interlocuteur');
    
    await fillMultiLanguageInput(page, TEXTS.profession, 'testing');
    await fillMultiLanguageInput(page, TEXTS.description, 'testing');
    await page.locator('#app-ai-coaching-persona-ai-content').fill('testing');

    // Select AI provider with multi-language support
    try {
      await page.getByRole('combobox', { name: new RegExp(TEXTS.fournisseurIA.join('|'), 'i') }).click();
      await page.getByRole('option', { name: /OpenAI Realtime/i }).click();
    } catch (error) {
      console.log('Trying alternative AI provider selection...');
      await page.locator('[data-testid="ai-provider"], [id*="provider"], [class*="provider"]').click();
      await page.locator('text=OpenAI Realtime').click();
    }

    // Select model with multi-language support
    try {
      await page.getByRole('combobox', { name: new RegExp(TEXTS.modele.join('|'), 'i') }).click();
      await page.locator('text=gpt-4o-realtime-preview').click();
    } catch (error) {
      console.log('Trying alternative model selection...');
      await page.locator('[data-testid="model"], [id*="model"], [class*="model"]').click();
      await page.locator('text=gpt-4o-realtime-preview').click();
    }

    // Submit form
    await clickMultiLanguageElement(page, TEXTS.valider);

    // Configure gender and language
    await clickMultiLanguageElement(page, TEXTS.femme);
    await clickMultiLanguageElement(page, TEXTS.langue);
    await clickMultiLanguageElement(page, TEXTS.automatique);

    // Select voice
    try {
      await page.getByRole('combobox', { name: new RegExp(TEXTS.nomVoix.join('|'), 'i') }).click();
      await page.getByRole('option', { name: /alloy/i }).click();
    } catch (error) {
      console.log('Trying alternative voice selection...');
      await page.locator('[data-testid="voice"], [id*="voice"], [class*="voice"]').click();
      await page.locator('text=alloy').click();
    }

    // Final validation
    await clickMultiLanguageElement(page, TEXTS.valider);

    // Verify success
    await expect(page).toHaveURL(/interlocuteurs/);
  });

  test('should navigate to all sections (multi-language)', async ({ page }) => {
    // Navigate to Interlocuteurs
    await clickMultiLanguageElement(page, TEXTS.interlocuteurs);
    await expect(page).toHaveURL(/interlocuteurs/);

    // Navigate to Observateurs
    await clickMultiLanguageElement(page, TEXTS.observateurs);
    await expect(page).toHaveURL(/observateurs/);

    // Navigate to Missions
    await clickMultiLanguageElement(page, TEXTS.missions);
    await expect(page).toHaveURL(/missions/);

    // Navigate to Scénarios/Playlists
    await clickMultiLanguageElement(page, TEXTS.scenarios);
    await expect(page).toHaveURL(/scenarios|playlists/);
  });

  test('should create a new mission (multi-language)', async ({ page }) => {
    // Navigate to Missions
    await clickMultiLanguageElement(page, TEXTS.missions);
    await expect(page).toHaveURL(/missions/);

    // Create new mission
    await clickMultiLanguageElement(page, TEXTS.nouvelleMission);

    // Fill mission form with multi-language support
    try {
      await page.getByRole('group', { name: new RegExp(TEXTS.details.join('|'), 'i') }).locator('input[type="text"]').fill('testing');
    } catch (error) {
      // Fallback to first text input
      await page.locator('input[type="text"]').first().fill('testing');
    }
    
    await fillMultiLanguageInput(page, TEXTS.missionUtilisateur, 'testing');
    await page.locator('#app-ai-coaching-mission-ai-content').fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-end').fill('testing');

    // Submit mission
    await clickMultiLanguageElement(page, TEXTS.valider);

    // Verify success
    await expect(page).toHaveURL(/missions/);
  });

  test('debug: check page language and elements', async ({ page }) => {
    // This test helps debug language issues
    await page.waitForTimeout(2000);
    
    // Check page language
    const htmlLang = await page.locator('html').getAttribute('lang');
    console.log('Page language:', htmlLang);
    
    // Check for navigation elements
    const navElements = await page.locator('nav, [role="navigation"], .navigation, .nav').all();
    console.log('Found navigation elements:', navElements.length);
    
    // Check for specific text elements
    for (const [key, texts] of Object.entries(TEXTS)) {
      console.log(`\nChecking for ${key}:`);
      for (const text of texts) {
        const found = await page.locator(`text=${text}`).isVisible().catch(() => false);
        console.log(`  "${text}": ${found ? 'FOUND' : 'NOT FOUND'}`);
      }
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-language.png', fullPage: true });
  });
});