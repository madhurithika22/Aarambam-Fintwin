import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, MessageSquare, ExternalLink, XCircle } from 'lucide-react';
import Button from '../components/common/Button';

const ScamShield = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | analyzing | safe | danger
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    setStatus('analyzing');
    
    // SIMULATION: Logic to detect keywords
    setTimeout(() => {
      const lowerText = inputText.toLowerCase();
      const isSuspicious = lowerText.includes('lottery') || lowerText.includes('winner') || lowerText.includes('click here') || lowerText.includes('kyc suspended');
      
      if (isSuspicious) {
        setStatus('danger');
        setResult({
          score: 15,
          title: "High Risk Detected",
          message: "This message contains patterns commonly used in phishing attacks. Do not click any links.",
          flags: ["Urgency ('Suspended')", "Unknown Link", "Monetary Promise"]
        });
      } else {
        setStatus('safe');
        setResult({
          score: 98,
          title: "Message Appears Safe",
          message: "No suspicious keywords or malicious links were found in this text.",
          flags: []
        });
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* 1. HERO SECTION: The Status Monitor */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 text-center transition-all duration-500 ${
        status === 'danger' ? 'bg-red-50 ring-4 ring-red-100' : 
        status === 'safe' ? 'bg-green-50 ring-4 ring-green-100' : 
        'bg-white border border-slate-200 shadow-sm'
      }`}>
        
        {/* Animated Background Pulse */}
        {status === 'analyzing' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-100 rounded-full animate-ping opacity-20"></div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${
            status === 'danger' ? 'bg-red-100 text-red-600' :
            status === 'safe' ? 'bg-green-100 text-green-600' :
            status === 'analyzing' ? 'bg-brand-100 text-brand-600 animate-pulse' :
            'bg-slate-100 text-slate-400'
          }`}>
            {status === 'danger' ? <XCircle size={48} /> :
             status === 'safe' ? <CheckCircle size={48} /> :
             <Shield size={48} />}
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${
            status === 'danger' ? 'text-red-700' : 
            status === 'safe' ? 'text-green-700' : 
            'text-slate-800'
          }`}>
            {status === 'idle' ? 'Scam Shield Protection' :
             status === 'analyzing' ? 'Scanning Message...' :
             result?.title}
          </h2>

          <p className="text-slate-500 max-w-lg mx-auto">
            {status === 'idle' ? 'Paste any SMS, WhatsApp message, or email content below to check if it is a scam.' :
             result?.message}
          </p>
        </div>
      </div>

      {/* 2. INPUT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Input Area */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
           <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
              <MessageSquare size={18} className="text-brand-500" />
              Paste Suspicious Text
           </label>
           
           <textarea 
             className="w-full h-40 bg-slate-50 rounded-xl p-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none mb-4 placeholder:text-slate-400"
             placeholder="e.g. 'Your bank account will be blocked today. Click here to update KYC...'"
             value={inputText}
             onChange={(e) => {
               setInputText(e.target.value);
               if(status !== 'idle') setStatus('idle'); // Reset on type
             }}
           />
           
           <div className="flex gap-4">
             <Button onClick={handleAnalyze} disabled={!inputText || status === 'analyzing'}>
               {status === 'analyzing' ? 'Analyzing...' : 'Analyze Now'}
             </Button>
             <button onClick={() => setInputText('')} className="px-6 font-bold text-slate-500 hover:text-slate-700">Clear</button>
           </div>
        </div>

        {/* Right: Risk Indicators (Only visible when result exists) */}
        <div className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col transition-opacity duration-500 ${status === 'idle' || status === 'analyzing' ? 'opacity-50 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
           <h3 className="font-bold text-slate-800 mb-6">Analysis Report</h3>
           
           {/* Speedometer / Score */}
           <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-slate-500">Safety Score</span>
              <div className={`text-2xl font-black ${result?.score < 50 ? 'text-red-600' : 'text-green-600'}`}>
                 {result?.score || 0}/100
              </div>
           </div>

           {/* Flags List */}
           <div className="space-y-3 mb-6">
              {result?.flags.length > 0 ? (
                result.flags.map((flag, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg font-medium">
                     <AlertTriangle size={16} />
                     {flag}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg font-medium">
                   <CheckCircle size={16} />
                   No red flags detected
                </div>
              )}
           </div>

           <div className="mt-auto pt-6 border-t border-slate-100">
              <a href="#" className="flex items-center justify-center gap-2 text-brand-600 font-bold text-sm hover:underline">
                 Report to Cyber Cell <ExternalLink size={14} />
              </a>
           </div>
        </div>

      </div>

      {/* 3. Recent Scams Ticker (Educational) */}
      <div className="mt-8">
         <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Trending Scams in Your Area</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
               <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><AlertTriangle size={20} /></div>
               <div>
                  <p className="font-bold text-slate-700 text-sm">Electricity Bill Fraud</p>
                  <p className="text-xs text-slate-500 mt-1">SMS claiming power will be cut tonight unless bill paid via link.</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
               <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><AlertTriangle size={20} /></div>
               <div>
                  <p className="font-bold text-slate-700 text-sm">Part-time Job Scam</p>
                  <p className="text-xs text-slate-500 mt-1">WhatsApp messages offering ₹5000/day for liking YouTube videos.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ScamShield;