
import React, { useState } from 'react';
import { MOOD_EMOJIS, WEATHER_ICONS } from '../constants';
import { MoodLevel, WeatherType } from '../types';

interface JournalEditorProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  mood: MoodLevel;
  setMood: (val: MoodLevel) => void;
  weather: WeatherType;
  setWeather: (val: WeatherType) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  currentDate, onDateChange, notes, setNotes, mood, setMood, weather, setWeather, onSave, isSaving
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  const handleLocalSave = () => {
    onSave();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-[#262626] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📔</span>
            <h3 className="text-2xl font-black text-[#ff3d00] uppercase tracking-tighter">Meu Diário</h3>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest -mt-4">
            Relate seus pensamentos, vitórias e o que aprendeu hoje.
          </p>
          <button 
            onClick={handleToggleEdit}
            className="w-full bg-[#ff3d00] hover:bg-[#ff5500] text-black py-4 rounded-2xl font-black uppercase text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-[#ff3d00]/20"
          >
            <span>Relatar o meu dia</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-[#262626] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-[#ff3d00] flex items-center uppercase tracking-tighter">
          <span className="mr-3">📔</span> O Seu Relato
        </h3>
        <button 
          onClick={() => setIsEditing(false)}
          className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest bg-[#1a1a1a] px-4 py-2 rounded-xl border border-[#262626] transition-colors"
        >
          Cancelar
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center bg-[#1a1a1a] p-5 rounded-2xl border border-[#262626]">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data do Registro</label>
           <input
            type="date"
            value={currentDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-[#ff3d00] font-black outline-none cursor-pointer text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#ff3d00] uppercase block ml-2 tracking-widest">Estado de Espírito</label>
            <div className="flex justify-between bg-[#1a1a1a] p-2 rounded-[1.5rem] border border-[#262626]">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setMood(lvl as MoodLevel)}
                  className={`flex-1 py-3 text-2xl transition-all rounded-xl ${
                    mood === lvl ? 'bg-[#ff3d00] shadow-lg shadow-[#ff3d00]/20 scale-105' : 'opacity-20 hover:opacity-100'
                  }`}
                >
                  {MOOD_EMOJIS[lvl-1]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#ff3d00] uppercase block ml-2 tracking-widest">Energia do Ambiente</label>
            <div className="flex justify-between bg-[#1a1a1a] p-2 rounded-[1.5rem] border border-[#262626]">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setWeather(lvl as WeatherType)}
                  className={`flex-1 py-3 text-2xl transition-all rounded-xl ${
                    weather === lvl ? 'bg-[#ff3d00] shadow-lg shadow-[#ff3d00]/20 scale-105' : 'opacity-20 hover:opacity-100'
                  }`}
                >
                  {WEATHER_ICONS[lvl-1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col min-h-[300px]">
          <label className="text-[10px] font-black text-[#ff3d00] uppercase mb-3 block ml-2 tracking-widest">O que você viveu hoje?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Relate com honestidade... o Ari valorizava a verdade acima de tudo."
            className="w-full flex-grow p-6 rounded-[2rem] bg-[#1a1a1a] border border-[#262626] focus:border-[#ff3d00] outline-none resize-none text-slate-100 placeholder:text-slate-700 text-lg leading-relaxed font-medium transition-all"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={handleLocalSave}
            disabled={isSaving}
            className="flex-grow py-5 rounded-2xl font-black text-black text-base transition-all active:scale-[0.98] bg-[#ff3d00] hover:bg-[#ff5500] shadow-xl shadow-[#ff3d00]/30 uppercase tracking-tighter"
          >
            {isSaving ? 'Registrando...' : 'Confirmar Relato'}
          </button>
        </div>
      </div>
    </div>
  );
};
