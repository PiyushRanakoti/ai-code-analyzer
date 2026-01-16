import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle2, Loader2, Sparkles, Code2, Users } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState('');

  const streamText = async (text, speed = 20) => {
    setStreamedText("");
    for (let i = 0; i < text.length; i++) {
      setStreamedText(prev => prev + text[i]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError('');
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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Plagiarism Guard</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-6">
            AI CODE DETECTOR
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Identify AI-generated patterns in your code with high precision.
            Paste your snippets below for instant verification.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editor Area */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5" />
                  code_input.js
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here and let AI review it..."
                className="w-full h-[400px] bg-transparent p-6 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-600 scrollbar-thin scrollbar-thumb-slate-800"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className="group relative flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Logic...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Analyze Code
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={502.65}
                    strokeDashoffset={502.65 - (502.65 * (result || 0)) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${
                      result > 50 ? 'text-rose-500' : 'text-indigo-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold text-white">{result || 0}%</span>
                  <span className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">AI Score</span>
                </div>
              </div>

              <div className="w-full text-center">
                {result !== null ? (
                  result > 50 ? (
                    <div className="flex items-center justify-center gap-2 text-rose-400 font-medium">
                      <ShieldAlert className="w-5 h-5" />
                      Significant AI Detection
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-5 h-5" />
                      Likely Human Written
                    </div>
                  )
                ) : (
                  <p className="text-slate-500 italic">Analysis results will appear here</p>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex-1">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Analysis Report
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {streamedText || "Waiting for your code input..."}
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-20 pt-8 border-t border-slate-900 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm">Created by Team Greater Noida @ 2025</span>
          </div>
          <p className="text-xs text-slate-600">
            Powered by Advanced Linguistic AI Models
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
