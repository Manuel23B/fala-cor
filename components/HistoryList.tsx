
import React, { useState, useMemo } from 'react';
import { HistoryItem, VoiceType, VoiceLabels, Emotion, AccentRegion, ToneIntensity } from '../types';
import { generateSpeech } from '../services/geminiService';

interface HistoryListProps {
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onLoad: (item: HistoryItem) => void;
  onBatchDownload: (items: HistoryItem[]) => void;
  isBatchProcessing: boolean;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onDelete, onLoad, onBatchDownload, isBatchProcessing }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [viewingTextId, setViewingTextId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmotion, setFilterEmotion] = useState<string>('all');

  // Lógica de Filtro e Pesquisa
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmotion = filterEmotion === 'all' || item.emotion === filterEmotion;
      return matchesSearch && matchesEmotion;
    });
  }, [items, searchTerm, filterEmotion]);

  if (items.length === 0) return null;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  const handleQuickPlay = async (item: HistoryItem) => {
    if (playingId) return;
    setPlayingId(item.id);
    try {
      const blob = await generateSpeech(
        item.text,
        item.voice,
        item.emotion,
        item.accent,
        item.toneIntensity || ToneIntensity.Normal,
        item.contentType
      );
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => {
        setPlayingId(null);
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Erro na reprodução rápida:", error);
      setPlayingId(null);
    }
  };

  const handleBatchDownload = () => {
    const selectedItems = items.filter(i => selectedIds.has(i.id));
    onBatchDownload(selectedItems);
  };

  return (
    <div className="mt-24 space-y-10 animate-in fade-in duration-1000 pb-20">
      {/* Cabeçalho do Arquivo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-rose-100 pb-8 gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Arquivo de Voz</h2>
              <p className="text-sm text-slate-500 font-medium">{items.length} produções guardadas</p>
            </div>
          </div>
          
          {/* Barra de Pesquisa e Filtros */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="relative flex-grow max-w-md">
              <input 
                type="text" 
                placeholder="Pesquisar no roteiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-rose-300 transition-all shadow-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select 
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer"
            >
              <option value="all">Todas as Emoções</option>
              {Object.values(Emotion).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button 
              onClick={handleBatchDownload}
              disabled={isBatchProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isBatchProcessing ? 'bg-slate-100 text-slate-400' : 'bg-rose-600 text-white shadow-xl shadow-rose-600/20 hover:scale-105'}`}
            >
              {isBatchProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              GUARDAR {selectedIds.size}
            </button>
          )}
          
          <button 
            onClick={toggleSelectAll}
            className="text-xs font-black text-slate-600 bg-white border border-slate-200 hover:border-rose-300 px-5 py-3 rounded-2xl uppercase tracking-widest transition-all shadow-sm"
          >
            {selectedIds.size === filteredItems.length && filteredItems.length > 0 ? 'Deselecionar' : 'Selecionar'}
          </button>
        </div>
      </div>

      {/* Grid de Itens */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`group bg-white rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col ${selectedIds.has(item.id) ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 hover:border-rose-200 shadow-sm hover:shadow-xl hover:shadow-rose-600/5'}`}
            >
              {/* Checkbox e Tags */}
              <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex gap-4">
                  <button 
                    onClick={() => toggleSelect(item.id)}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${selectedIds.has(item.id) ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/30' : 'border-slate-200 bg-slate-50 text-transparent'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 01.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[9px] font-black text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{item.contentType}</span>
                      <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{item.emotion}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Intl.DateTimeFormat('pt-AO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(item.timestamp)}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-slate-200 hover:text-red-500 p-2 rounded-xl transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="px-6 flex-grow">
                <p className={`text-slate-700 text-sm font-medium leading-relaxed italic ${viewingTextId === item.id ? '' : 'line-clamp-2'}`}>
                  "{item.text}"
                </p>
                {item.text.length > 80 && (
                  <button onClick={() => setViewingTextId(viewingTextId === item.id ? null : item.id)} className="text-[10px] font-black text-rose-600 uppercase mt-2 hover:underline">
                    {viewingTextId === item.id ? 'Fechar' : 'Ver Tudo'}
                  </button>
                )}
              </div>

              <div className="p-6 pt-6 flex items-center justify-between bg-slate-50/30 mt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleQuickPlay(item)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${playingId === item.id ? 'bg-slate-900 text-white animate-pulse' : 'bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                  >
                    {playingId === item.id ? (
                      <div className="flex gap-0.5"><div className="w-1 h-3 bg-white rounded-full animate-bounce"></div><div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                  <div className="hidden sm:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Voz</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">{VoiceLabels[item.voice]?.split('(')[0]}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const text = encodeURIComponent(`Olha esta narração que fiz no Fala Coração:\n\n"${item.text}"`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                    title="Partilhar no WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.988 0 1.757.455 3.409 1.25 4.847l-1.327 4.842 4.957-1.301c1.408.769 3.013 1.201 4.718 1.201 5.508 0 9.987-4.479 9.987-9.988 0-5.508-4.479-9.989-9.998-9.989zm5.221 14.122c-.225.63-.747 1.151-1.378 1.378-1.026.368-2.148.169-3.149-.247-.69-.286-1.334-.678-1.928-1.127-.59-.449-1.127-.962-1.597-1.536-.47-.574-.847-1.192-1.128-1.847-.281-.655-.45-1.336-.505-2.028-.06-.759.13-1.52.544-2.162.225-.349.544-.638.92-.816.141-.067.291-.101.442-.101.101 0 .202.016.299.049.204.069.379.208.494.389.243.38.487.759.731 1.139.115.18.174.39.169.601-.005.211-.074.414-.199.585l-.396.539c-.115.156-.145.358-.08.541.065.183.208.326.388.384.349.112.709.192 1.077.24.368.048.74.066 1.112.054.195-.006.377-.099.501-.256.09-.115.18-.231.27-.346.155-.198.397-.306.65-.291.139.008.275.048.396.117.487.279.974.558 1.461.838.258.148.423.411.44.708.016.297-.118.578-.351.761z"/></svg>
                  </button>
                  <button 
                    onClick={() => onLoad(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-rose-400 hover:text-rose-600 transition-all shadow-sm active:scale-95"
                  >
                    REMIXAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum resultado encontrado para os teus filtros.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
