
import React, { useMemo, useState } from 'react';
import { SCRIPTURES, DAILY_CHALLENGES, LDS_QUOTES, FATHER_COUNSELS, DAILY_MOTIVATIONS } from '../constants';

export const ExternalPanel: React.FC = () => {
  const [challengeStatus, setChallengeStatus] = useState<'none' | 'success' | 'fail'>('none');

  const dailyIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  const quote = LDS_QUOTES[dailyIndex % LDS_QUOTES.length];
  const scripture = SCRIPTURES[dailyIndex % SCRIPTURES.length];
  const fatherCounsel = FATHER_COUNSELS[dailyIndex % FATHER_COUNSELS.length];
  const motivation = DAILY_MOTIVATIONS[dailyIndex % DAILY_MOTIVATIONS.length];
  const challenge = DAILY_CHALLENGES[dailyIndex % DAILY_CHALLENGES.length];

  const Card = ({ title, content, subContent, source, children }: { title: string, content: string, subContent?: string, source?: string, children?: React.ReactNode }) => (
    <div className="rounded-[1.5rem] p-6 border border-[#262626] bg-[#121212] transition-all shadow-xl">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-[#ff3d00] text-black">
          {title}
        </span>
      </div>
      <p className="text-base leading-relaxed font-bold text-slate-200">
        "{content}"
      </p>
      {subContent && (
        <div className="mt-3 text-[10px] font-black text-[#ff3d00] uppercase tracking-widest">
          {subContent}
        </div>
      )}
      {source && (
        <div className="mt-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">
          {source}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card 
        title="Citação Profética" 
        content={quote.text}
        subContent={quote.author}
        source={quote.source}
      />
      
      <Card 
        title="Escritura Sagrada" 
        content={scripture.text}
        subContent={scripture.ref}
        source={scripture.source}
      />

      <Card 
        title="Conselho do meu pai" 
        content={fatherCounsel}
        subContent="Seu pai, Ari"
      />

      <Card 
        title="Frase do dia" 
        content={motivation}
        subContent="Foco & Fé"
      />
      
      <Card 
        title="Desafio 24 horas" 
        content={challenge}
      >
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setChallengeStatus('success')}
            className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${
              challengeStatus === 'success' 
              ? 'bg-emerald-500 border-emerald-500 text-black' 
              : 'border-[#262626] text-slate-500 hover:border-emerald-500/50'
            }`}
          >
            Consegui concluir
          </button>
          <button 
            onClick={() => setChallengeStatus('fail')}
            className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${
              challengeStatus === 'fail' 
              ? 'bg-rose-500 border-rose-500 text-black' 
              : 'border-[#262626] text-slate-500 hover:border-rose-500/50'
            }`}
          >
            Não consegui
          </button>
        </div>
      </Card>
    </div>
  );
};
