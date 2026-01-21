
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GeneratorForm from './components/GeneratorForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';
import { GenerationRequest, GenerationResponse, GenerationMode, HistoryItem, VoiceLabels } from './types';
import { generateText, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('falacoracao_v2');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('falacoracao_v2', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (params: GenerationRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let textToSpeak = params.mode === GenerationMode.AI ? await generateText(params) : (params.manualText || "");
      if (!textToSpeak.trim()) throw new Error("Texto vazio.");
      
      const audioBlob = await generateSpeech(
        textToSpeak, 
        params.voice, 
        params.emotion, 
        params.accent,
        params.contentType,
        params.voiceSampleBase64,
        params.voiceSampleMimeType
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const voiceLabel = VoiceLabels[params.voice] || params.voice;
      const styleLabel = params.contentType;

      setResult({ 
        text: textToSpeak, 
        audioUrl, 
        audioBlob,
        voiceLabel,
        styleLabel
      });

      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        text: textToSpeak,
        voice: params.voice,
        emotion: params.emotion,
        contentType: params.contentType
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
      
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      setError(err.message || "Erro ao calibrar sotaque.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4 text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest mb-6">Correção de Fonética Ativa</div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">Vozes Angolanas <br /><span className="gradient-text">Sem Erros de Sotaque.</span></h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">Garantimos o 'L' dental, as vogais abertas e a ginga real. Nada de sotaque brasileiro ou português.</p>
        </section>

        <section id="generator" className="max-w-4xl mx-auto px-4 relative z-10">
          <GeneratorForm onSubmit={handleGenerate} isLoading={isLoading} />
          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold border border-red-100">{error}</div>}
          {result && <div id="results-section" className="mt-12"><ResultDisplay result={result} onRegenerate={() => setResult(null)} /></div>}
          <HistoryList items={history} onDelete={id => setHistory(h => h.filter(i => i.id !== id))} onLoad={() => {}} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
