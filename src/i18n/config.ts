import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import huTranslations from './locales/hu.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    hu: { translation: huTranslations },
  },
  lng: localStorage.getItem('language') || 'hu',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
