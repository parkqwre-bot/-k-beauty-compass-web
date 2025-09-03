import ko from '../locales/ko.json';
import en from '../locales/en.json';

interface TranslationContent {
  [key: string]: string;
}

const translations: Record<string, TranslationContent> = {
  ko: ko,
  en: en,
};

export type Locale = keyof typeof translations;

export function getTranslation(locale: Locale, key: string): string {
  const currentTranslations = translations[locale];
  if (currentTranslations && currentTranslations[key]) {
    return currentTranslations[key];
  }
  // Fallback to English if key not found in current locale, or if locale is not supported
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  return key; // Return the key itself if no translation is found
}

export function getRecommendationTranslation(locale: Locale, key: string): string {
  // Recommendation keys are dynamic (rec_1, rec_2, etc.)
  return getTranslation(locale, key);
}
