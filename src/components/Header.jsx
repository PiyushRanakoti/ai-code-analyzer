import React from 'react';

const Header = ({ stats, themeColors, theme }) => {
  return (
    <header className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
      <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium mb-6">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${themeColors[theme].primary} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
          <span>{stats.totalScans} Total Scans</span>
        </div>
        <div className="w-px h-3 bg-slate-800" />
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
          <span>{stats.aiDetected} AI Flags</span>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-emerald-400 mb-4 tracking-tight uppercase animate-gradient-x">
        AI BASED CODE PLAGIARISM DETECTOR
      </h1>
      <p className="text-slate-400 text-base max-w-2xl mx-auto">
        Advanced detection system for identifying AI patterns in source code.
      </p>
    </header>
  );
};

export default Header;
