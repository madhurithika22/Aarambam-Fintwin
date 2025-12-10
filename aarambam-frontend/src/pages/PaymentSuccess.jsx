import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Share2, Home } from 'lucide-react';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/currency';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, receiver } = location.state || { amount: '0', receiver: 'Unknown' };
  
  // Audio Feedback Simulation
  useEffect(() => {
    // In a real app, play "Payment Successful" sound here
    const timer = setTimeout(() => {
        // Auto-redirect could go here if needed
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in text-center">
      
      {/* Success Animation Circle */}
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200 animate-bounce-slow">
         <Check size={48} className="text-white" strokeWidth={3} />
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-1">Payment Successful!</h1>
      <p className="text-slate-500 text-sm mb-8">Transaction ID: TXN_{Date.now().toString().slice(-8)}</p>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm mb-8">
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Paid to</p>
         <h2 className="text-xl font-bold text-slate-800 mb-6">{receiver}</h2>
         
         <div className="border-t border-b border-slate-50 py-6 mb-6">
            <h1 className="text-4xl font-bold text-slate-900">{formatCurrency(amount)}</h1>
         </div>

         <div className="flex justify-between text-xs text-slate-500">
            <span>Date</span>
            <span className="font-bold text-slate-700">{new Date().toLocaleDateString()}</span>
         </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
         <Button variant="outline" icon={Share2}>Share Receipt</Button>
         <Button onClick={() => navigate('/')} icon={Home}>Done</Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;