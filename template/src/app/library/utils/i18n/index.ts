import { initReactI18next } from 'react-i18next';

import i18n, { ParseKeys, TOptions, TypeOptions } from 'i18next';

const defaultNS = 'en';

import en from './source/en.json';

const resources = { en } as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources;
    keySeparator: ':';
  }
}

declare global {
  type I18nKeys = ParseKeys<TypeOptions['defaultNS'], TOptions>;
}

(() => {
  i18n.use(initReactI18next).init({
    fallbackLng: defaultNS,
    interpolation: {
      escapeValue: false,
    },
    keySeparator: false,
    lng: defaultNS,
    resources,
  });
})();

export default i18n;
