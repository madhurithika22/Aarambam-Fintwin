import React, { useState } from 'react';
import { WifiOff, Wallet, ArrowRight, Plus } from 'lucide-react';
import { useOfflineWallet } from '../hooks/useOfflineWallet';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { formatCurrency } from '../utils/currency';

const OfflineWallet = () => {
  const { balance, loadMoney, payOffline } = useOfflineWallet();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pay'); // 'pay' | 'load'
  
  // Form States
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');

  const handleTransaction = () => {
    if (!amount) return;

    if (activeTab === 'load') {
      // Simulate UPI Intent
      const success = loadMoney(amount);
      if (success) {
        alert(`₹${amount} Loaded Successfully via UPI!`);
        setAmount('');
        setActiveTab('pay');
      }
    } else {
      // Offline Pay Logic
      const token = payOffline(amount, receiver || "Merchant");
      if (token) {
        // Navigate to Success Page (simulating offline success)
        navigate('/payment-success', { state: { amount, receiver: receiver || "Offline Merchant" } });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      
      {/* Wallet Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-white/10 rounded-2xl"><Wallet size={24} /></div>
               <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold flex items-center gap-2">
                  <WifiOff size={12} /> WORKS OFFLINE
               </div>
            </div>
            <p className="text-white/60 text-sm font-medium">Wallet Balance</p>
            <h1 className="text-4xl font-bold mt-1">{formatCurrency(balance)}</h1>
         </div>
         {/* Decor */}
         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex">
         <button 
           onClick={() => setActiveTab('pay')}
           className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'pay' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
         >
           Pay Someone
         </button>
         <button 
           onClick={() => setActiveTab('load')}
           className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'load' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
         >
           Add Money
         </button>
      </div>

      {/* Action Form */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-800 mb-6 text-lg">
            {activeTab === 'load' ? 'Deposit via UPI' : 'Pay from Wallet'}
         </h3>

         <div className="space-y-5">
            {activeTab === 'pay' && (
               <Input 
                 label="Receiver Number / Name" 
                 placeholder="Enter Name or Number" 
                 value={receiver}
                 onChange={(e) => setReceiver(e.target.value)}
               />
            )}
            
            <Input 
               label="Amount" 
               type="number" 
               placeholder="₹ 0" 
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
            />

            <Button onClick={handleTransaction} className={activeTab === 'load' ? 'bg-green-600 hover:bg-green-700' : ''}>
               {activeTab === 'load' ? (
                  <>Add Money Securely <Plus size={18} /></>
               ) : (
                  <>Pay Now <ArrowRight size={18} /></>
               )}
            </Button>

            <p className="text-xs text-center text-slate-400 mt-2">
               {activeTab === 'load' ? 'Requires Internet connection' : 'No Internet required for this transaction'}
            </p>
         </div>
      </div>
    </div>
  );
};

export default OfflineWallet;