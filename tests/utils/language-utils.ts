import { Page, Locator } from '@playwright/test';

// Language detection utility
export async function detectPageLanguage(page: Page): Promise<string> {
  const htmlLang = await page.locator('html').getAttribute('lang');
  const bodyLang = await page.locator('body').getAttribute('lang');
  
  return htmlLang || bodyLang || 'fr'; // Default to French
}

// Multi-language text mappings
export const LANGUAGE_MAPPINGS = {
  fr: {
    interlocuteurs: 'Interlocuteurs',
    nouvelInterlocuteur: 'Nouvel interlocuteur',
    missions: 'Missions',
    nouvelleMission: 'Nouvelle mission',
    observateurs: 'Observateurs',
    scenarios: 'Scénarios/Playlists',
    valider: 'Valider',
    profession: 'Profession',
    description: 'Description',
    fournisseurIA: 'Fournisseur d\'IA',
    modele: 'Modèle',
    femme: 'Femme',
    langue: 'Sélectionnez une langue',
    automatique: 'Automatique',
    nomVoix: 'Nom de la voix',
    missionUtilisateur: 'Mission de l\'utilisateur',
    details: 'Détails'
  },
  en: {
    interlocuteurs: 'Interlocutors',
    nouvelInterlocuteur: 'New Interlocutor',
    missions: 'Missions',
    nouvelleMission: 'New Mission',
    observateurs: 'Observers',
    scenarios: 'Scenarios/Playlists',
    valider: 'Submit',
    profession: 'Profession',
    description: 'Description',
    fournisseurIA: 'AI Provider',
    modele: 'Model',
    femme: 'Female',
    langue: 'Select a language',
    automatique: 'Automatic',
    nomVoix: 'Voice Name',
    missionUtilisateur: 'User Mission',
    details: 'Details'
  }
};

// Get text for current language
export async function getTextForLanguage(page: Page, key: string): Promise<string> {
  const lang = await detectPageLanguage(page);
  const langCode = lang.startsWith('fr') ? 'fr' : 'en';
  
  return LANGUAGE_MAPPINGS[langCode][key] || LANGUAGE_MAPPINGS.fr[key];
}

// Multi-language locator strategies
export class MultiLanguageLocator {
  constructor(private page: Page) {}

  // Strategy 1: Try multiple text variations
  async clickByText(textVariations: string[], timeout: number = 30000): Promise<void> {
    for (const text of textVariations) {
      try {
        const element = this.page.locator(`text=${text}`);
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          await element.click({ timeout: 5000 });
          return;
        }
      } catch (error) {
        console.log(`Text "${text}" not found, trying next...`);
      }
    }
    throw new Error(`None of these texts found: ${textVariations.join(', ')}`);
  }

  // Strategy 2: Use data-testid (recommended)
  async clickByTestId(testId: string): Promise<void> {
    await this.page.locator(`[data-testid="${testId}"]`).click();
  }

  // Strategy 3: Use role-based selectors with regex
  async clickByRole(role: string, namePattern: string): Promise<void> {
    await this.page.getByRole(role as any, { name: new RegExp(namePattern, 'i') }).click();
  }

  // Strategy 4: Try multiple selector strategies
  async clickElement(options: {
    texts?: string[];
    testId?: string;
    role?: { role: string; name: string };
    selector?: string;
  }): Promise<void> {
    // Try data-testid first (most reliable)
    if (options.testId) {
      try {
        await this.clickByTestId(options.testId);
        return;
      } catch (error) {
        console.log(`TestId "${options.testId}" not found, trying other strategies...`);
      }
    }

    // Try role-based selector
    if (options.role) {
      try {
        await this.clickByRole(options.role.role, options.role.name);
        return;
      } catch (error) {
        console.log(`Role "${options.role.role}" with name "${options.role.name}" not found...`);
      }
    }

    // Try direct selector
    if (options.selector) {
      try {
        await this.page.locator(options.selector).click();
        return;
      } catch (error) {
        console.log(`Selector "${options.selector}" not found...`);
      }
    }

    // Try text variations (fallback)
    if (options.texts) {
      await this.clickByText(options.texts);
      return;
    }

    throw new Error('All locator strategies failed');
  }

  // Fill input with multi-language support
  async fillInput(options: {
    labelTexts?: string[];
    testId?: string;
    placeholder?: string;
    selector?: string;
  }, value: string): Promise<void> {
    // Try data-testid first
    if (options.testId) {
      try {
        await this.page.locator(`[data-testid="${options.testId}"]`).fill(value);
        return;
      } catch (error) {
        console.log(`TestId input "${options.testId}" not found...`);
      }
    }

    // Try placeholder
    if (options.placeholder) {
      try {
        await this.page.locator(`[placeholder*="${options.placeholder}"]`).fill(value);
        return;
      } catch (error) {
        console.log(`Placeholder "${options.placeholder}" not found...`);
      }
    }

    // Try label texts
    if (options.labelTexts) {
      for (const labelText of options.labelTexts) {
        try {
          const input = this.page.getByRole('textbox', { name: new RegExp(labelText, 'i') });
          if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
            await input.fill(value);
            return;
          }
        } catch (error) {
          console.log(`Label "${labelText}" not found...`);
        }
      }
    }

    // Try direct selector
    if (options.selector) {
      try {
        await this.page.locator(options.selector).fill(value);
        return;
      } catch (error) {
        console.log(`Selector "${options.selector}" not found...`);
      }
    }

    throw new Error('All input locator strategies failed');
  }
}

// Helper function to get all text content for debugging
export async function debugPageContent(page: Page): Promise<void> {
  console.log('=== DEBUG PAGE CONTENT ===');
  
  // Get page language
  const lang = await detectPageLanguage(page);
  console.log(`Page language: ${lang}`);
  
  // Get all button texts
  const buttons = await page.locator('button').all();
  console.log('Button texts:');
  for (const button of buttons) {
    const text = await button.textContent();
    if (text?.trim()) {
      console.log(`  - "${text.trim()}"`);
    }
  }
  
  // Get all link texts
  const links = await page.locator('a').all();
  console.log('Link texts:');
  for (const link of links) {
    const text = await link.textContent();
    if (text?.trim()) {
      console.log(`  - "${text.trim()}"`);
    }
  }
  
  // Get navigation elements
  const navElements = await page.locator('nav *').all();
  console.log('Navigation elements:');
  for (const nav of navElements) {
    const text = await nav.textContent();
    if (text?.trim()) {
      console.log(`  - "${text.trim()}"`);
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'debug-page-content.png', fullPage: true });
}

// Language-aware test configuration
export async function configureLanguage(page: Page, language: 'fr' | 'en' = 'fr'): Promise<void> {
  // Set browser language
  await page.setExtraHTTPHeaders({
    'Accept-Language': language === 'fr' ? 'fr-FR,fr;q=0.9' : 'en-US,en;q=0.9'
  });
  
  // You might need to set localStorage or cookies for language preference
  await page.addInitScript((lang) => {
    localStorage.setItem('language', lang);
    localStorage.setItem('locale', lang);
  }, language);
}

// Export commonly used text combinations
export const COMMON_TEXTS = {
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