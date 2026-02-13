
import React, { useMemo } from 'react';
import { SCRIPTURES, DAILY_CHALLENGES, LDS_QUOTES } from '../constants';

export const ExternalPanel: React.FC = () => {
  const dailyIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  const quote = LDS_QUOTES[dailyIndex % LDS_QUOTES.length];
  const scripture = SCRIPTURES[dailyIndex % SCRIPTURES.length];
  const challenge = DAILY_CHALLENGES[dailyIndex % DAILY_CHALLENGES.length];

  const Card = ({ title, content, subContent }: { title: string, content: string, subContent?: string }) => (
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
        <div className="mt-3 text-[10px] font-black text-[#ff3d00] uppercase">
          {subContent}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card 
        title="Citação de Líder SUD" 
        content={quote.text}
        subContent={quote.author}
      />
      
      <Card 
        title="Escritura" 
        content={scripture.text}
        subContent={scripture.ref}
      />

      <Card 
        title="Frase do Dia" 
        content="O amanhã será melhor se fizermos o melhor hoje. Siga em frente com fé e propósito."
        subContent="Motivação"
      />
      
      <Card 
        title="Desafio 24h" 
        content={challenge}
      />
    </div>
  );
};
