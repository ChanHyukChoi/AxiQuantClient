import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { koResources } from '@/locales/ko'

export const I18N_NAMESPACES = [
  'common',
  'device',
  'reader',
  'nav',
  'layout',
  'auth',
  'emp',
  'card',
  'area',
  'access',
  'schedule',
  'alarm',
  'user',
  'cardFmt',
  'linkage',
  'eventMonitor',
  'audit',
  'entity',
] as const
export type I18nNamespace = (typeof I18N_NAMESPACES)[number]

void i18n.use(initReactI18next).init({
  resources: {
    ko: koResources,
  },
  lng: 'ko',
  fallbackLng: 'ko',
  defaultNS: 'common',
  ns: [...I18N_NAMESPACES],
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
export default i18n
