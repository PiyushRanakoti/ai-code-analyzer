import React from 'react';
import { Sparkles, Download, FileText } from 'lucide-react';

const AnalysisReport = ({ result, streamedText, downloadPDFReport }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex-1 flex flex-col min-h-[300px] max-h-[500px] transition-all duration-500 hover:border-emerald-500/30">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Analysis Report
        </h3>
        <div className="flex items-center gap-2">
          {result !== null && (
            <button 
              onClick={downloadPDFReport}
              className="p-1.5 rounded-md text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
              title="Download PDF Report"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-emerald-600/60 animate-pulse delay-75" />
          <div className="h-2 w-2 rounded-full bg-emerald-600/30 animate-pulse delay-150" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-2">
        <div className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {streamedText || (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3 py-12">
              <FileText className="w-8 h-8 opacity-20" />
              <p className="italic">Waiting for neural processing...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
