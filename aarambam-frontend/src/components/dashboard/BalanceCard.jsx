import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import PinModal from '../common/PinModal';

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [balance, setBalance] = useState(14250.00);

  const toggleBalance = () => {
    if (showBalance) {
      setShowBalance(false);
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setShowBalance(true);
  };

  return (
    <>
      <div className="relative overflow-hidden bg-slate-900 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20 h-full min-h-[180px] flex flex-col justify-center">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-blue-100 font-medium mb-2 text-sm tracking-wide">Total Balance</p>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {showBalance ? formatCurrency(balance) : '••••••••'}
              </h1>
              
              <button 
                onClick={toggleBalance}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {showBalance ? <EyeOff size={20} className="text-blue-100" /> : <Eye size={20} className="text-blue-100" />}
              </button>
            </div>
          </div>
          
          {/* Sim Card Graphic */}
          <div className="hidden sm:flex w-14 h-10 bg-white/10 rounded-lg border border-white/20 items-center justify-center">
             <div className="w-8 h-6 border border-white/40 rounded-sm flex gap-[3px] items-center justify-center">
                <div className="w-0.5 h-3 bg-white/40"></div>
                <div className="w-0.5 h-3 bg-white/40"></div>
                <div className="w-0.5 h-3 bg-white/40"></div>
             </div>
          </div>
        </div>
      </div>

      <PinModal 
        isOpen={isPinModalOpen} 
        onClose={() => setIsPinModalOpen(false)} 
        onSuccess={handlePinSuccess} 
      />
    </>
  );
};

export default BalanceCard;