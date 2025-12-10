import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PinModal from '../components/common/PinModal';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../context/LanguageContext';

const SendToBank = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { t } = useLanguage();
  
  const [details, setDetails] = useState({ accNo: '', confirmAccNo: '', ifsc: '', holder: '', amount: '' });
  const [isVerified, setIsVerified] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  
  // Track the last step we spoke to avoid repeating
  const [currentStep, setCurrentStep] = useState(0); 
  const debounceRef = useRef(null);

  // --- INTELLIGENT VOICE FLOW ---
  useEffect(() => {
    // Clear any pending speech if user is typing fast
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      
      // Step 0: Initial Load
      if (currentStep === 0 && !details.accNo) {
        speak(t('voice_instruction_bank')); // "Enter Account Number"
        setCurrentStep(1);
      }

      // Step 1: Account Entered -> Ask for Confirmation
      else if (currentStep === 1 && details.accNo.length > 9 && !details.confirmAccNo) {
        speak("Now re-enter the account number to confirm.");
        setCurrentStep(2);
      }

      // Step 2: Confirmation Matched -> Ask for IFSC
      else if (currentStep === 2 && details.accNo === details.confirmAccNo && details.accNo.length > 0 && !details.ifsc) {
        speak("Numbers matched. Now enter the IFSC code.");
        setCurrentStep(3);
      }

      // Step 3: IFSC Verified -> Ask for Name
      else if (currentStep === 3 && isVerified && !details.holder) {
        speak(t('voice_instruction_verify_ifsc') + " Please enter the account holder's name.");
        setCurrentStep(4);
      }

      // Step 4: Name Entered -> Ask for Amount
      else if (currentStep === 4 && details.holder.length > 3 && !details.amount) {
        speak(t('voice_instruction_amount'));
        setCurrentStep(5);
      }

    }, 1500); // Wait 1.5s after user stops typing to speak next instruction

    return () => clearTimeout(debounceRef.current);
  }, [details, isVerified, currentStep, speak, t]);


  // Stop speaking when user starts typing
  const handleInputChange = (field, value) => {
    window.speechSynthesis.cancel(); // Silence immediately
    setDetails({ ...details, [field]: value });
  };

  const verifyIFSC = () => {
    if (details.ifsc.length > 4) {
        setIsVerified(true);
        // The useEffect will handle the "Verified" speech automatically now
    } else {
        alert("Invalid IFSC");
        speak("Invalid IFSC code.");
    }
  };

  const handlePayClick = () => {
      if (!details.accNo || !details.holder || !details.amount) return;
      speak(t('voice_instruction_pin'));
      setIsPinOpen(true);
  };

  const handlePinSuccess = () => {
      setIsPinOpen(false);
      navigate('/payment-success', { 
          state: { amount: details.amount, receiver: details.holder } 
      });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
         <Landmark className="text-blue-600" /> {t('toBank')}
      </h2>
      
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
         <div className="space-y-5">
            <Input 
                label={t('bankAccount')}
                type="number" 
                placeholder="1234567890" 
                value={details.accNo} 
                onChange={(e) => handleInputChange('accNo', e.target.value)} 
            />
            
            {details.accNo.length > 5 && (
              <div className="animate-slide-up">
                <Input 
                    label={t('bankAccount') + " (Confirm)"}
                    type="number" 
                    placeholder="Confirm Number" 
                    value={details.confirmAccNo} 
                    onChange={(e) => handleInputChange('confirmAccNo', e.target.value)} 
                />
              </div>
            )}
            
            <div className="relative">
               <Input 
                 label={t('ifsc')}
                 placeholder="SBIN000..." 
                 value={details.ifsc} 
                 onChange={(e) => { 
                    handleInputChange('ifsc', e.target.value.toUpperCase()); 
                    setIsVerified(false); 
                 }} 
               />
               {isVerified && (
                  <div className="absolute right-12 top-[38px] text-green-600 flex items-center gap-1 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                     <CheckCircle2 size={12} /> Verified
                  </div>
               )}
            </div>
            
            {!isVerified && details.ifsc.length > 4 && (
               <button onClick={verifyIFSC} className="text-xs font-bold text-blue-600 hover:underline -mt-2 block ml-1">
                  {t('verify_branch')}
               </button>
            )}

            <Input 
                label="Account Holder Name" 
                placeholder="Name" 
                value={details.holder} 
                onChange={(e) => handleInputChange('holder', e.target.value)} 
            />
            
            <Input 
                label="Amount (₹)" 
                type="number" 
                placeholder="0" 
                value={details.amount} 
                onChange={(e) => handleInputChange('amount', e.target.value)} 
            />

            <div className="pt-4">
               <Button disabled={!isVerified || !details.holder || !details.amount} onClick={handlePayClick}>
                  {t('proceed_pay')} <ArrowRight size={18} />
               </Button>
            </div>
         </div>
      </div>
      
      <PinModal isOpen={isPinOpen} onClose={() => setIsPinOpen(false)} onSuccess={handlePinSuccess} />
    </div>
  );
};

export default SendToBank;