import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-slate-200 shadow-sm">
      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full">
         <Globe size={16} />
      </div>
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer pr-2"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </div>
  );
};

export default LanguageSelector;