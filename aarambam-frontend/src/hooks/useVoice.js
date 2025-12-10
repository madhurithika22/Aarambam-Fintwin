import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const { language } = useLanguage();

  // 1. Load System Voices
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        console.log(`Loaded ${v.length} system voices.`);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // 2. Speak Function (System Only - Most Stable)
  const speak = useCallback((text) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Determine language code
    let langCode = 'en-IN';
    if (language === 'hi') langCode = 'hi-IN';
    if (language === 'ta') langCode = 'ta-IN';
    if (language === 'mr') langCode = 'mr-IN';

    // Find best matching voice
    const voice = voices.find(v => v.lang === langCode) || 
                  voices.find(v => v.lang.startsWith(langCode.split('-')[0]));

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback: If Tamil voice is missing on Windows, it will use English
      // This prevents the "Silence" or "404" errors
      console.warn(`Voice for ${langCode} not found. Using system default.`);
    }

    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [language, voices]);

  // 3. Listen Function (For Registration)
  const listen = useCallback((onResult) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice features require Google Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set Listen Language
    if (language === 'hi') recognition.lang = 'hi-IN';
    else if (language === 'ta') recognition.lang = 'ta-IN';
    else if (language === 'mr') recognition.lang = 'mr-IN';
    else recognition.lang = 'en-IN';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      console.log("Heard:", transcript);
      if (onResult) onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      console.error("Mic Error:", e);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  }, [language]);

  return { speak, listen, isListening };
};