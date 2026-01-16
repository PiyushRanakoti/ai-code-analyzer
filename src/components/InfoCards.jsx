import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

const InfoCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex gap-4 items-start transition-all hover:border-emerald-500/20">
        <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">How it works</h4>
          <p className="text-xs text-slate-500 mt-1">Our models analyze structural patterns, variable naming, and logic flow typical of LLMs.</p>
        </div>
      </div>
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex gap-4 items-start transition-all hover:border-emerald-500/20">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Data Privacy</h4>
          <p className="text-xs text-slate-500 mt-1">Your code is processed securely and is never stored on our servers for training.</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
