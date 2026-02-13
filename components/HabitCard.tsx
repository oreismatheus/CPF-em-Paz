
import React from 'react';
import { HABITS } from '../constants';
import { HabitKey, DailyLog } from '../types';

interface HabitCardProps {
  completedHabits: Record<HabitKey, boolean>;
  onToggle: (key: HabitKey) => void;
  logs: DailyLog[];
  currentDate: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ completedHabits, onToggle, logs, currentDate }) => {
  const getStreak = (key: HabitKey) => {
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    
    // Data atual
    const todayDone = completedHabits[key];
    
    // Verifica a partir de ontem
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const findLog = (dateStr: string) => logs.find(l => l.date === dateStr);
    
    if (todayDone) {
      streak = 1;
      let checkDate = new Date(currentDate);
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const dStr = checkDate.toISOString().split('T')[0];
        const log = findLog(dStr);
        if (log && log.habits[key]) {
          streak++;
        } else {
          break;
        }
      }
    } else {
      // Se não fez hoje, verifica se fez ontem para manter a "frequência ativa" visual
      // Mas o usuário pediu: "Se eu falhar um dia, esse contador volta para zero"
      // Então se hoje (currentDate) não está marcado, o streak de hoje é 0.
      streak = 0;
    }
    
    return streak;
  };

  return (
    <div className="bg-[#121212] rounded-[2rem] p-6 border border-[#262626] h-full shadow-2xl">
      <h3 className="text-sm font-black text-[#ff3d00] uppercase mb-6 flex items-center px-2">
        Hábitos Diários
      </h3>
      <div className="space-y-4">
        {HABITS.map((habit) => {
          const streak = getStreak(habit.id);
          const isDoneToday = completedHabits[habit.id];

          return (
            <div key={habit.id} className="space-y-2">
              <label className={`flex items-center p-4 rounded-3xl border transition-all cursor-pointer ${
                isDoneToday 
                ? 'bg-[#ff3d00]/10 border-[#ff3d00]/40 text-[#ff3d00]' 
                : 'bg-[#1a1a1a] border-[#262626] text-slate-300 hover:border-[#ff3d00]/40'
              }`}>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-full border-white/20 text-[#ff3d00] focus:ring-0 focus:ring-offset-0 mr-4 bg-transparent cursor-pointer"
                  checked={!!isDoneToday}
                  onChange={() => onToggle(habit.id)}
                />
                <div className="flex-grow">
                  <div className="flex items-center text-sm font-bold">
                    <span className="mr-3 opacity-90">{habit.icon}</span>
                    {habit.label}
                  </div>
                  <div className={`text-[10px] uppercase mt-1 font-black ${isDoneToday ? 'text-[#ff3d00]/80' : 'text-slate-500'}`}>
                    Frequência Consecutiva: {streak} {streak === 1 ? 'dia' : 'dias'}
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
