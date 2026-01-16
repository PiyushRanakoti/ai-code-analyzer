import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Loader2, Users, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';
import HistorySidebar from './components/HistorySidebar';
import CodeEditor from './components/CodeEditor';
import ScoreDisplay from './components/ScoreDisplay';
import AnalysisReport from './components/AnalysisReport';
import { calculateComplexity, streamText } from './utils/analysis';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('analysis_history');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [copied, setCopied] = useState(false);
  const [complexity, setComplexity] = useState(null);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('analysis_stats');
    try {
      return saved ? JSON.parse(saved) : { totalScans: 0, aiDetected: 0 };
    } catch (e) {
      return { totalScans: 0, aiDetected: 0 };
    }
  });

  const themeColors = {
    emerald: { 
      primary: 'bg-emerald-600', 
      hover: 'hover:bg-emerald-500', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/20', 
      glow: 'shadow-emerald-600/40', 
      accent: 'emerald',
      gradient: 'from-emerald-600/20',
      ring: 'text-emerald-500'
    }
  };
  const theme = 'emerald';

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

  const downloadPDFReport = () => {
    if (!result && !streamedText) return;
    
    const doc = new jsPDF();
    const primaryColor = [16, 185, 129]; 

    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('ANALYSIS REPORT', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`PROJECT: AI BASED CODE PLAGIARISM DETECTOR`, 20, 34);
    
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text(`REPORT ID: #${Date.now().toString().slice(-8)}`, 140, 50);
    doc.text(`GENERATED: ${new Date().toLocaleString()}`, 140, 55);
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 65, 170, 45, 3, 3, 'S');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DETECTION SUMMARY', 30, 75);
    
    doc.setFontSize(32);
    doc.setTextColor(result > 50 ? 244 : primaryColor[0], result > 50 ? 63 : primaryColor[1], result > 50 ? 94 : primaryColor[2]);
    doc.text(`${result}%`, 30, 95);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('AI CONFIDENCE SCORE', 65, 95);
    
    doc.setFontSize(10);
    doc.text(`CODE COMPLEXITY: ${complexity || 'N/A'}`, 30, 103);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NEURAL ANALYSIS DETAILS', 20, 125);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(streamedText, 170);
    doc.text(splitText, 20, 135);
    
    const lastY = 135 + (splitText.length * 5);
    if (lastY < 230) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('SOURCE CODE PREVIEW', 20, lastY + 15);
      
      doc.setFillColor(240, 240, 240);
      doc.rect(20, lastY + 20, 170, 60, 'F');
      
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const codeLines = doc.splitTextToSize(code.substring(0, 800), 160);
      doc.text(codeLines, 25, lastY + 30);
    }

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('© 2025 Team Greater Noida | Powered by Advanced Linguistic AI Models', 105, 285, { align: 'center' });

    doc.save(`AI_Code_Analysis_Report.pdf`);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError('');
    const comp = calculateComplexity(code);
    setComplexity(comp);
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
      
      const percent = parseInt(percentLine.replace('%', '').trim()) || 0;
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
        snippet: code.trim().substring(0, 60) + (code.trim().length > 60 ? '...' : '')
      };
      
      setHistory(prev => [newEntry, ...prev].slice(0, 10));

      await streamText(explanation, setStreamedText, 10);
    } catch (e) {
      setError("⚠️ AI analysis is currently unavailable. Please try again later.");
      setResult(0);
      setStreamedText("Analysis failed. The external backend might be down.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 transition-colors duration-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 -left-1/4 w-1/2 h-1/2 opacity-30 blur-[140px] rounded-full transition-all duration-1000 ${themeColors[theme].primary}`} />
        <div className={`absolute bottom-0 -right-1/4 w-1/2 h-1/2 opacity-10 blur-[140px] rounded-full transition-all duration-1000 ${themeColors[theme].primary}`} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
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
            AI based Code Plagiarism detector
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Advanced detection system for identifying AI patterns in source code.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              handlePaste={handlePaste} 
              copyToClipboard={copyToClipboard} 
              copied={copied} 
              themeColors={themeColors} 
              theme={theme} 
            />
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className="group relative flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-emerald-600/40 active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <ScoreDisplay result={result} complexity={complexity} />
            <AnalysisReport result={result} streamedText={streamedText} downloadPDFReport={downloadPDFReport} />
            <HistorySidebar history={history} clearHistory={clearHistory} />
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
