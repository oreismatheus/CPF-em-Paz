
import React, { useState, useEffect, useMemo } from 'react';
import { HabitKey, DailyLog, AIAnalysisReport, AnalysisPeriod } from './types';
import { HabitCard } from './components/HabitCard';
import { JournalEditor } from './components/JournalEditor';
import { DashboardHeader } from './components/DashboardHeader';
import { ScoreChart } from './components/ScoreChart';
import { ExternalPanel } from './components/ExternalPanel';
import { analyzeHabitsAndJournal } from './services/geminiService';
import { HABITS } from './constants';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('cpf_logs');
    return saved ? JSON.parse(saved) : [];
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

  const liveLogs = useMemo(() => {
    const others = logs.filter(l => l.date !== currentDate);
    return [...others, activeLog].sort((a, b) => a.date.localeCompare(b.date));
  }, [logs, activeLog, currentDate]);

  const handleToggleHabit = (key: HabitKey) => {
    const newHabits = { ...activeLog.habits, [key]: !activeLog.habits[key] };
    const completedCount = Object.values(newHabits).filter(Boolean).length;
    const newScore = Math.round((completedCount / HABITS.length) * 10);
    setActiveLog(prev => ({ ...prev, habits: newHabits, score: newScore }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedLogs = logs.filter(l => l.date !== currentDate);
      updatedLogs.push(activeLog);
      setLogs(updatedLogs);
      localStorage.setItem('cpf_logs', JSON.stringify(updatedLogs));
      setIsSaving(false);
    }, 600);
  };

  const handleGenerateReport = async (period: AnalysisPeriod) => {
    setIsAnalyzing(true);
    setShowAnalysisOptions(false);
    const result = await analyzeHabitsAndJournal(logs, period);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const periods: AnalysisPeriod[] = ['Semanal', 'Quinzenal', 'Mensal', 'Trimestral', 'Semestral', 'Anual'];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#ff3d00] selection:text-black pb-20">
      <nav className="bg-[#000000]/95 backdrop-blur-xl border-b border-[#1c1c1c] py-5 px-10 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center group cursor-pointer">
            {/* Espaço para logo/foto do usuário */}
            <div className="w-10 h-10 bg-[#ff3d00] rounded-2xl flex items-center justify-center text-black text-xl font-black shadow-2xl shadow-[#ff3d00]/30 group-hover:scale-105 transition-transform overflow-hidden">
              <span className="group-hover:hidden">C</span>
              <span className="hidden group-hover:block text-[8px] leading-tight">LOGO</span>
            </div>
            <span className="ml-4 text-xl font-black uppercase italic text-white group-hover:text-[#ff3d00] transition-colors">CPF em Paz</span>
          </div>
          <div className="hidden md:flex gap-6 text-[11px] font-black uppercase text-slate-500">
            <button className="hover:text-[#ff3d00] transition-colors">Dashboard</button>
            <button className="hover:text-[#ff3d00] transition-colors">Configurações</button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-10">
        <div className="w-full">
          <ScoreChart logs={liveLogs} currentScore={activeLog.score} />
        </div>

        <DashboardHeader 
          currentDate={currentDate} 
          onDateChange={setCurrentDate} 
          streak={0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coluna 1: Citação, Escritura, Motivação, Desafio (Esquerda) */}
          <div className="lg:col-span-3 space-y-8">
            <ExternalPanel />
          </div>

          {/* Coluna 2: Diário e Relatório (Meio) */}
          <div className="lg:col-span-6 space-y-8">
            <JournalEditor 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              notes={activeLog.notes}
              setNotes={(v) => setActiveLog(p => ({ ...p, notes: v }))}
              mood={activeLog.mood}
              setMood={(v) => setActiveLog(p => ({ ...p, mood: v }))}
              weather={activeLog.weather}
              setWeather={(v) => setActiveLog(p => ({ ...p, weather: v }))}
              onSave={handleSave}
              isSaving={isSaving}
            />

            {/* Gerador de Relatório de Evolução */}
            <div className="bg-[#0a0a0a] rounded-[2.5rem] p-10 border border-[#1c1c1c] shadow-2xl">
              <div className="max-w-xl">
                <h3 className="text-3xl font-black mb-3 text-[#ff3d00] tracking-tighter">Relatório de Evolução</h3>
                <p className="text-slate-500 text-base mb-8 font-medium">Análise avançada da sua performance espiritual e diária.</p>
                
                {!analysis && !isAnalyzing && !showAnalysisOptions && (
                  <button 
                    onClick={() => setShowAnalysisOptions(true)}
                    className="bg-[#ff3d00] text-black px-10 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-[#ff3d00]/20 active:scale-95"
                  >
                    Gerar Relatório
                  </button>
                )}

                {showAnalysisOptions && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {periods.map(p => (
                      <button 
                        key={p}
                        onClick={() => handleGenerateReport(p)}
                        className="bg-[#000000] border border-[#1c1c1c] hover:border-[#ff3d00]/50 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-[#ff3d00] transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex items-center space-x-5 text-[#ff3d00] font-black text-xs">
                    <div className="w-6 h-6 border-3 border-[#ff3d00] border-t-transparent rounded-full animate-spin"></div>
                    <span>ANALISANDO DADOS...</span>
                  </div>
                )}

                {analysis && !isAnalyzing && (
                  <div className="mt-10 space-y-8 animate-in fade-in duration-700">
                    <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-6">
                      <div>
                        <div className="text-[10px] font-black text-slate-600 uppercase mb-1">Status Final</div>
                        <div className="text-7xl font-black text-[#ff3d00] leading-none">{analysis.score}</div>
                      </div>
                      <button onClick={() => setAnalysis(null)} className="text-slate-600 hover:text-white transition-colors text-xs font-bold uppercase">Fechar</button>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-black text-[#ff3d00] uppercase mb-3">Minha Performance</div>
                      <p className="text-xl font-bold leading-snug text-slate-200">{analysis.performance}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#000000] p-6 rounded-[1.5rem] border border-[#1c1c1c]">
                        <div className="text-[10px] font-black text-emerald-500 uppercase mb-3">Fortalezas</div>
                        <ul className="space-y-2">
                          {analysis.positives.map((s, i) => <li key={i} className="flex items-start text-xs font-bold text-slate-400">
                            <span className="text-emerald-500 mr-2 mt-0.5">✓</span> {s}
                          </li>)}
                        </ul>
                      </div>
                      <div className="bg-[#000000] p-6 rounded-[1.5rem] border border-[#1c1c1c]">
                        <div className="text-[10px] font-black text-amber-500 uppercase mb-3">Ajustes</div>
                        <ul className="space-y-2">
                          {analysis.toImprove.map((s, i) => <li key={i} className="flex items-start text-xs font-bold text-slate-400">
                            <span className="text-amber-500 mr-2 mt-0.5">→</span> {s}
                          </li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#ff3d00] p-8 rounded-[2rem] text-black shadow-lg shadow-[#ff3d00]/10">
                      <div className="text-[10px] font-black uppercase mb-3 opacity-60">Estratégia Recomendada</div>
                      <p className="text-2xl font-black leading-tight tracking-tighter">"{analysis.alternatives}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna 3: Hábitos (Direita) */}
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

      <footer className="py-20 text-center text-slate-900 text-[10px] font-black uppercase tracking-[0.5em]">
        CPF em Paz • 2024 • Desenvolvido para Performance
      </footer>
    </div>
  );
};

export default App;
