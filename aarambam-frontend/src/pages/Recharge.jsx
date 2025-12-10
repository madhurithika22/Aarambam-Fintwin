import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle2, Wifi } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PinModal from '../components/common/PinModal';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../context/LanguageContext';

const Recharge = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { t } = useLanguage();

  const [mobile, setMobile] = useState('');
  const [operator, setOperator] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPinOpen, setIsPinOpen] = useState(false);

  const operators = ["Jio", "Airtel", "Vi", "BSNL"];
  const plans = [
    { price: 299, data: "1.5GB/day", valid: "28 Days", calls: "Unlimited" },
    { price: 719, data: "2GB/day", valid: "84 Days", calls: "Unlimited" },
    { price: 19, data: "1GB", valid: "Base Plan", calls: "NA" },
  ];

  useEffect(() => {
    speak("Please enter mobile number and select a plan.");
  }, [speak]);

  const handleRecharge = () => {
    if (!mobile || !operator || !selectedPlan) {
      alert("Please fill all details");
      return;
    }
    setIsPinOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinOpen(false);
    navigate('/payment-success', { 
      state: { amount: selectedPlan.price, receiver: `${operator} Prepaid` } 
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
         <Smartphone className="text-blue-600" /> Mobile Recharge
      </h2>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-6">
         <Input 
           label="Mobile Number" 
           type="tel"
           placeholder="98765 43210" 
           value={mobile} 
           onChange={(e) => setMobile(e.target.value)} 
         />

         {/* Operator Selection */}
         <div>
            <label className="text-sm font-bold text-slate-600 ml-1 mb-2 block">Select Operator</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
               {operators.map(op => (
                 <button
                   key={op}
                   onClick={() => setOperator(op)}
                   className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all ${operator === op ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                 >
                   {op}
                 </button>
               ))}
            </div>
         </div>

         {/* Plans */}
         {operator && (
           <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 ml-1">Recommended Plans</label>
              {plans.map((plan) => (
                <div 
                  key={plan.price}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedPlan === plan ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}
                >
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg">₹{plan.price}</h3>
                      <p className="text-xs text-slate-500 flex gap-2 mt-1">
                         <span>{plan.valid}</span> • <span>{plan.data}</span>
                      </p>
                   </div>
                   {selectedPlan === plan && <CheckCircle2 className="text-blue-600" />}
                </div>
              ))}
           </div>
         )}
         
         <div className="pt-2">
            <Button disabled={!selectedPlan} onClick={handleRecharge}>
               Proceed to Pay {selectedPlan ? `₹${selectedPlan.price}` : ''}
            </Button>
         </div>
      </div>
      <PinModal isOpen={isPinOpen} onClose={() => setIsPinOpen(false)} onSuccess={handlePinSuccess} />
    </div>
  );
};

export default Recharge;