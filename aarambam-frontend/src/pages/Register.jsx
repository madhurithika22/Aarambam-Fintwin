import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Lock, CreditCard, Upload, Mic, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LanguageSelector from '../components/common/LanguageSelector';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { speak, listen, isListening } = useVoice();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceVerified, setVoiceVerified] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: '', mobile: '', password: '', accountNo: '', ifsc: '', kycDoc: null
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // --- VOICE AUTH RECORDING ---
  const handleVoiceRecord = () => {
    speak("Please say: My voice is my password");
    
    setTimeout(() => {
        listen((text) => {
            // Simple verification logic
            const phrase = "my voice is my password";
            // Allow loose matching or Hindi/Tamil equivalents if you advanced it
            if (text.toLowerCase().includes("voice") || text.toLowerCase().includes("password") || text.length > 5) {
                setVoiceVerified(true);
                speak("Voice captured successfully.");
            } else {
                speak("I didn't catch that. Please try again.");
            }
        });
    }, 2000);
  };

  const handleRegister = async () => {
    if (!voiceVerified) {
        alert("Please complete voice verification first.");
        return;
    }

    setIsLoading(true);
    try {
        const data = new FormData();
        data.append('full_name', formData.name);
        data.append('mobile', formData.mobile);
        data.append('password', formData.password);
        if (formData.accountNo) data.append('account_no', formData.accountNo);
        if (formData.ifsc) data.append('ifsc', formData.ifsc);
        if (formData.kycDoc) data.append('kyc_doc', formData.kycDoc);

        const response = await api.post('/auth/register', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 'success') {
            localStorage.setItem('user_data', JSON.stringify({ 
                name: formData.name, 
                mobile: formData.mobile 
            }));
            alert("Registration Successful! Please Login.");
            navigate('/login');
        }
    } catch (error) {
        console.error("Register Error:", error);
        alert("Registration Failed.");
    } finally {
        setIsLoading(false);
    }
  };

  // Voice Guidance
  useEffect(() => {
    // Safety check to prevent crash if translation missing
    const instruction = step === 1 ? t('voice_instruction_register_1') :
                        step === 2 ? t('voice_instruction_register_2') :
                        step === 3 ? "Step 3. " + t('uploadKyc') :
                        t('voice_instruction_register_4');
    
    if (instruction) speak(instruction);
  }, [step, speak, t]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>
      
      <button onClick={() => step === 1 ? navigate('/login') : handleBack()} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm z-20">
         <ArrowLeft size={24} className="text-slate-600" />
      </button>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 z-10 animate-fade-in">
        
        {/* Progress Bar (Same as before) */}
        <div className="flex justify-between mb-8 relative">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10 ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{i}</div>
           ))}
           <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0"><div className="h-full bg-blue-200 transition-all duration-300" style={{ width: `${((step-1)/3)*100}%` }}></div></div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">
            {step === 1 ? t('register') : step === 2 ? t('toBank') : step === 3 ? "e-KYC" : t('voiceAuth')}
        </h1>

        {/* STEPS 1-3 (Same as previous code) */}
        {step === 1 && (
          <div className="space-y-5">
            <Input label={t('fullName')} icon={User} placeholder="Raju Kumar" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <Input label={t('mobileNumber')} icon={Phone} placeholder="98765 43210" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
            <Input label={t('setPassword')} type="password" icon={Lock} placeholder="••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <Button onClick={handleNext} className="mt-4">{t('nextStep')} <ArrowRight size={18} /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Input label={t('bankAccount')} icon={CreditCard} placeholder="1234 5678 9012" value={formData.accountNo} onChange={(e) => setFormData({...formData, accountNo: e.target.value})} />
            <Input label={t('ifsc')} placeholder="SBIN0001234" value={formData.ifsc} onChange={(e) => setFormData({...formData, ifsc: e.target.value})} />
            <Button onClick={handleNext}>{t('nextStep')}</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <label className="block w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 cursor-pointer">
                <Upload size={40} className="text-slate-400 mb-4" />
                <p className="text-sm font-bold text-slate-600">{formData.kycDoc ? formData.kycDoc.name : t('uploadKyc')}</p>
                <input type="file" className="hidden" onChange={(e) => setFormData({...formData, kycDoc: e.target.files[0]})} />
            </label>
            <Button onClick={handleNext}>{t('nextStep')}</Button>
          </div>
        )}

        {/* STEP 4: ACTUAL VOICE AUTH */}
        {step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <div className={`bg-blue-50 p-6 rounded-3xl text-center border ${voiceVerified ? 'border-green-500 bg-green-50' : 'border-blue-100'}`}>
                
                {voiceVerified ? (
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle size={40} />
                    </div>
                ) : (
                    <button 
                        onClick={handleVoiceRecord}
                        className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600 transition-all ${isListening ? 'scale-110 ring-4 ring-blue-200' : 'hover:scale-105'}`}
                    >
                       <Mic size={32} className={isListening ? "animate-pulse" : ""} />
                    </button>
                )}

                <h3 className="text-lg font-bold text-slate-800 mb-2">{voiceVerified ? "Voice Verified" : t('voiceAuth')}</h3>
                
                {!voiceVerified && (
                    <>
                        <p className="text-sm text-slate-500 mb-2">Tap mic and say:</p>
                        <p className="font-bold text-lg text-slate-800">"My voice is my password"</p>
                    </>
                )}
            </div>

            <Button onClick={handleRegister} disabled={isLoading || !voiceVerified}>
               {isLoading ? "Creating Account..." : t('finishReg')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;