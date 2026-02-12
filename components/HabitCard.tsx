
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
  const getFrequency = (key: HabitKey) => {
    // Conta logs passados (excluindo o dia atual para não duplicar se já estiver no estado activeLog)
    const pastCount = logs.filter(log => log.date !== currentDate && log.habits[key]).length;
    // Soma o estado atual (vibrante/instantâneo)
    const currentStatus = completedHabits[key] ? 1 : 0;
    return pastCount + currentStatus;
  };

  return (
    <div className="bg-[#0a0a0a] rounded-[2rem] p-6 border border-[#1c1c1c] h-full shadow-2xl">
      <h3 className="text-sm font-black text-[#ff3d00] uppercase mb-6 flex items-center px-2">
        Hábitos Diários
      </h3>
      <div className="space-y-4">
        {HABITS.map((habit) => {
          const freq = getFrequency(habit.id);
          const isDoneToday = completedHabits[habit.id];

          return (
            <div key={habit.id} className="space-y-2">
              <label className={`flex items-center p-4 rounded-3xl border transition-all cursor-pointer ${
                isDoneToday 
                ? 'bg-[#ff3d00]/10 border-[#ff3d00]/30 text-[#ff3d00]' 
                : 'bg-[#000000] border-[#1c1c1c] text-slate-500 hover:border-[#ff3d00]/20'
              }`}>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-full border-white/10 text-[#ff3d00] focus:ring-offset-0 focus:ring-[#ff3d00] mr-4 bg-transparent"
                  checked={!!isDoneToday}
                  onChange={() => onToggle(habit.id)}
                />
                <div className="flex-grow">
                  <div className="flex items-center text-sm font-bold">
                    <span className="mr-3">{habit.icon}</span>
                    {habit.label}
                  </div>
                  <div className={`text-[10px] uppercase mt-1 font-black ${isDoneToday ? 'text-[#ff3d00]/80' : 'text-slate-600'}`}>
                    Frequência Total: {freq} {freq === 1 ? 'dia' : 'dias'}
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
