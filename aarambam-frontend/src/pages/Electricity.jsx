import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PinModal from '../components/common/PinModal';
import { useVoice } from '../hooks/useVoice';

const Electricity = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  
  const [consumerNo, setConsumerNo] = useState('');
  const [board, setBoard] = useState('TNEB');
  const [billDetails, setBillDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);

  useEffect(() => {
    speak("Select board and enter consumer number to fetch bill.");
  }, [speak]);

  const fetchBill = () => {
    if (!consumerNo) return;
    setIsLoading(true);
    speak("Fetching bill details...");
    
    // Simulate API Call
    setTimeout(() => {
        setBillDetails({
            name: "Raju Kumar",
            amount: 1250,
            dueDate: "15 Dec 2025",
            status: "Unpaid"
        });
        setIsLoading(false);
        speak("Bill fetched. Total amount is 1250 rupees.");
    }, 1500);
  };

  const handlePinSuccess = () => {
    setIsPinOpen(false);
    navigate('/payment-success', { 
      state: { amount: billDetails.amount, receiver: `${board} Bill Payment` } 
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
         <Zap className="text-yellow-500" /> Electricity Bill
      </h2>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 space-y-6">
         {/* Board Selection */}
         <div>
             <label className="text-sm font-bold text-slate-600 ml-1 mb-2 block">Select Board</label>
             <select 
               value={board}
               onChange={(e) => setBoard(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 font-bold text-slate-700 outline-none focus:border-blue-500"
             >
                <option value="TNEB">Tamil Nadu Electricity Board (TNEB)</option>
                <option value="BESCOM">Bangalore Electricity (BESCOM)</option>
                <option value="MSEDCL">Maharashtra State Electricity</option>
             </select>
         </div>

         <Input 
           label="Consumer Number" 
           placeholder="e.g. 05-234-567-89" 
           value={consumerNo} 
           onChange={(e) => setConsumerNo(e.target.value)} 
         />

         {!billDetails ? (
             <Button onClick={fetchBill} disabled={!consumerNo || isLoading}>
                {isLoading ? <><Loader2 className="animate-spin" /> Fetching...</> : 'Fetch Bill'}
             </Button>
         ) : (
             // Bill Details Card
             <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bill Amount</span>
                    <span className="text-2xl font-bold text-slate-800">₹{billDetails.amount}</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-6">
                    <div className="flex justify-between"><span>Name</span><span className="font-bold">{billDetails.name}</span></div>
                    <div className="flex justify-between"><span>Due Date</span><span className="font-bold text-red-500">{billDetails.dueDate}</span></div>
                </div>
                <Button onClick={() => setIsPinOpen(true)}>
                   Pay Bill Now <ArrowRight size={18} />
                </Button>
             </div>
         )}
      </div>
      <PinModal isOpen={isPinOpen} onClose={() => setIsPinOpen(false)} onSuccess={handlePinSuccess} />
    </div>
  );
};

export default Electricity;