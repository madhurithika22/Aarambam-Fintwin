import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const History = () => {
  const [filter, setFilter] = useState('All'); // All, Sent, Received

  const transactions = [
    { id: 1, name: "Swiggy Instamart", date: "Today, 10:30 AM", amount: 245, type: "debit", status: "Success" },
    { id: 2, name: "Ramesh Kumar", date: "Yesterday, 6:00 PM", amount: 8000, type: "debit", status: "Success" },
    { id: 3, name: "Cashback Reward", date: "Dec 05, 2025", amount: 45, type: "credit", status: "Success" },
    { id: 4, name: "Electricity Bill", date: "Dec 01, 2025", amount: 1250, type: "debit", status: "Failed" },
  ];

  const filteredTxns = filter === 'All' ? transactions : transactions.filter(t => filter === 'Sent' ? t.type === 'debit' : t.type === 'credit');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
             <Search size={20} />
          </button>
       </div>

       {/* Filters */}
       <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Sent', 'Received'].map(f => (
             <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
             >
                {f}
             </button>
          ))}
       </div>

       {/* List */}
       <div className="space-y-3">
          {filteredTxns.map((txn) => (
             <div key={txn.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                      {txn.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800">{txn.name}</h4>
                      <p className="text-xs text-slate-500">{txn.date}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                      {txn.type === 'credit' ? '+' : '-'} {formatCurrency(txn.amount)}
                   </p>
                   {txn.status === 'Failed' && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">Failed</span>}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default History;