
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DailyLog } from '../types';

interface ScoreChartProps {
  logs: DailyLog[];
  currentScore: number;
  currentDate: string;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ logs, currentScore, currentDate }) => {
  const dateObj = new Date(currentDate + 'T12:00:00');
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = dateObj.toLocaleDateString('pt-br', { month: 'long' });

  // Gera dados para todos os dias do mês atual
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const log = logs.find(l => l.date === dateStr);
    return {
      day: day,
      score: log ? log.score : 0,
      fullDate: dateStr
    };
  });

  return (
    <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-[#262626] w-full shadow-2xl relative">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-[10px] font-black text-[#ff3d00] uppercase mb-1">Status Diário</h3>
          <p className="text-4xl font-black text-white">Minha Performance <span className="text-[#ff3d00]">{currentScore.toFixed(1)}</span></p>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Ciclo Mensal</div>
          <div className="text-2xl font-black text-white uppercase italic">
            {monthName} <span className="text-[#ff3d00]">— {daysInMonth} dias</span>
          </div>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff3d00" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ff3d00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#222" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#555', fontSize: 10, fontWeight: 900}}
              interval={0}
              dy={15}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip 
              contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold'}}
              itemStyle={{color: '#ff3d00'}}
              cursor={{stroke: '#ff3d00', strokeWidth: 1}}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#ff3d00" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
              connectNulls={true} 
              dot={{ r: 3, fill: '#ff3d00', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
