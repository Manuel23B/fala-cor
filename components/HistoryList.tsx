
import React from 'react';
import { HistoryItem, VoiceType } from '../types';

interface HistoryListProps {
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onLoad: (item: HistoryItem) => void;
}

const voiceLabels: Record<string, string> = {
  charon: 'Charon',
  fenrir: 'Fenrir',
  orus: 'Orus',
  enceladus: 'Enceladus',
  zephyr: 'Zephyr',
  aoede: 'Aoede',
  leda: 'Leda',
  kore: 'Kore',
  puck: 'Puck',
  cloned: 'Voz Clonada',
};

const HistoryList: React.FC<HistoryListProps> = ({ items, onDelete, onLoad }) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-24 space-y-10 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between border-b border-rose-100 pb-6">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Narrações Guardadas
        </h2>
        <span className="text-xs font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-100">
          {items.length} registos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-rose-400 transition-all hover:shadow-2xl hover:shadow-rose-600/5 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                  {item.contentType}
                </span>
                <p className="text-[11px] text-slate-400 mt-2 font-semibold">
                  {new Date(item.timestamp).toLocaleString('pt-AO')}
                </p>
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <p className="text-slate-600 text-sm italic line-clamp-2 mb-6 font-medium leading-relaxed">
              "{item.text}"
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.voice === VoiceType.Cloned ? 'bg-green-500 animate-pulse' : 'bg-rose-600'}`}></div>
                  <span className={`text-[11px] font-bold ${item.voice === VoiceType.Cloned ? 'text-green-600' : 'text-slate-500'}`}>
                    {voiceLabels[item.voice] || item.voice}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span className="text-[11px] text-slate-500 font-bold">{item.emotion}</span>
                </div>
              </div>
              
              <button 
                onClick={() => onLoad(item)}
                className="flex items-center gap-1.5 text-xs font-black text-rose-600 hover:text-rose-700 transition-colors group-hover:translate-x-1"
              >
                CARREGAR
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
