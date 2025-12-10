import React, { useState } from 'react';
import { X, Lock, Mic } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

const PinModal = ({ isOpen, onClose, onSuccess }) => {
  const { listen, isListening } = useVoice();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) document.getElementById(`pin-${index + 1}`).focus();
    
    if (index === 3 && value) {
      if (newPin.join('') === '1234') {
        setTimeout(() => onSuccess(), 300);
      } else {
        setError(true);
        setTimeout(() => { setPin(['', '', '', '']); setError(false); document.getElementById('pin-0').focus(); }, 1000);
      }
    }
  };

  const handleVoicePin = () => {
    listen((text) => {
        // Simple logic: If user says "1 2 3 4" or "1234"
        const cleanPin = text.replace(/\s/g, '').slice(0, 4);
        if (cleanPin.length === 4 && !isNaN(cleanPin)) {
             setPin(cleanPin.split(''));
             if (cleanPin === '1234') setTimeout(() => onSuccess(), 300);
        }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl relative animate-scale-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600"><Lock size={24} /></div>
          <h3 className="text-lg font-bold text-slate-800">Enter UPI PIN</h3>
          <p className="text-xs text-slate-500">Enter 1234 to proceed</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="password"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              className={`w-12 h-12 border-2 rounded-xl text-center text-xl font-bold focus:outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`}
              autoFocus={i === 0}
            />
          ))}
        </div>
        
        <div className="text-center">
            <button 
                onClick={handleVoicePin}
                className={`flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full text-xs font-bold transition-all ${isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}
            >
                <Mic size={14} /> {isListening ? "Listening..." : "Speak PIN"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;