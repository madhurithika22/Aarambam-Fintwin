import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  // SAFE TRANSLATION FUNCTION
  const t = (key) => {
    // 1. Try to find the translation in the selected language
    const text = translations[language]?.[key];
    
    // 2. If missing, fallback to English
    if (!text) {
        console.warn(`Missing translation for: ${key} in ${language}`);
        return translations['en'][key] || key;
    }
    return text;
  };

  const getVoiceLang = () => {
    switch(language) {
      case 'ta': return 'ta-IN';
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      default: return 'en-IN';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getVoiceLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);