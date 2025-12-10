import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mic, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LanguageSelector from '../components/common/LanguageSelector';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api'; // Ensure API is imported

const Login = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { t } = useLanguage();
  
  // State
  const [registeredName, setRegisteredName] = useState('');
  const [registeredMobile, setRegisteredMobile] = useState(''); // Store mobile number
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load User Data on Mount
  useEffect(() => {
    const data = localStorage.getItem('user_data');
    if (data) {
        try {
            const userData = JSON.parse(data);
            setRegisteredName(userData.name);
            setRegisteredMobile(userData.mobile); // <--- LOAD MOBILE NUMBER
            
            const greeting = `${t('welcomeBack')} ${userData.name.split(' ')[0]}. ${t('voice_instruction_login')}`;
            speak(greeting);
        } catch (e) {
            console.error("Error parsing user data");
        }
    } else {
        speak(t('welcome'));
    }
  }, [speak, t]); 

  // --- LOGIN LOGIC ---
  const performLogin = (token, userData) => {
    // Save Token & Data from Backend Response
    localStorage.setItem('user_token', token);
    if(userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
    }
    
    speak("Login successful."); 
    navigate('/'); 
  };

  const handlePasswordLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
        if (!password) {
            throw new Error("Please enter your password.");
        }

        // Use the mobile number from storage, or fallback if testing
        const mobileToSend = registeredMobile || "9876543210";

        console.log("Attempting Login with:", { mobile: mobileToSend, password }); // Debugging

        // 1. Call Backend Login API
        const response = await api.post('/auth/login', {
            mobile: mobileToSend, 
            password: password.toString() // Ensure it's a string
        });

        // 2. Success
        if (response.data.status === 'success') {
            // Save Token
            localStorage.setItem('user_token', response.data.token);
            // Update User Data with real data from DB
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
            navigate('/');
        }
    } catch (error) {
        console.error("Login Error:", error);
        // Better error handling
        const msg = error.response?.data?.detail || error.message || "Login Failed. Server Error.";
        setError(msg);
        speak(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const handleVoiceAuth = () => {
    setError('');
    setIsLoading(true);
    speak(t('voiceAuth') + "..."); 

    setTimeout(() => {
      setIsLoading(false);
      // SIMULATION: 80% Success Rate
      const isSuccess = Math.random() > 0.2; 

      if (isSuccess) {
        // For voice auth simulation, we assume success if user is locally known
        performLogin('demo_voice_token', { name: registeredName, mobile: registeredMobile });
      } else {
        const msg = "Voice verification failed. Please try again or use password.";
        setError(msg);
        speak(msg);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 z-10 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-200">
            A
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
             {registeredName ? `${t('welcomeBack')}, ${registeredName.split(' ')[0]}` : t('welcome')}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">{t('loginSubtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Hidden Mobile Input (Optional: Show only if no local user found) */}
          {!registeredMobile && (
             <Input 
               label="Mobile Number" 
               value={registeredMobile} 
               onChange={(e) => setRegisteredMobile(e.target.value)} 
               placeholder="9876543210"
             />
          )}

          <Input 
            label="Password / PIN" 
            type="password"
            placeholder="Enter Password" 
            icon={Lock} 
            value={password}
            isNumeric={true} 
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />

          <Button onClick={handlePasswordLogin} disabled={isLoading}>
             {isLoading ? (
               <div className="flex items-center gap-2">
                 <Loader2 className="animate-spin" size={20} /> Verifying...
               </div>
             ) : (
               t('loginBtn')
             )}
          </Button>

          <div className="mt-4">
             <button 
               onClick={handleVoiceAuth} 
               disabled={isLoading}
               className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all disabled:opacity-50 group"
             >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                   <Mic size={24} />
                </div>
                <span className="text-sm font-bold text-slate-700">{t('voiceAuth')}</span>
             </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {t('newUser')} <Link to="/register" className="text-blue-600 font-bold hover:underline">{t('register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;