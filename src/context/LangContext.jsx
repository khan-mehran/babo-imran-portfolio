import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('rhc-lang') || 'ur')

  const toggleLang = () => {
    const next = lang === 'ur' ? 'en' : 'ur'
    setLang(next)
    localStorage.setItem('rhc-lang', next)
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
  }, [lang])

  const t = (key) => translations[lang]?.[key] ?? key

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
