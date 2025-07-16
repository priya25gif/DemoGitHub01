import { test, expect } from '@playwright/test';
import { MultiLanguageLocator, COMMON_TEXTS, debugPageContent, configureLanguage } from './utils/language-utils';

// Test constants
const LOGIN_URL = 'https://preprod.veofactory.com/login';
const TEST_EMAIL = 'test2@veonum.com';
const TEST_PASSWORD = 'Veonum$$35700';

test.describe('Clean Multi-Language VeoFactory Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure language preference
    await configureLanguage(page, 'fr');
    
    // Login before each test
    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/dashboard|interlocuteurs/);
  });

  test('should create a new interlocuteur (clean multi-language)', async ({ page }) => {
    const locator = new MultiLanguageLocator(page);

    // Navigate to Interlocuteurs
    await locator.clickElement({
      texts: COMMON_TEXTS.interlocuteurs,
      testId: 'nav-interlocuteurs'
    });
    await expect(page).toHaveURL(/interlocuteurs/);

    // Create new interlocuteur
    await locator.clickElement({
      texts: COMMON_TEXTS.nouvelInterlocuteur,
      testId: 'btn-new-interlocuteur'
    });

    // Fill form fields
    await page.getByRole('textbox').first().waitFor({ state: 'visible' });
    await page.getByRole('textbox').first().fill('testing interlocuteur');
    
    await locator.fillInput({
      labelTexts: COMMON_TEXTS.profession,
      testId: 'input-profession'
    }, 'testing');

    await locator.fillInput({
      labelTexts: COMMON_TEXTS.description,
      testId: 'input-description'
    }, 'testing');

    await page.locator('#app-ai-coaching-persona-ai-content').fill('testing');

    // Select AI provider
    await locator.clickElement({
      role: { role: 'combobox', name: 'Fournisseur d\'IA|AI Provider' },
      testId: 'select-ai-provider'
    });
    
    await page.getByRole('option', { name: /OpenAI Realtime/i }).click();

    // Select model
    await locator.clickElement({
      role: { role: 'combobox', name: 'Modèle|Model' },
      testId: 'select-model'
    });
    
    await page.locator('text=gpt-4o-realtime-preview').click();

    // Submit form
    await locator.clickElement({
      texts: COMMON_TEXTS.valider,
      testId: 'btn-validate'
    });

    // Configure gender and language
    await locator.clickElement({
      texts: COMMON_TEXTS.femme,
      testId: 'btn-female'
    });

    await locator.clickElement({
      texts: COMMON_TEXTS.langue,
      testId: 'select-language'
    });

    await locator.clickElement({
      texts: COMMON_TEXTS.automatique,
      testId: 'option-automatic'
    });

    // Select voice
    await locator.clickElement({
      role: { role: 'combobox', name: 'Nom de la voix|Voice Name' },
      testId: 'select-voice'
    });
    
    await page.getByRole('option', { name: /alloy/i }).click();

    // Final validation
    await locator.clickElement({
      texts: COMMON_TEXTS.valider,
      testId: 'btn-final-validate'
    });

    // Verify success
    await expect(page).toHaveURL(/interlocuteurs/);
  });

  test('should navigate between all sections', async ({ page }) => {
    const locator = new MultiLanguageLocator(page);

    // Navigate to Interlocuteurs
    await locator.clickElement({
      texts: COMMON_TEXTS.interlocuteurs,
      testId: 'nav-interlocuteurs'
    });
    await expect(page).toHaveURL(/interlocuteurs/);

    // Navigate to Observateurs
    await locator.clickElement({
      texts: COMMON_TEXTS.observateurs,
      testId: 'nav-observateurs'
    });
    await expect(page).toHaveURL(/observateurs/);

    // Navigate to Missions
    await locator.clickElement({
      texts: COMMON_TEXTS.missions,
      testId: 'nav-missions'
    });
    await expect(page).toHaveURL(/missions/);

    // Navigate to Scénarios/Playlists
    await locator.clickElement({
      texts: COMMON_TEXTS.scenarios,
      testId: 'nav-scenarios'
    });
    await expect(page).toHaveURL(/scenarios|playlists/);
  });

  test('should create a new mission', async ({ page }) => {
    const locator = new MultiLanguageLocator(page);

    // Navigate to Missions
    await locator.clickElement({
      texts: COMMON_TEXTS.missions,
      testId: 'nav-missions'
    });
    await expect(page).toHaveURL(/missions/);

    // Create new mission
    await locator.clickElement({
      texts: COMMON_TEXTS.nouvelleMission,
      testId: 'btn-new-mission'
    });

    // Fill mission form
    await locator.fillInput({
      labelTexts: COMMON_TEXTS.details,
      testId: 'input-mission-details',
      selector: 'input[type="text"]'
    }, 'testing');

    await locator.fillInput({
      labelTexts: COMMON_TEXTS.missionUtilisateur,
      testId: 'input-user-mission'
    }, 'testing');

    await page.locator('#app-ai-coaching-mission-ai-content').fill('testing');
    await page.locator('#app-ai-coaching-mission-ai-end').fill('testing');

    // Submit mission
    await locator.clickElement({
      texts: COMMON_TEXTS.valider,
      testId: 'btn-validate-mission'
    });

    // Verify success
    await expect(page).toHaveURL(/missions/);
  });

  test('debug page content and language', async ({ page }) => {
    // This test helps debug language issues
    await debugPageContent(page);
    
    // This test will always pass, it's just for debugging
    expect(true).toBe(true);
  });
});