import React from 'react';
import { FileText } from 'lucide-react';

const ScoreDisplay = ({ result, complexity }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          Confidence Score
        </h3>
        {complexity && (
          <span className="text-[10px] bg-emerald-500/10 px-1 py-1 rounded text-emerald-400 border border-emerald-500/20">
            Complexity: {complexity}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-800" />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={439.8}
              strokeDashoffset={439.8 - (439.8 * (result || 0)) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${
                result > 75 ? 'text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-emerald-500'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-white">{result || 0}%</span>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Confidence</span>
          </div>
        </div>
        <div className="text-center">
          {result !== null && (
            <div className={`text-sm font-medium px-4 py-1.5 rounded-full border animate-in zoom-in duration-300 ${
              result > 75
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {result > 75 ? 'Likely AI Generated' : 'Likely Human Written'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
