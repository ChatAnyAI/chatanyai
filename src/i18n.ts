import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Use this fallback language when user language is not detected
    debug: true, // Enable debug mode to help view logs
    interpolation: {
      escapeValue: false // Don't escape interpolation
    },
    backend: {
      loadPath: '/static/locales/{{lng}}/{{ns}}.json' // Path to load translation files
    }
  });

export default i18n;