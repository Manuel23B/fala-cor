
import React, { useEffect, useState } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import GeneratorForm from './components/GeneratorForm.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import HistoryList from './components/HistoryList.tsx';
import { GenerationRequest, GenerationResponse, GenerationMode, HistoryItem, VoiceLabels, AccentRegion, Duration, ToneIntensity } from './types.ts';
import { generateText, generateSpeech } from './services/geminiService.ts';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [initialFormData, setInitialFormData] = useState<Partial<GenerationRequest> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('falacoracao_v3');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('falacoracao_v3', JSON.stringify(history));
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
        params.toneIntensity,
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
        styleLabel,
        toneLabel: params.toneIntensity
      });

      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        text: textToSpeak,
        voice: params.voice,
        emotion: params.emotion,
        contentType: params.contentType,
        accent: params.accent,
        toneIntensity: params.toneIntensity
      };
      setHistory(prev => [newItem, ...prev].slice(0, 20));
      
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      setError(err.message || "Erro ao calibrar sotaque. Tenta novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDownload = async (items: HistoryItem[]) => {
    if (isBatchProcessing) return;
    setIsBatchProcessing(true);
    
    try {
      for (const item of items) {
        const blob = await generateSpeech(
          item.text,
          item.voice,
          item.emotion,
          item.accent || AccentRegion.Geral,
          item.toneIntensity || ToneIntensity.Normal,
          item.contentType
        );
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `FalaCoracao_${item.voice}_${Date.now()}.wav`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        await new Promise(r => setTimeout(r, 800));
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Erro no download em lote:", err);
      alert("Erro ao processar o download em lote.");
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setInitialFormData({
      mode: GenerationMode.Manual,
      manualText: item.text,
      contentType: item.contentType,
      emotion: item.emotion,
      voice: item.voice,
      accent: item.accent,
      toneIntensity: item.toneIntensity,
      duration: Duration.Medium
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4 text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest mb-6">Estúdio de Narração Profissional</div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">A Tua Voz, <br /><span className="gradient-text">O Teu Sotaque.</span></h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">Narração angolana autêntica com calibração fonética avançada.</p>
        </section>

        <section id="generator" className="max-w-4xl mx-auto px-4 relative z-10">
          <GeneratorForm 
            onSubmit={handleGenerate} 
            isLoading={isLoading} 
            initialData={initialFormData} 
          />
          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold border border-red-100">{error}</div>}
          {result && <div id="results-section" className="mt-12"><ResultDisplay result={result} onRegenerate={() => setResult(null)} /></div>}
          <HistoryList 
            items={history} 
            onDelete={id => setHistory(h => h.filter(i => i.id !== id))} 
            onLoad={handleLoadFromHistory} 
            onBatchDownload={handleBatchDownload}
            isBatchProcessing={isBatchProcessing}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
