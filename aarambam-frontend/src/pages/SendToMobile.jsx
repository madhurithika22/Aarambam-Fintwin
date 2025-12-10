import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ShieldAlert, X, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PinModal from '../components/common/PinModal';
import { useVoice } from '../hooks/useVoice';

const SendToMobile = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [isPinOpen, setIsPinOpen] = useState(false);

  const dummyContacts = [
    { id: 1, name: "Amma", phone: "+91 98765 00001" },
    { id: 2, name: "Dad", phone: "+91 98765 00002" },
    { id: 3, name: "Ramesh (Shop)", phone: "+91 99887 77665" },
    { id: 4, name: "Priya", phone: "+91 63000 12345" },
  ];

  const requestPermission = () => {
    const allowed = window.confirm("Allow Aarambam to access contacts?");
    if (allowed) {
      setPermissionGranted(true);
      setContacts(dummyContacts);
      speak("Select a contact to send money to.");
    }
  };

  const initiatePayment = (contact) => {
    setSelectedContact(contact);
    setAmount('');
    setShowAmountModal(true);
    speak(`Enter amount to send to ${contact.name}`);
  };

  const handleProceedToPin = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setShowAmountModal(false);
    setIsPinOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinOpen(false);
    // Redirect to Success
    navigate('/payment-success', { 
        state: { amount: amount, receiver: selectedContact.name } 
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in relative">
      <h2 className="text-xl font-bold text-slate-800">Send to Mobile</h2>

      {!permissionGranted ? (
        <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-200 shadow-sm">
           <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600"><User size={32} /></div>
           <h3 className="text-lg font-bold text-slate-800 mb-2">Sync Contacts</h3>
           <p className="text-slate-500 text-sm mb-8">Find friends easily.</p>
           <Button onClick={requestPermission}>Allow Access</Button>
           <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1"><ShieldAlert size={12} /> Encrypted & Private</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-10">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
             </div>
          </div>
          <div className="space-y-2 pb-20">
             {contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(contact => (
                <div key={contact.id} onClick={() => initiatePayment(contact)} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 cursor-pointer group transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">{contact.name[0]}</div>
                      <div><h4 className="font-bold text-slate-800">{contact.name}</h4><p className="text-xs text-slate-500">{contact.phone}</p></div>
                   </div>
                   <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">Pay</button>
                </div>
             ))}
          </div>
        </>
      )}

      {/* Amount Modal */}
      {showAmountModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm md:rounded-3xl rounded-t-[2rem] p-6 shadow-2xl relative animate-slide-up">
            <button onClick={() => setShowAmountModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <div className="text-center mt-2 mb-8">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Paying to</p>
               <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl shadow-inner">{selectedContact.name[0]}</div>
                  <div><h3 className="text-xl font-bold text-slate-800">{selectedContact.name}</h3><p className="text-sm text-slate-500">{selectedContact.phone}</p></div>
               </div>
            </div>
            <div className="space-y-6">
               <Input label="Enter Amount" type="number" placeholder="₹ 0" value={amount} onChange={(e) => setAmount(e.target.value)} />
               <Button onClick={handleProceedToPin}>Proceed to Pay <ArrowRight size={18} /></Button>
            </div>
          </div>
        </div>
      )}
      
      <PinModal isOpen={isPinOpen} onClose={() => setIsPinOpen(false)} onSuccess={handlePinSuccess} />
    </div>
  );
};

export default SendToMobile;