import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {!isDashboard && (
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        <h2 className="text-xl font-bold text-slate-800">
          {title || (isDashboard ? 'Good Morning' : 'Aarambam')}
        </h2>
      </div>

      <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 relative hover:text-blue-600">
         <Bell size={20} />
         <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </header>
  );
};

export default Header;