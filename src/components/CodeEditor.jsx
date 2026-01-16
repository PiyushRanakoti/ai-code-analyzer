import React from 'react';
import { Code2, Download, Clipboard, Copy, Check, Trash2 } from 'lucide-react';

const CodeEditor = ({ code, setCode, handlePaste, copyToClipboard, copied, themeColors, theme }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className={`flex items-center gap-2 ${themeColors[theme].text} text-xs font-mono uppercase tracking-wider`}>
            <Code2 className="w-3.5 h-3.5" />
            editor.js
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.js,.py,.cpp,.java,.txt';
              fileInput.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (re) => setCode(re.target.result);
                reader.readAsText(file);
              };
              fileInput.click();
            }}
            className="p-1.5 hover:bg-emerald-500/10 rounded-md transition-colors text-slate-500 hover:text-emerald-400 flex items-center gap-1 text-[10px]"
            title="Upload file"
          >
            <Download className="w-3.5 h-3.5 rotate-180" />
            Upload
          </button>
          <button 
            onClick={handlePaste}
            className="p-1.5 hover:bg-emerald-500/10 rounded-md transition-colors text-slate-500 hover:text-emerald-400 flex items-center gap-1 text-[10px]"
            title="Paste from clipboard"
          >
            <Clipboard className="w-4 h-4" />
            Paste
          </button>
          <button 
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-emerald-500/10 rounded-md transition-colors text-slate-500 hover:text-emerald-400"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setCode('')}
            className="p-1.5 hover:bg-rose-500/10 rounded-md transition-colors text-slate-500 hover:text-rose-400"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here and let AI review it..."
        className="w-full h-[380px] bg-transparent p-6 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-600 scrollbar-thin scrollbar-thumb-slate-800 focus:bg-emerald-500/[0.02] transition-colors"
      />
    </div>
  );
};

export default CodeEditor;
