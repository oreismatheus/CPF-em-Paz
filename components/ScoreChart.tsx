
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
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ logs, currentScore }) => {
  const data = logs.slice(-21).map(log => ({
    date: log.date.split('-').slice(2).join('/'),
    score: log.score
  }));

  return (
    <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-[#1c1c1c] w-full shadow-2xl">
      <div className="flex flex-col items-start mb-6">
        <h3 className="text-[10px] font-black text-slate-500 uppercase mb-1">Status de Vida</h3>
        <p className="text-4xl font-black text-white">Minha Performance <span className="text-[#ff3d00]">{currentScore.toFixed(1)}</span></p>
      </div>
      
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff3d00" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#ff3d00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#1a1a1a" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#444', fontSize: 10, fontWeight: 900}}
              dy={10}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip 
              contentStyle={{backgroundColor: '#000', border: '1px solid #1c1c1c', borderRadius: '16px', color: '#fff', fontSize: '11px', fontWeight: 'bold'}}
              itemStyle={{color: '#ff3d00'}}
              cursor={{stroke: '#ff3d00', strokeWidth: 1}}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#ff3d00" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
