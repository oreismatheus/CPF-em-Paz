
import React from 'react';

interface DashboardHeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  streak: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentDate }) => {
  const dateObj = new Date(currentDate + 'T12:00:00');
  
  const monthName = dateObj.toLocaleDateString('pt-br', { month: 'long' });
  const year = dateObj.getFullYear();
  const daysInMonth = new Date(year, dateObj.getMonth() + 1, 0).getDate();

  const formattedFullDate = dateObj.toLocaleDateString('pt-br', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
      <div className="flex flex-col">
        <h2 className="text-[10px] font-black text-[#ff3d00] uppercase tracking-[0.4em] mb-2">Registro Diário</h2>
        <h1 className="text-5xl font-black text-white leading-none tracking-tighter capitalize">
          {formattedFullDate}
        </h1>
      </div>
      
      <div className="mt-6 md:mt-0 text-right">
        <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Ciclo Mensal</div>
        <div className="text-2xl font-black text-white uppercase italic">
          {monthName} <span className="text-[#ff3d00]">— {daysInMonth} dias</span>
        </div>
      </div>
    </div>
  );
};
