import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import InfoCards from './components/InfoCards';
import HistorySidebar from './components/HistorySidebar';
import CodeEditor from './components/CodeEditor';
import ScoreDisplay from './components/ScoreDisplay';
import AnalysisReport from './components/AnalysisReport';
import { calculateComplexity, streamText } from './utils/analysis';
import { downloadPDFReport } from './utils/pdfGenerator';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [streamedText, setStreamedText] = useState('');
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
  }, [history]);

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

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
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
      
    

      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        score: percent,
        snippet: code.trim().substring(0, 60) + (code.trim().length > 60 ? '...' : '')
      };
      
      setHistory(prev => [newEntry, ...prev].slice(0, 10));

      await streamText(explanation, setStreamedText, 10);
    } catch (e) {
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
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CodeEditor 
              code={code} setCode={setCode} handlePaste={handlePaste} 
              copyToClipboard={copyToClipboard} copied={copied} 
              themeColors={themeColors} theme={theme} 
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
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Analyze Code
                </>
              )}
            </button>

            <InfoCards />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <ScoreDisplay result={result} complexity={complexity} />
            <AnalysisReport 
              result={result} streamedText={streamedText} 
              downloadPDFReport={() => downloadPDFReport(result, streamedText, complexity, code)} 
            />
            <HistorySidebar history={history} clearHistory={clearHistory} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
