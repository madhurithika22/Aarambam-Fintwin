import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Zap, Image as ImageIcon, ArrowRight, ShieldCheck, Zap as ZapFast } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PinModal from '../components/common/PinModal';
import { useVoice } from '../hooks/useVoice';

const ScanPay = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  
  // States: 'permission' -> 'scanning' -> 'amount' -> 'pin' (maybe) -> 'success'
  const [step, setStep] = useState('permission'); 
  const [scannedData, setScannedData] = useState(null);
  const [amount, setAmount] = useState('');
  const [isPinOpen, setIsPinOpen] = useState(false);
  const videoRef = useRef(null);

  // 1. Handle Camera Permission
  const startCamera = async () => {
    try {
      // In a real app, this actually starts the camera
      // await navigator.mediaDevices.getUserMedia({ video: true });
      setStep('scanning');
      speak("Align the QR code within the frame.");
    } catch (err) {
      alert("Camera access denied");
    }
  };

  // 2. Simulate Scanning Process
  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => {
        // Simulate finding a QR code
        setScannedData({ receiver: "Ramesh Kirana Store", upiId: "ramesh@upi" });
        setStep('amount');
        speak("QR code detected. Paying Ramesh Kirana Store. Please enter amount.");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, speak]);

  // 3. Handle Payment Logic (The < 500 Rule)
  const handleProceed = () => {
    if (!amount || Number(amount) <= 0) return alert("Enter valid amount");
    
    const value = Number(amount);
    
    if (value < 500) {
        // UPI LITE MODE: Skip PIN
        speak(`Amount is less than 500. Sending ${value} rupees securely without PIN.`);
        completeTransaction();
    } else {
        // STANDARD MODE: Ask PIN
        speak(`Amount is ${value}. Please enter your UPI PIN to confirm.`);
        setIsPinOpen(true);
    }
  };

  const completeTransaction = () => {
    navigate('/payment-success', { 
      state: { amount: amount, receiver: scannedData.receiver } 
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-fade-in">
      
      {/* --- STEP 1: PERMISSION REQUEST --- */}
      {step === 'permission' && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-sm w-full border border-slate-100">
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 animate-pulse">
              <Camera size={40} />
           </div>
           <h2 className="text-xl font-bold text-slate-800 mb-3">Allow Camera Access</h2>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">
             Aarambam needs access to your camera to scan UPI QR codes securely.
           </p>
           <Button onClick={startCamera}>
              Allow Access
           </Button>
           <button onClick={() => navigate('/')} className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600">
              Cancel
           </button>
        </div>
      )}

      {/* --- STEP 2: CAMERA UI (Scanning) --- */}
      {step === 'scanning' && (
        <div className="relative w-full max-w-md bg-black rounded-[3rem] overflow-hidden shadow-2xl aspect-[9/16] max-h-[600px]">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
               <div className="text-white/30 flex flex-col items-center gap-2">
                   <Camera size={48} />
                   <p className="text-xs font-bold uppercase tracking-widest">Searching for QR...</p>
               </div>
               
               {/* Scanner Overlay */}
               <div className="absolute inset-0 z-10">
                   <div className="w-64 h-64 border-2 border-white/50 rounded-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_linear_infinite]"></div>
                   </div>
               </div>
          </div>
  
          {/* Controls */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-20">
              <button onClick={() => navigate('/')} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"><X size={20} /></button>
              <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Zap size={20} /></button>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent z-20 flex flex-col items-center">
             <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><ImageIcon size={20} /></div>
                <span className="text-xs font-bold">Upload from Gallery</span>
             </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: AMOUNT ENTRY UI --- */}
      {step === 'amount' && scannedData && (
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-slide-up">
           <div className="text-center mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Paying to</p>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                 {scannedData.receiver[0]}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{scannedData.receiver}</h2>
              <p className="text-sm text-slate-500">{scannedData.upiId}</p>
           </div>

           <div className="space-y-6">
              <div className="relative">
                 <span className="absolute top-1/2 -translate-y-1/2 left-4 text-2xl font-bold text-slate-400">₹</span>
                 <input 
                   type="number" 
                   autoFocus
                   placeholder="0"
                   className="w-full text-center text-4xl font-bold text-slate-800 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                 />
              </div>

              {/* Dynamic Button based on Amount */}
              <Button onClick={handleProceed} className={amount && Number(amount) < 500 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600'}>
                 {amount && Number(amount) < 500 ? (
                    <>
                       <ZapFast size={18} className="animate-pulse" /> Pay Fast (No PIN)
                    </>
                 ) : (
                    <>
                       Pay Securely <ArrowRight size={18} />
                    </>
                 )}
              </Button>

              {amount && Number(amount) < 500 && (
                 <p className="text-xs text-center text-green-600 font-bold flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> UPI Lite Enabled
                 </p>
              )}
           </div>
        </div>
      )}

      {/* PIN Modal (Only appears if Amount >= 500) */}
      <PinModal 
        isOpen={isPinOpen} 
        onClose={() => setIsPinOpen(false)} 
        onSuccess={() => { setIsPinOpen(false); completeTransaction(); }} 
      />
    </div>
  );
};

export default ScanPay;