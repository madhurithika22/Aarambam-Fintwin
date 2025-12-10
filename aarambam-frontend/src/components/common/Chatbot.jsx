import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Sparkles, Bot } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am your Aarambam Financial Advisor. Ask me about loans, savings, or government schemes.", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { speak, listen, isListening } = useVoice();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Simple "AI" Logic for Financial Advice
  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('loan')) return "For agricultural loans, you can apply for a Kisan Credit Card (KCC) which offers interest rates as low as 4%. Would you like to check your eligibility?";
    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) return "To save money on micro-transactions, try using our 'Round-Up' feature. Putting aside just ₹10 daily can grow to ₹3,600 in a year!";
    if (lowerQuery.includes('scheme') || lowerQuery.includes('govt')) return "Currently, the PM Kisan Samman Nidhi and PM-KUSUM (Solar Pumps) are active. Check the 'Daily Updates' section on your dashboard for details.";
    if (lowerQuery.includes('scam') || lowerQuery.includes('fraud')) return "Never share your UPI PIN or OTP with anyone calling you. Bank officials will never ask for these details.";
    if (lowerQuery.includes('balance')) return "You can check your balance on the Dashboard by clicking the 'Eye' icon. For security, I cannot read it out here.";
    if (lowerQuery.includes('invest')) return "For safe investments with small amounts, consider a Recurring Deposit (RD) starting at just ₹100/month at your local post office.";
    
    return "I can help you manage your money better. Try asking about 'Kisan Credit Card', 'Saving Tips', or 'Safe Banking'.";
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Simulate AI Delay & Response
    setTimeout(() => {
      const responseText = generateResponse(userMsg.text);
      const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // 3. Speak the response automatically
      speak(responseText);
    }, 1500);
  };

  const handleMicClick = () => {
    listen((text) => {
      setInputText(text);
      // Optional: Auto-send after voice input
      // handleSend(); 
    });
  };

  return (
    <>
      {/* Launcher Button (Bottom Right) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'}`}
      >
        {isOpen ? <X color="white" size={28} /> : <MessageCircle color="white" size={28} />}
        {!isOpen && <span className="hidden md:block text-white font-bold pr-2">Ask Advisor</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-slide-up flex flex-col max-h-[500px]">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-full">
                <Bot className="text-white" size={24} />
             </div>
             <div>
                <h3 className="text-white font-bold text-lg">Fin-Advisor</h3>
                <p className="text-blue-100 text-xs flex items-center gap-1">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[300px]">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                 }`}>
                    {msg.sender === 'bot' && <Sparkles size={12} className="text-orange-500 mb-1" />}
                    {msg.text}
                 </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
             <button 
               onClick={handleMicClick}
               className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
             >
                <Mic size={20} />
             </button>
             
             <input 
               type="text" 
               placeholder="Ask about loans..." 
               className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
             />
             
             <button 
               onClick={handleSend}
               disabled={!inputText.trim()}
               className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                <Send size={20} />
             </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;