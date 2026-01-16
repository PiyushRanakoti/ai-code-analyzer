import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle2, Loader2, Sparkles, Code2, Users, History, FileText, Info, Trash2, Copy, Check, Download, Clipboard } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('analysis_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('indigo');
  const [complexity, setComplexity] = useState(null);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('analysis_stats');
    return saved ? JSON.parse(saved) : { totalScans: 0, aiDetected: 0 };
  });

  const themeColors = {
    indigo: { primary: 'bg-indigo-600', hover: 'hover:bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'shadow-indigo-600/20', accent: 'indigo' },
    emerald: { primary: 'bg-emerald-600', hover: 'hover:bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-600/20', accent: 'emerald' },
    violet: { primary: 'bg-violet-600', hover: 'hover:bg-violet-500', text: 'text-violet-400', border: 'border-violet-500/20', glow: 'shadow-violet-600/20', accent: 'violet' },
  };

  useEffect(() => {
    localStorage.setItem('analysis_history', JSON.stringify(history));
    localStorage.setItem('analysis_stats', JSON.stringify(stats));
  }, [history, stats]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('analysis_history');
  };

  const streamText = async (text, speed = 20) => {
    setStreamedText("");
    for (let i = 0; i < text.length; i++) {
      setStreamedText(prev => prev + text[i]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  };

  const downloadReport = () => {
    if (!result && !streamedText) return;
    const report = `
AI CODE DETECTION REPORT
-----------------------
Date: ${new Date().toLocaleString()}
AI Confidence Score: ${result}%
Code Complexity: ${complexity || 'N/A'}

Analysis Summary:
${streamedText}

Code Snippet:
${code}
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Analysis_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateComplexity = (code) => {
    const lines = code.split('\n').length;
    if (lines < 10) return 'Low';
    if (lines < 50) return 'Medium';
    return 'High';
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError('');
    setComplexity(calculateComplexity(code));
    setStreamedText("AI is analyzing your code... Please wait");

    try {
      const res = await fetch("https://ai-backend-2snf.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) throw new Error("API failure");

      const data = await res.json();
      const ans = data.msg;
      
      const lines = ans.split('\n');
      const percentLine = lines[0];
      const textLines = lines.slice(1);
      
      const percent = parseInt(percentLine.replace('%', '').trim());
      const explanation = textLines.map(line => line.trimStart()).join('\n');

      setResult(percent);
      
      setStats(prev => ({
        totalScans: prev.totalScans + 1,
        aiDetected: percent > 50 ? prev.aiDetected + 1 : prev.aiDetected
      }));

      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        score: percent,
        snippet: code.substring(0, 60) + (code.length > 60 ? '...' : '')
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 10));

      await streamText(explanation, 10);
    } catch (e) {
      setError("⚠️ AI analysis is currently unavailable. Please try again later.");
      setResult(0);
      setStreamedText("Analysis failed. The external backend might be down.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 selection:bg-${themeColors[theme].accent}-500/30 transition-colors duration-500`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 -left-1/4 w-1/2 h-1/2 opacity-20 blur-[120px] rounded-full transition-colors duration-1000 ${themeColors[theme].primary}`} />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-end gap-2 mb-4">
          {Object.entries(themeColors).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${theme === key ? 'border-white scale-110' : 'border-transparent opacity-50'} ${config.primary}`}
            />
          ))}
        </div>
        <header className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium mb-6">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${themeColors[theme].primary} shadow-[0_0_8px_rgba(99,102,241,0.5)]`} />
              <span>{stats.totalScans} Total Scans</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span>{stats.aiDetected} AI Flags</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-4 tracking-tight">
            AI CODE DETECTOR
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Advanced detection system for identifying AI patterns in source code.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-4 w-px bg-slate-800" />
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-wider">
                    <Code2 className="w-3.5 h-3.5" />
                    editor.js
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePaste}
                    className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-slate-300 flex items-center gap-1 text-[10px]"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-slate-300"
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
                className="w-full h-[380px] bg-transparent p-6 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-600 scrollbar-thin scrollbar-thumb-slate-800"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className={`group relative flex items-center justify-center gap-2 w-full py-4 ${themeColors[theme].primary} ${themeColors[theme].hover} disabled:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg ${themeColors[theme].glow} active:scale-[0.98]`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Neural Analysis...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Check for AI Patterns
                </>
              )}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex gap-4 items-start">
                <div className={`p-2 rounded-lg ${themeColors[theme].text.replace('text', 'bg')}/10 ${themeColors[theme].text}`}>
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">How it works</h4>
                  <p className="text-xs text-slate-500 mt-1">Our models analyze structural patterns, variable naming, and logic flow typical of LLMs.</p>
                </div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Data Privacy</h4>
                  <p className="text-xs text-slate-500 mt-1">Your code is processed securely and is never stored on our servers for training.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${themeColors[theme].text}`} />
                  Live Score
                </h3>
                {complexity && (
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">
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
                        result > 50 ? 'text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : `text-${themeColors[theme].accent}-500`
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
                    <div className={`text-sm font-medium px-4 py-1.5 rounded-full border ${
                      result > 50 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {result > 50 ? 'Likely AI Generated' : 'Likely Human Written'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex-1 flex flex-col min-h-[300px] max-h-[500px]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${themeColors[theme].text}`} />
                  Analysis Report
                </h3>
                <div className="flex items-center gap-2">
                  {result !== null && (
                    <button 
                      onClick={downloadReport}
                      className={`p-1 text-slate-500 transition-colors ${themeColors[theme].hover.replace('bg', 'text')}`}
                      title="Download Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <div className={`h-2 w-2 rounded-full ${themeColors[theme].primary} animate-pulse`} />
                  <div className={`h-2 w-2 rounded-full ${themeColors[theme].primary}/60 animate-pulse delay-75`} />
                  <div className={`h-2 w-2 rounded-full ${themeColors[theme].primary}/30 animate-pulse delay-150`} />
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

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <History className={`w-4 h-4 ${themeColors[theme].text}`} />
                  History
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-slate-600 hover:text-rose-400 transition-colors">
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                {history.length === 0 ? (
                  <p className="text-[10px] text-slate-600 italic">No recent scans</p>
                ) : (
                  history.map((entry) => (
                    <div key={entry.id} className="group p-2 rounded-lg bg-slate-950/40 border border-slate-800/50 hover:border-slate-700 transition-all">
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
          </div>
        </main>

        <footer className="mt-12 pt-6 border-t border-slate-900 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs">Created by Team Greater Noida @ 2025</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
