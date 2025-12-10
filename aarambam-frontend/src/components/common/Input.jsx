import React from 'react';
import { Mic } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, isNumeric = false }) => {
  const { listen, isListening } = useVoice();

  const processVoiceInput = (text) => {
    const shouldConvert = type === 'number' || type === 'tel' || isNumeric;
    if (!shouldConvert) return text;

    let processed = text.toLowerCase();

    // 1. English Mapping
    const enMap = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
    };

    // 2. Tamil Mapping (Script & Phonetic)
    const taMap = {
      'பூஜ்ஜியம்': '0', 'ஒன்று': '1', 'இரண்டு': '2', 'மூன்று': '3', 'நான்கு': '4',
      'ஐந்து': '5', 'ஆறு': '6', 'ஏழு': '7', 'எட்டு': '8', 'ஒன்பது': '9', 'பத்து': '10',
      // Common Phonetic Inputs (Just in case)
      'onnu': '1', 'rendu': '2', 'moonu': '3', 'naalu': '4', 'anju': '5' 
    };

    // Apply Maps
    Object.keys(enMap).forEach(k => processed = processed.replaceAll(k, enMap[k]));
    Object.keys(taMap).forEach(k => processed = processed.replaceAll(k, taMap[k]));

    // Remove anything that isn't a digit
    return processed.replace(/[^0-9]/g, '');
  };

  const handleVoiceInput = () => {
    listen((text) => {
      const cleanText = processVoiceInput(text);
      const event = { target: { value: cleanText } };
      onChange(event);
    });
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-bold text-slate-600 ml-1">{label}</label>}
      <div className="relative">
        {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={20} /></div>}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={isListening ? "Listening..." : placeholder}
          className={`w-full bg-slate-50 border ${isListening ? 'border-blue-500 ring-2' : 'border-slate-200'} rounded-xl py-3.5 ${Icon ? 'pl-12' : 'pl-4'} pr-12 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100`}
        />

        <button type="button" onClick={handleVoiceInput} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-blue-600'}`}>
          <Mic size={18} />
        </button>
      </div>
    </div>
  );
};

export default Input;