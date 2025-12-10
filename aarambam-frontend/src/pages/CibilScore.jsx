import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';

const CibilScore = () => {
  const [score, setScore] = useState(0);

  // Animate the score on mount
  useEffect(() => {
    let current = 0;
    const target = 785;
    const timer = setInterval(() => {
      current += 15;
      if (current >= target) {
        setScore(target);
        clearInterval(timer);
      } else {
        setScore(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const getScoreColor = (s) => {
    if (s > 750) return 'text-green-600 bg-green-50 border-green-200';
    if (s > 650) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 text-center shadow-sm">
         <h2 className="text-xl font-bold text-slate-800 mb-2">Your Credit Score</h2>
         <p className="text-slate-500 text-sm mb-8">As of December 09, 2025</p>

         {/* Speedometer Simulation */}
         <div className="relative w-64 h-32 mx-auto overflow-hidden mb-6">
            <div className="absolute w-full h-full bg-slate-100 rounded-t-full"></div>
            <div 
                className="absolute w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-t-full origin-bottom transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${(score / 900) * 180 - 180}deg)` }}
            ></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white rounded-t-full flex items-end justify-center pb-2">
               <span className={`text-5xl font-black ${score > 750 ? 'text-green-600' : 'text-slate-800'}`}>{score}</span>
            </div>
         </div>

         <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm mb-6 ${getScoreColor(score)}`}>
            Excellent Score
         </div>

         <p className="text-slate-600 max-w-md mx-auto">
            Great job! Your score is higher than 85% of users. You are eligible for pre-approved loans up to ₹5 Lakhs.
         </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
            <div>
               <h4 className="font-bold text-slate-800">Payment History</h4>
               <p className="text-green-600 text-xs font-bold mt-1">100% On Time</p>
               <p className="text-xs text-slate-500 mt-1">No missed payments in last 12 months.</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><AlertTriangle size={24} /></div>
            <div>
               <h4 className="font-bold text-slate-800">Credit Mix</h4>
               <p className="text-orange-600 text-xs font-bold mt-1">Needs Attention</p>
               <p className="text-xs text-slate-500 mt-1">Consider adding a secured card.</p>
            </div>
         </div>
      </div>

      <Button variant="outline" className="mt-4">
         View Detailed Report <ChevronRight size={18} />
      </Button>
    </div>
  );
};

export default CibilScore;