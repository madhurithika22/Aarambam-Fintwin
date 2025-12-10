import React, { useState, useEffect } from 'react';
import { Megaphone, PlayCircle, Newspaper, PauseCircle } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../context/LanguageContext';

// A large pool of potential news to simulate daily updates
const NEWS_POOL = [
  {
    title: "PM Kisan Installment",
    desc: "The next installment of ₹2,000 will be credited to farmers' bank accounts next week. Check your status."
  },
  {
    title: "Free Ration Extended",
    desc: "The central government has extended the free ration scheme for another 5 years. Collect from your local shop."
  },
  {
    title: "Solar Pump Subsidy",
    desc: "Apply for PM-KUSUM scheme to get 60% subsidy on solar water pumps. Applications closing soon."
  },
  {
    title: "Kisan Credit Card Update",
    desc: "New interest rates for KCC loans announced. Farmers can now get loans at 4% interest for up to ₹3 Lakhs."
  },
  {
    title: "Crop Insurance Alert",
    desc: "Last date to pay premium for Kharif crops insurance is approaching. Protect your crops against rain damage."
  },
  {
    title: "Mandi Price Update",
    desc: "Wheat prices have increased by ₹50 per quintal in your local mandi today. Best time to sell."
  },
  {
    title: "Heavy Rain Warning",
    desc: "IMD predicts heavy rainfall in your district for the next 3 days. Please secure your harvested crops."
  },
  {
    title: "Sukanya Samriddhi Yojana",
    desc: "Interest rates for girl child savings scheme increased to 8.2%. Open an account at your nearest post office."
  },
  {
    title: "Aadhaar Seeding Mandatory",
    desc: "Link your Aadhaar with your bank account before the 30th to continue receiving gas subsidies."
  },
  {
    title: "Nano Urea Available",
    desc: "IFFCO Nano Urea is now available at all cooperative societies. It increases yield by 8%."
  }
];

const DailyUpdates = () => {
  const { speak } = useVoice();
  const [todaysNews, setTodaysNews] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const { t } = useLanguage();

  // Logic to pick 3 random news items based on the "Date"
  // This ensures news changes every day but stays same throughout the day
  useEffect(() => {
    const today = new Date().getDate(); // Returns 1-31
    const newsCount = NEWS_POOL.length;
    
    // Simple algorithm to pick pseudo-random indices based on date
    const index1 = today % newsCount;
    const index2 = (today + 3) % newsCount;
    const index3 = (today + 7) % newsCount;

    setTodaysNews([
      { ...NEWS_POOL[index1], id: 1 },
      { ...NEWS_POOL[index2], id: 2 },
      { ...NEWS_POOL[index3], id: 3 }
    ]);
  }, []);

  const handleRead = (item) => {
    if (playingId === item.id) {
        window.speechSynthesis.cancel();
        setPlayingId(null);
    } else {
        setPlayingId(item.id);
        speak(`${item.title}. ${item.desc}`);
        
        // Reset icon after speaking (approx duration calculation)
        const duration = item.desc.length * 80; 
        setTimeout(() => setPlayingId(null), duration);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm mt-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
            <Megaphone size={22} />
          </div>
          <div>
             <h3 className="text-lg font-bold text-slate-800">{t('govtSchemes')}</h3>
             <p className="text-xs text-slate-500">{t('tapListen')} • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Newspaper size={12} /> {t('dailyUpdates')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {todaysNews.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleRead(item)}
            className={`text-left p-5 rounded-2xl border transition-all group flex flex-col h-full ${playingId === item.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-slate-50 border-slate-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start w-full mb-3">
              <h4 className={`font-bold text-sm leading-tight pr-2 ${playingId === item.id ? 'text-white' : 'text-slate-800 group-hover:text-blue-700'}`}>
                {item.title}
              </h4>
              {playingId === item.id ? (
                  <PauseCircle size={20} className="text-white shrink-0 animate-pulse" />
              ) : (
                  <PlayCircle size={20} className="text-slate-300 group-hover:text-blue-600 shrink-0" />
              )}
            </div>
            
            <p className={`text-xs leading-relaxed line-clamp-3 ${playingId === item.id ? 'text-blue-100' : 'text-slate-500'}`}>
               {item.desc}
            </p>

            <div className={`mt-auto pt-3 flex items-center gap-1 text-[10px] font-bold ${playingId === item.id ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-500'}`}>
               {playingId === item.id ? t('playing') : t('clickListen')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyUpdates;