'use client'

import { createContext, useContext, useCallback } from 'react'
import { t as translate, type Locale, type TranslationKey } from './translations'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => translate(key, 'en'),
})

export function LanguageProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `lang=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    window.location.reload()
  }, [])

  const boundT = useCallback(
    (key: TranslationKey) => translate(key, initialLocale),
    [initialLocale],
  )

  return (
    <LanguageContext.Provider
      value={{ locale: initialLocale, setLocale, t: boundT }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
