
import React from 'react';
import { GenerationResponse } from '../types';

interface ResultDisplayProps {
  result: GenerationResponse;
  onRegenerate: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onRegenerate }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result.audioUrl) return;
    const link = document.createElement('a');
    link.href = result.audioUrl;
    link.download = `fala-coracao-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 shadow-xl shadow-rose-600/5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-900">Narração Pronta</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
            title="Copiar texto"
          >
            {copied ? (
               <span className="text-green-600 text-sm font-bold">Copiado!</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 002-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 002-2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
        <p className="text-slate-800 leading-relaxed text-xl italic font-medium whitespace-pre-wrap">
          "{result.text}"
        </p>
      </div>

      {result.audioUrl && (
        <div className="space-y-6">
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 audio-glow">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-rose-600/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 block">Ouvir Narração</span>
                <span className="text-sm text-rose-600 font-bold uppercase tracking-wider">Pura Alma Angolana</span>
              </div>
            </div>
            <audio controls className="w-full md:w-auto h-12 accent-rose-600">
              <source src={result.audioUrl} type="audio/wav" />
              O seu navegador não suporta este áudio.
            </audio>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={handleDownload}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Baixar Áudio
            </button>
            <button 
              onClick={onRegenerate}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-rose-600/30 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.586l4.414-4.414a1 1 0 01.293-.707V15a2 2 0 002-2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Recriar Voz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
