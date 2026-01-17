import React from 'react';
import { Sparkles, Download, FileText, Activity } from 'lucide-react';

const AnalysisReport = ({ result, streamedText, downloadPDFReport }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl flex-1 flex flex-col min-h-[400px] max-h-[600px] transition-all duration-500 hover:border-emerald-500/20 group">
      
      {/* Header Section */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800/50 shrink-0 bg-slate-900/20 rounded-t-2xl">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Analysis Insights
          </h3>
          
        </div>
        
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {streamedText ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="text-slate-300 font-sans text-sm md:text-[15px] leading-[1.8] tracking-wide whitespace-pre-wrap selection:bg-emerald-500/30">
              {/* This replaces raw text with styled sections if they exist */}
              {streamedText.split('\n').map((line, i) => (
                <p key={i} className={`${line.includes(':') ? 'text-white font-medium' : ''} mb-2`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 py-12">
            <div className="relative">
              <Activity className="w-10 h-10 opacity-10 text-emerald-400 animate-pulse" />
              <FileText className="w-10 h-10 absolute inset-0 opacity-20" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">Awaiting Intelligence</p>
              <p className="text-[11px] text-slate-600 mt-1 uppercase tracking-widest">Feed the AI to start analysis</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
     

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b98144;
        }
      `}</style>
    </div>
  );
};

export default AnalysisReport;