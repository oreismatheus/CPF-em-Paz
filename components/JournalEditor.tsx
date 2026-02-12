
import React from 'react';
import { MOOD_LABELS, MOOD_EMOJIS, WEATHER_LABELS, WEATHER_ICONS } from '../constants';
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
  return (
    <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-[#262626] flex flex-col h-full shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 className="text-2xl font-black text-[#ff3d00] flex items-center">
          <span className="mr-3">📔</span> Diário
        </h3>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-[#1a1a1a] border border-[#262626] text-[#ff3d00] rounded-2xl px-4 py-2 text-sm font-black outline-none focus:ring-1 focus:ring-[#ff3d00]/50"
        />
      </div>
      
      <div className="space-y-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] font-black text-[#ff3d00] uppercase mb-3 block">Meu Humor</label>
            <div className="flex justify-between bg-[#1a1a1a] p-2 rounded-[1.5rem] border border-[#262626]">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setMood(lvl as MoodLevel)}
                  className={`flex-1 py-2 text-2xl transition-all rounded-2xl ${
                    mood === lvl ? 'bg-[#ff3d00] shadow-lg shadow-[#ff3d00]/20 scale-105' : 'opacity-30 hover:opacity-100'
                  }`}
                >
                  {MOOD_EMOJIS[lvl-1]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-[#ff3d00] uppercase mb-3 block">Clima</label>
            <div className="flex justify-between bg-[#1a1a1a] p-2 rounded-[1.5rem] border border-[#262626]">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setWeather(lvl as WeatherType)}
                  className={`flex-1 py-2 text-2xl transition-all rounded-2xl ${
                    weather === lvl ? 'bg-[#ff3d00] shadow-lg shadow-[#ff3d00]/20 scale-105' : 'opacity-30 hover:opacity-100'
                  }`}
                >
                  {WEATHER_ICONS[lvl-1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col min-h-[350px]">
          <label className="text-[10px] font-black text-[#ff3d00] uppercase mb-3 block">Reflexões e Planos</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Planos e pensamentos..."
            className="w-full flex-grow p-6 rounded-[2rem] bg-[#1a1a1a] border border-[#262626] focus:border-[#ff3d00]/40 outline-none resize-none text-slate-100 placeholder:text-slate-700 text-lg leading-relaxed font-medium"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="mt-8 w-full py-5 rounded-3xl font-black text-black text-base transition-all active:scale-[0.98] bg-[#ff3d00] hover:bg-[#ff5500] shadow-xl shadow-[#ff3d00]/30"
      >
        {isSaving ? 'SALVANDO...' : 'SALVAR NO DIÁRIO'}
      </button>
    </div>
  );
};
