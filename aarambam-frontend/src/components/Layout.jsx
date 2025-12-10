import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Shield, FileText, BarChart3, LogOut } from 'lucide-react';
import Header from './common/Header'; // The global header with Back button
import Chatbot from './common/Chatbot'; // The Financial Advisor
import { useLanguage } from '../context/LanguageContext';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
      active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    <Icon size={22} className={active ? 'text-blue-600' : 'text-slate-400'} />
    <span className="text-sm tracking-wide">{label}</span>
  </Link>
);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest User');
  const { t } = useLanguage();

  // Load user name from local storage
  useEffect(() => {
    const data = localStorage.getItem('user_data');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            setUserName(parsed.name || 'Guest User');
        } catch (e) {
            console.error("Error parsing user data", e);
        }
    }
  }, []);

  const handleLogout = () => {
    // Clear Auth Token
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  // Helper to generate Page Titles dynamically
  const getTitle = () => {
    if (location.pathname === '/') return `Welcome, ${userName.split(' ')[0]}`;
    if (location.pathname === '/scan') return 'Scan & Pay';
    if (location.pathname === '/wallet') return 'Offline Wallet';
    if (location.pathname === '/send-bank') return 'Bank Transfer';
    if (location.pathname === '/send-mobile') return 'Send to Contact';
    if (location.pathname === '/cibil') return 'Credit Score';
    if (location.pathname === '/shield') return 'Scam Shield';
    if (location.pathname === '/form-filler') return 'AI Form Filler';
    if (location.pathname === '/history') return 'Transaction History';
    if (location.pathname === '/bills') return 'Bill Payments';
    
    // Fallback for any other route
    return location.pathname.replace('/', '').replace('-', ' ').toUpperCase();
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            A
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Aarambam</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Rural Fintech</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Home} label={t('dashboard')} to="/" active={location.pathname === '/'} />
          <SidebarItem icon={Wallet} label={t('wallet')} to="/wallet" active={location.pathname === '/wallet'} />
          <SidebarItem icon={BarChart3} label={t('cibil')} to="/cibil" active={location.pathname === '/cibil'} />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Utility</p>
          <SidebarItem icon={Shield} label={t('shield')} to="/shield" active={location.pathname === '/shield'} />
          <SidebarItem icon={FileText} label={t('formFiller')} to="/form-filler" active={location.pathname === '/form-filler'} />
        </nav>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all mt-auto mb-4 font-bold"
        >
            <LogOut size={22} />
            <span className="text-sm">Logout</span>
        </button>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {userName[0]}
            </div> 
            <div>
              <p className="text-sm font-bold text-slate-700">{userName}</p>
              <p className="text-xs text-slate-500">Verified User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        
        {/* Global Header (Back Button + Title) */}
        <Header title={getTitle()} />
        
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-6xl mx-auto w-full pb-24">
              <Outlet />
           </div>
        </div>
        
        {/* Financial Chatbot (Floating Widget) */}
        <Chatbot /> 

      </main>
    </div>
  );
};

export default Layout;