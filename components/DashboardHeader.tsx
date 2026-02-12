
import React from 'react';

interface DashboardHeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  streak: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentDate, onDateChange }) => {
  const formattedDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('pt-br', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col border-b border-white/5 pb-12">
      <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-4">Data de Registro</h2>
      <h1 className="text-6xl font-black text-white leading-none tracking-tighter capitalize drop-shadow-2xl">
        {formattedDate}
      </h1>
    </div>
  );
};
