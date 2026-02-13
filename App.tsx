
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
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const periods: AnalysisPeriod[] = ['Semanal', 'Quinzenal', 'Mensal', 'Trimestral', 'Semestral', 'Anual'];

  return (
    <div className="min-h-screen text-white selection:bg-[#ff3d00] selection:text-black pb-10">
      <nav className="border-b border-white/5 py-6 px-10 sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex-1">
            <span className="text-2xl font-black uppercase italic text-white hover:text-[#ff3d00] transition-colors cursor-default">
              CPF em Paz
            </span>
          </div>
          <div className="flex-1 flex justify-center items-center gap-4">
             <span className="text-[10px] font-black text-[#ff3d00] uppercase tracking-widest hidden sm:block">Foco & Fé</span>
             <input 
              type="date" 
              value={currentDate} 
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-[#121212] border border-[#ff3d00]/30 rounded-xl px-5 py-2 text-sm font-black text-[#ff3d00] outline-none hover:border-[#ff3d00] transition-all"
            />
          </div>
          <div className="flex-1 text-right">
            <a 
              href="https://instagram.com/oreismatheus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-black text-slate-500 hover:text-[#ff3d00] transition-colors uppercase"
            >
              @oreismatheus
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-12">
        <div className="w-full flex justify-center">
          <div className="w-full">
            <ScoreChart logs={logs} currentScore={activeLog.score} currentDate={currentDate} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 space-y-8">
            <ExternalPanel />
          </div>

          <div className="lg:col-span-6 space-y-8">
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

            {/* Container do Relatório com correção de bug de tamanho e persona de Pai Sábio */}
            <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-[#262626] shadow-2xl relative overflow-hidden min-h-[200px]">
              <div className="max-w-full text-left">
                <h3 className="text-3xl font-black mb-1 text-[#ff3d00]">Relatório de Evolução</h3>
                <p className="text-slate-500 text-xs mb-6">Uma análise sábia dos seus dias com o conselho do seu pai.</p>
                
                {!analysis && !isAnalyzing && !showAnalysisOptions && (
                  <button 
                    onClick={() => setShowAnalysisOptions(true)}
                    className="bg-[#ff3d00] text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-[#ff3d00]/20"
                  >
                    Ouvir Sabedoria
                  </button>
                )}

                {showAnalysisOptions && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {periods.map(p => (
                      <button 
                        key={p}
                        onClick={() => handleGenerateReport(p)}
                        className="bg-[#1a1a1a] border border-[#262626] hover:border-[#ff3d00] py-3 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex items-center space-x-4 text-[#ff3d00] font-black text-[10px]">
                    <div className="w-4 h-4 border-2 border-[#ff3d00] border-t-transparent rounded-full animate-spin"></div>
                    <span>SEU PAI ESTÁ OBSERVANDO SEUS PASSOS COM SABEDORIA...</span>
                  </div>
                )}

                {analysis && !isAnalyzing && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-end justify-between border-b border-[#262626] pb-4">
                      <div>
                        <div className="text-[9px] font-black text-[#ff3d00] uppercase mb-1">Nota de Performance</div>
                        <div className="text-6xl font-black text-white leading-none">{analysis.score}</div>
                      </div>
                      <button onClick={() => setAnalysis(null)} className="text-slate-600 hover:text-white transition-colors text-[9px] font-black uppercase">Nova Consulta</button>
                    </div>
                    
                    <div>
                      <h4 className="text-[9px] font-black text-[#ff3d00] uppercase mb-2">Análise Sábia</h4>
                      <p className="text-lg font-bold leading-tight text-slate-100 italic">"{analysis.performance}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#1a1a1a] p-5 rounded-[1.2rem] border border-[#262626]">
                        <div className="text-[9px] font-black text-emerald-500 uppercase mb-2">Pontos Positivos</div>
                        <ul className="space-y-1">
                          {analysis.positives.map((s, i) => <li key={i} className="flex items-start text-[11px] font-bold text-slate-400">
                            <span className="text-emerald-500 mr-2">✓</span> {s}
                          </li>)}
                        </ul>
                      </div>
                      <div className="bg-[#1a1a1a] p-5 rounded-[1.2rem] border border-[#262626]">
                        <div className="text-[9px] font-black text-amber-500 uppercase mb-2">Pontos Negativos</div>
                        <ul className="space-y-1">
                          {analysis.toImprove.map((s, i) => <li key={i} className="flex items-start text-[11px] font-bold text-slate-400">
                            <span className="text-amber-500 mr-2">→</span> {s}
                          </li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#ff3d00] p-6 rounded-[1.8rem] text-black shadow-lg">
                      <div className="text-[9px] font-black uppercase mb-2 opacity-70">Conselho do seu Pai</div>
                      <p className="text-xl font-black leading-tight">{analysis.alternatives}</p>
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

      {/* Rodapé invisível / Mesma cor do fundo conforme pedido */}
      <footer className="py-10 text-center select-none opacity-0">
        <span className="text-[#0d0d0d] text-[10px] font-black uppercase tracking-[0.5em]">
          My CPF in Peace • 2025
        </span>
      </footer>
    </div>
  );
};

export default App;
