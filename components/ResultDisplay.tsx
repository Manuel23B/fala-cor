
import React, { useState, useRef, useEffect } from 'react';
import { GenerationResponse } from '../types';

interface ResultDisplayProps {
  result: GenerationResponse;
  onRegenerate: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!result.audioUrl) return;
    
    // Normalizar strings para evitar caracteres inválidos em nomes de arquivos
    const cleanVoice = result.voiceLabel.replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
    const cleanStyle = result.styleLabel.replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    const filename = `${cleanVoice}-${cleanStyle}-${timestamp}.wav`;
    
    const link = document.createElement('a');
    link.href = result.audioUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white border border-rose-100 rounded-[3rem] p-8 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 shadow-2xl shadow-rose-600/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-none">Narração Pronta</h3>
            <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">Alma e Sotaque Sintonizados</p>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
        >
          {copied ? <span className="text-green-600 text-xs font-bold uppercase">Copiado</span> : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 002-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 002-2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          )}
        </button>
      </div>

      {/* Estúdio de Audição */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/5 to-orange-600/5 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
        <div className="relative bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 overflow-hidden">
          
          {/* Visualizador de Ondas Simulado */}
          <div className="flex items-end justify-center gap-1 h-20 mb-8">
            {[...Array(24)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 bg-rose-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-2 opacity-30'}`}
                style={{ 
                  height: isPlaying ? `${Math.random() * 100}%` : '8px',
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${0.5 + Math.random()}s`
                }}
              ></div>
            ))}
          </div>

          <div className="flex flex-col items-center text-center space-y-6">
            <audio 
              ref={audioRef}
              src={result.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />
            
            <button 
              onClick={togglePlay}
              className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            <div className="w-full max-w-md space-y-2">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-600 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest">{result.voiceLabel}</span>
                <span className="text-slate-300 text-xs">•</span>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{result.styleLabel}</span>
              </div>
              <p className="text-slate-800 text-lg font-medium leading-relaxed italic max-w-lg mx-auto">
                "{result.text.length > 150 ? result.text.substring(0, 150) + '...' : result.text}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Pós-Audição */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={togglePlay}
          className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] font-black transition-all shadow-sm active:scale-95 ${isPlaying ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-100'}`}
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              PAUSAR
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              OUVIR
            </>
          )}
        </button>

        <button 
          onClick={handleDownload}
          className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-[1.5rem] font-black transition-all shadow-sm hover:border-rose-200 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          GUARDAR ÁUDIO
        </button>

        <button 
          onClick={onRegenerate}
          className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-rose-600/30 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.586l4.414-4.414a1 1 0 01.293-.707V15a2 2 0 002-2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          RECRIAR VOZ
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
