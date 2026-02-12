
import React, { useMemo } from 'react';
import { SCRIPTURES, DAILY_CHALLENGES } from '../constants';

export const ExternalPanel: React.FC = () => {
  const scripture = useMemo(() => SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)], []);
  const challenge = useMemo(() => DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)], []);

  return (
    <div className="space-y-6">
      {/* 1. Citação do Dia */}
      <div className="bg-[#050505] rounded-[2rem] p-6 border border-[#111]">
        <h4 className="text-[10px] font-black uppercase mb-3 text-[#ff3d00]">Citação do Dia</h4>
        <p className="text-base font-bold text-slate-200 leading-snug">
          "O futuro é tão brilhante quanto a sua fé."
        </p>
        <p className="text-[10px] mt-2 font-black text-slate-500 uppercase">Thomas S. Monson</p>
      </div>

      {/* 2. Escritura do Dia */}
      <div className="bg-[#050505] rounded-[2rem] p-6 border border-[#111]">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-[#ff3d00]/10 text-[#ff3d00] rounded-full text-[10px] font-black uppercase">Escritura</span>
        </div>
        <p className="text-slate-200 text-lg leading-relaxed mb-4 font-bold">
          "{scripture.text}"
        </p>
        <div className="text-[10px] font-black text-slate-500 uppercase">{scripture.ref}</div>
      </div>

      {/* 3. Motivação do Dia */}
      <div className="bg-[#050505] rounded-[2rem] p-6 border border-[#111]">
        <h4 className="text-[10px] font-black uppercase mb-3 text-[#ff3d00]">Motivação</h4>
        <p className="text-base font-black text-slate-100 leading-tight">"A consistência é a única ponte entre o seu eu atual e o seu eu ideal."</p>
      </div>
      
      {/* 4. Desafio do Dia */}
      <div className="bg-[#ff3d00] rounded-[2rem] p-6 text-black shadow-2xl shadow-[#ff3d00]/20">
        <h4 className="text-[10px] font-black uppercase mb-3 opacity-70">Desafio do Dia</h4>
        <p className="text-xl font-black leading-tight">"{challenge}"</p>
        <div className="mt-4 w-10 h-0.5 bg-black/20 rounded-full"></div>
      </div>
    </div>
  );
};
