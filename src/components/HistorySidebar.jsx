import React from 'react';
import { History as HistoryIcon, Trash2 } from 'lucide-react';

const HistorySidebar = ({ history, clearHistory }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-emerald-400" />
          History
        </h3>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-[10px] text-slate-600 hover:text-rose-400 transition-colors">
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
        {history.length === 0 ? (
          <p className="text-[10px] text-slate-600 italic">No recent scans</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="group p-2 rounded-lg bg-slate-950/40 border border-slate-800/50 hover:border-emerald-700 transition-all">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold ${entry.score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {entry.score}% AI
                </span>
                <span className="text-[9px] text-slate-600">{entry.date.split(',')[0]}</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate font-mono">
                {entry.snippet}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
