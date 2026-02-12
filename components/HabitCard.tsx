
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
    const historyCount = logs.filter(log => log.date !== currentDate && log.habits[key]).length;
    return historyCount + (completedHabits[key] ? 1 : 0);
  };

  return (
    <div className="bg-[#121212] rounded-[2rem] p-6 border border-[#262626] h-full shadow-2xl">
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
