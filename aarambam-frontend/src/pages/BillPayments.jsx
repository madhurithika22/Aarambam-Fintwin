import React from 'react';
import { Smartphone, Zap, Droplet, Tv, Flame, Wifi, CreditCard, GraduationCap } from 'lucide-react';

const BillItem = ({ icon: Icon, label, color }) => (
  <button className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all aspect-square">
     <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={24} />
     </div>
     <span className="text-sm font-bold text-slate-700">{label}</span>
  </button>
);

const BillPayments = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
             <h2 className="text-2xl font-bold mb-2">Pay Bills & Recharges</h2>
             <p className="text-blue-100 text-sm">Pay electricity, water, gas and more securely.</p>
          </div>
          <Zap className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-blue-500 opacity-50" />
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BillItem icon={Smartphone} label="Mobile Recharge" color="bg-blue-50 text-blue-600" />
          <BillItem icon={Zap} label="Electricity" color="bg-yellow-50 text-yellow-600" />
          <BillItem icon={Tv} label="DTH / Cable" color="bg-purple-50 text-purple-600" />
          <BillItem icon={Wifi} label="Broadband" color="bg-indigo-50 text-indigo-600" />
          <BillItem icon={Droplet} label="Water Bill" color="bg-cyan-50 text-cyan-600" />
          <BillItem icon={Flame} label="Gas Cylinder" color="bg-red-50 text-red-600" />
          <BillItem icon={CreditCard} label="Credit Card" color="bg-emerald-50 text-emerald-600" />
          <BillItem icon={GraduationCap} label="Education Fees" color="bg-orange-50 text-orange-600" />
       </div>
    </div>
  );
};

export default BillPayments;