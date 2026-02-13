
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HabitKey, DailyLog, AIAnalysisReport, AnalysisPeriod } from './types';
import { HabitCard } from './components/HabitCard';
import { JournalEditor } from './components/JournalEditor';
import { ScoreChart } from './components/ScoreChart';
import { ExternalPanel } from './components/ExternalPanel';
import { analyzeHabitsAndJournal } from './services/geminiService';
import { HABITS } from './constants';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    try {
      const saved = localStorage.getItem('cpf_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [activeLog, setActiveLog] = useState<DailyLog>({
    date: currentDate,
    habits: HABITS.reduce((acc, h) => ({ ...acc, [h.id]: false }), {} as Record<HabitKey, boolean>),
    notes: '',
    mood: 3,
    weather: 3,
    score: 0
  });

  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisOptions, setShowAnalysisOptions] = useState(false);

  useEffect(() => {
    const existing = logs.find(l => l.date === currentDate);
    if (existing) {
      setActiveLog(existing);
    } else {
      setActiveLog({
        date: currentDate,
        habits: HABITS.reduce((acc, h) => ({ ...acc, [h.id]: false }), {} as Record<HabitKey, boolean>),
        notes: '',
        mood: 3,
        weather: 5,
        score: 0
      });
    }
  }, [currentDate, logs]);

  const persistLog = useCallback((updatedLog: DailyLog) => {
    setLogs(prev => {
      const filtered = prev.filter(l => l.date !== updatedLog.date);
      const newLogs = [...filtered, updatedLog].sort((a, b) => a.date.localeCompare(b.date));
      localStorage.setItem('cpf_logs', JSON.stringify(newLogs));
      return newLogs;
    });
  }, []);

  const handleToggleHabit = (key: HabitKey) => {
    const newHabits = { ...activeLog.habits, [key]: !activeLog.habits[key] };
    const completedCount = Object.values(newHabits).filter(Boolean).length;
    const newScore = Math.round((completedCount / HABITS.length) * 10);
    const updated = { ...activeLog, habits: newHabits, score: newScore };
    setActiveLog(updated);
    persistLog(updated); 
  };

  const handleManualSave = () => {
    setIsSaving(true);
    persistLog(activeLog);
    setTimeout(() => setIsSaving(false), 600);
  };

  const handleGenerateReport = async (period: AnalysisPeriod) => {
    setIsAnalyzing(true);
    setShowAnalysisOptions(false);
    try {
      const result = await analyzeHabitsAndJournal(logs, period);
      if (result) setAnalysis(result);
    } catch (e) {
      console.error("Erro na análise:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const periods: AnalysisPeriod[] = ['Semanal', 'Quinzenal', 'Mensal', 'Trimestral', 'Semestral', 'Anual'];

  return (
    <div className="min-h-screen text-white selection:bg-[#ff3d00] selection:text-black pb-10">
      <nav className="border-b border-white/5 py-6 px-10 sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex-1">
            <span className="text-2xl font-black uppercase text-[#ff3d00] hover:scale-105 transition-transform cursor-default tracking-tighter">
              CPF em Paz
            </span>
          </div>
          <div className="flex-1 flex justify-center items-center gap-6">
             <input 
              type="date" 
              value={currentDate} 
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-[#121212] border border-[#ff3d00]/30 rounded-xl px-5 py-2 text-sm font-black text-[#ff3d00] outline-none hover:border-[#ff3d00] transition-all focus:ring-2 focus:ring-[#ff3d00]/20"
            />
          </div>
          <div className="flex-1 text-right">
            <a 
              href="https://instagram.com/oreismatheus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-black text-slate-500 hover:text-[#ff3d00] transition-colors uppercase tracking-widest"
            >
              @oreismatheus
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        <div className="w-full flex justify-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-full">
            <ScoreChart logs={logs} currentScore={activeLog.score} currentDate={currentDate} activeLog={activeLog} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-8">
            <ExternalPanel />
          </div>

          <div className="lg:col-span-6 space-y-8 transition-all">
            <JournalEditor 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              notes={activeLog.notes}
              setNotes={(v) => {
                const updated = { ...activeLog, notes: v };
                setActiveLog(updated);
                persistLog(updated);
              }}
              mood={activeLog.mood}
              setMood={(v) => {
                const updated = { ...activeLog, mood: v };
                setActiveLog(updated);
                persistLog(updated);
              }}
              weather={activeLog.weather}
              setWeather={(v) => {
                const updated = { ...activeLog, weather: v };
                setActiveLog(updated);
                persistLog(updated);
              }}
              onSave={handleManualSave}
              isSaving={isSaving}
            />

            <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-[#262626] shadow-2xl relative overflow-hidden flex flex-col transition-all">
              <div className="max-w-full text-left">
                <h3 className="text-3xl font-black mb-1 text-[#ff3d00] uppercase tracking-tighter">Relatório de Evolução</h3>
                <p className="text-slate-500 text-xs mb-6 font-bold uppercase tracking-widest">A visão do seu pai, Ari, sobre seus passos.</p>
                
                {!analysis && !isAnalyzing && !showAnalysisOptions && (
                  <button 
                    onClick={() => setShowAnalysisOptions(true)}
                    className="bg-[#ff3d00] text-black px-12 py-6 rounded-3xl font-black text-base hover:scale-105 transition-all shadow-xl shadow-[#ff3d00]/20 uppercase tracking-tighter active:scale-95"
                  >
                    Ouvir Sabedoria do Ari
                  </button>
                )}

                {showAnalysisOptions && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in zoom-in-95 duration-300">
                    {periods.map(p => (
                      <button 
                        key={p}
                        onClick={() => handleGenerateReport(p)}
                        className="bg-[#1a1a1a] border border-[#262626] hover:border-[#ff3d00] py-5 rounded-2xl text-[11px] font-black uppercase text-slate-500 hover:text-white transition-all shadow-md active:bg-[#ff3d00] active:text-black"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex items-center space-x-6 text-[#ff3d00] font-black text-[13px] py-12 animate-pulse">
                    <div className="w-10 h-10 border-4 border-[#ff3d00] border-t-transparent rounded-full animate-spin"></div>
                    <span className="uppercase tracking-[0.3em] font-black">Ari está contemplando o seu caminho...</span>
                  </div>
                )}

                {analysis && !isAnalyzing && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="flex items-end justify-between border-b border-[#262626] pb-8 sticky top-0 bg-[#121212] z-10 pt-4">
                      <div>
                        <div className="text-[11px] font-black text-[#ff3d00] uppercase mb-2 tracking-[0.2em]">Nota do Ari</div>
                        <div className="text-8xl font-black text-white leading-none tracking-tighter">{analysis.score.toFixed(1)}</div>
                      </div>
                      <button onClick={() => setAnalysis(null)} className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border border-[#262626] px-5 py-3 rounded-2xl hover:bg-white/5">Nova Análise</button>
                    </div>
                    
                    <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border-l-[12px] border-[#ff3d00] shadow-inner">
                      <h4 className="text-[11px] font-black text-[#ff3d00] uppercase mb-5 tracking-[0.3em]">Papo Sincero</h4>
                      <p className="text-2xl font-black leading-[1.2] text-slate-100 uppercase tracking-tight">{analysis.performance}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-[#262626] group hover:border-[#10b981]/30 transition-colors">
                        <div className="text-[11px] font-black text-emerald-500 uppercase mb-5 tracking-[0.2em]">Orgulho do Pai</div>
                        <ul className="space-y-4">
                          {analysis.positives.map((s, i) => <li key={i} className="flex items-start text-sm font-black text-slate-300">
                            <span className="text-emerald-500 mr-4 text-xl leading-none">★</span> {s}
                          </li>)}
                        </ul>
                      </div>
                      <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-[#262626] group hover:border-[#f59e0b]/30 transition-colors">
                        <div className="text-[11px] font-black text-amber-500 uppercase mb-5 tracking-[0.2em]">Ajuste o Rumo</div>
                        <ul className="space-y-4">
                          {analysis.toImprove.map((s, i) => <li key={i} className="flex items-start text-sm font-black text-slate-300">
                            <span className="text-amber-500 mr-4 text-xl leading-none">!</span> {s}
                          </li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#ff3d00] p-12 rounded-[3rem] text-black shadow-2xl mb-8 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:scale-[2] transition-transform duration-1000">
                        <span className="text-9xl">💡</span>
                      </div>
                      <div className="relative z-10">
                        <div className="text-[11px] font-black uppercase mb-4 opacity-80 tracking-[0.3em]">Conselho de Ouro do Ari</div>
                        <p className="text-3xl font-black leading-none tracking-tighter uppercase">{analysis.alternatives}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <HabitCard 
              completedHabits={activeLog.habits} 
              onToggle={handleToggleHabit} 
              logs={logs}
              currentDate={currentDate}
            />
          </div>
        </div>
      </main>

      <footer className="py-20 text-center select-none pointer-events-none opacity-0 h-0 overflow-hidden">
        <span className="text-[#0d0d0d] text-[10px] font-black uppercase tracking-[0.5em]">
          My CPF in Peace • 2025
        </span>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff3d00; }
        * { font-variant-numeric: tabular-nums; }
        body { overflow-y: scroll; }
      `}</style>
    </div>
  );
};

export default App;
