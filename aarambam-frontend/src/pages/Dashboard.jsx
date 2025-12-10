import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Smartphone, Zap, CreditCard, History, ShieldCheck, User, ScanLine } from 'lucide-react';
import BalanceCard from '../components/dashboard/BalanceCard';
import DailyUpdates from '../components/dashboard/DailyUpdates';
import { useLanguage } from '../context/LanguageContext';

// Reusable Action Button Component
const ActionButton = ({ icon: Icon, label, color, to }) => (
  <Link 
    to={to || "#"} 
    className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group bg-transparent"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 shadow-sm ${color || 'bg-blue-50 text-blue-600'}`}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 text-center">{label}</span>
  </Link>
);

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in pb-10"> 
      
      {/* 1. Top Section: Balance & Security Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card (Takes up 2/3 width) */}
        <div className="lg:col-span-2">
           <BalanceCard />
        </div>
        
        {/* Security Insight Widget (Takes up 1/3 width) */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-2 text-orange-500 mb-3">
                 <ShieldCheck size={20} />
                 <span className="text-xs font-bold uppercase tracking-widest">{t('securityAlert')}</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{t('spamBlocked')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                 We blocked a suspicious message from "LM-WINLTO" claiming you won a lottery. No action needed.
              </p>
           </div>
           <Link to="/shield">
             <button className="w-full py-3 mt-4 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:border-blue-200 hover:text-blue-600 transition-colors">
                View Shield Report
             </button>
           </Link>
        </div>
      </div>

      {/* 2. Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">{t('transferPay')}</h3>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {/* Core Payments */}
            <ActionButton icon={ScanLine} label={t('scan')} to="/scan" />
            <ActionButton icon={Send} label={t('toMobile')} to="/send-mobile" />
            <ActionButton icon={User} label={t('toBank')} to="/send-bank" />
            <ActionButton icon={History} label={t('history')} to="/history" />
            
            {/* Utilities - Linked to NEW Pages */}
            <ActionButton icon={Smartphone} label={t('recharge')} to="/recharge" />
            <ActionButton icon={Zap} label={t('electricity')} color="bg-yellow-50 text-yellow-600" to="/electricity" />
            
            {/* Other Utilities */}
            <ActionButton icon={CreditCard} label={t('cards')} color="bg-purple-50 text-purple-600" to="/bills" />
            
            {/* Empty Slot for alignment (Insurance removed) */}
            <div className="hidden md:block"></div> 
        </div>
      </div>

      {/* 3. Daily News Updates */}
      <DailyUpdates />

    </div>
  );
};

export default Dashboard;