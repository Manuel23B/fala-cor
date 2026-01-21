
import React, { useRef, useState } from 'react';
import { ContentType, Emotion, VoiceType, Duration, GenerationRequest, GenerationMode, AccentRegion, VoiceLabels } from '../types';
import { generateSpeech } from '../services/geminiService';

interface GeneratorFormProps {
  onSubmit: (request: GenerationRequest) => void;
  isLoading: boolean;
}

const maleVoices: Record<string, string> = {
  [VoiceType.Mauro]: 'Mauro (18 anos - High Energy)',
  [VoiceType.Edmilson]: 'Edmilson (21 anos - Intelectual)',
  [VoiceType.Helder]: 'Hélder (24 anos - Locutor Jovem)',
  [VoiceType.Kizua]: 'Kizua (Jovem Urbano)',
  [VoiceType.Beto]: 'Beto (Natural e Relaxado)',
  [VoiceType.Ndalu]: 'Ndalu (Sereno e Pausado)',
  [VoiceType.Puck]: 'Masculina Juvenil (Puck)',
  [VoiceType.Orus]: 'Masculina Jovem (Orus)',
  [VoiceType.Charon]: 'Masculina Madura (Charon)',
};

const femaleVoices: Record<string, string> = {
  [VoiceType.Lussaty]: 'Lussaty (19 anos - Influencer)',
  [VoiceType.Edivania]: 'Edivania (22 anos - Moderna)',
  [VoiceType.Katia]: 'Katia (25 anos - Criativa)',
  [VoiceType.Nayma]: 'Nayma (Doce e Natural)',
  [VoiceType.Yola]: 'Yola (Enérgica e Natural)',
  [VoiceType.Kianda]: 'Kianda (Melódica e Profunda)',
  [VoiceType.Zephyr]: 'Feminina Suave (Zephyr)',
  [VoiceType.Aoede]: 'Feminina Expressiva (Aoede)',
  [VoiceType.Leda]: 'Feminina Clara (Leda)',
};

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sampleName, setSampleName] = React.useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [formData, setFormData] = React.useState<GenerationRequest>({
    mode: GenerationMode.AI,
    manualText: '',
    contentType: ContentType.Narration,
    emotion: Emotion.Emotional,
    voice: VoiceType.Mauro,
    accent: AccentRegion.Geral,
    theme: '',
    targetAudience: 'Amigos, Família ou Clientes',
    duration: Duration.Medium
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ficheiro muito grande.");
        return;
      }
      setSampleName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFormData(prev => ({
          ...prev,
          voiceSampleBase64: base64,
          voiceSampleMimeType: file.type,
          voice: VoiceType.Cloned
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewVoice = async () => {
    if (isPreviewing || formData.voice === VoiceType.Cloned && !formData.voiceSampleBase64) return;
    
    setIsPreviewing(true);
    try {
      const voiceName = VoiceLabels[formData.voice] || "esta voz";
      const previewText = `Olá! Eu sou o ${voiceName.split('(')[0].trim()}. Sou uma voz angolana pronta para a tua narração.`;
      
      const audioBlob = await generateSpeech(
        previewText,
        formData.voice,
        formData.emotion,
        formData.accent,
        formData.contentType,
        formData.voiceSampleBase64,
        formData.voiceSampleMimeType
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setIsPreviewing(false);
    } catch (error) {
      console.error("Erro ao gerar pré-visualização:", error);
      setIsPreviewing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-glass p-8 md:p-10 rounded-[2.5rem] border border-rose-100">
      <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button type="button" onClick={() => setFormData({...formData, mode: GenerationMode.AI})} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.mode === GenerationMode.AI ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Gerar com IA</button>
        <button type="button" onClick={() => setFormData({...formData, mode: GenerationMode.Manual})} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.mode === GenerationMode.Manual ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Texto Próprio</button>
      </div>

      <div className={`p-6 border rounded-3xl transition-all ${formData.voice === VoiceType.Cloned ? 'bg-rose-100/50 border-rose-400' : 'bg-rose-50/50 border-rose-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" /><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 4a2 2 0 100 4 2 2 0 000-4z" /></svg>
             </div>
             <div>
               <h4 className="text-sm font-black text-slate-900">Calibração de Voz</h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sincronia Fonética Personalizada</p>
             </div>
          </div>
          {sampleName && <button type="button" onClick={() => {setSampleName(null); setFormData({...formData, voiceSampleBase64: undefined, voice: VoiceType.Mauro})}} className="text-[10px] font-black text-rose-600">LIMPAR</button>}
        </div>
        {!sampleName ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-rose-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-rose-100/50 transition-all">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
            <p className="text-xs font-bold text-slate-500">Subir áudio para calibrar sotaque</p>
          </div>
        ) : (
          <div className="bg-white border border-rose-200 rounded-2xl p-3 flex items-center gap-3">
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-rose-500 rounded-full animate-pulse"></div>)}
            </div>
            <span className="text-xs font-bold text-slate-700 truncate">{sampleName}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Regionalidade (Sotaque)</label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none"
            value={formData.accent}
            onChange={(e) => setFormData({ ...formData, accent: e.target.value as AccentRegion })}
          >
            {Object.values(AccentRegion).map(region => <option key={region} value={region}>{region}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Objetivo</label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none"
            value={formData.contentType}
            onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
          >
            {Object.values(ContentType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {formData.mode === GenerationMode.AI ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Assunto da Mensagem</label>
            <textarea 
              placeholder="Sobre o que vamos falar hoje?"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 min-h-[100px] outline-none focus:border-rose-300 transition-all"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Teu Texto</label>
          <textarea 
            placeholder="Escreve aqui o roteiro..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 min-h-[180px] outline-none focus:border-rose-300 transition-all"
            value={formData.manualText}
            onChange={(e) => setFormData({ ...formData, manualText: e.target.value })}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Sentimento</label>
          <select className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900" value={formData.emotion} onChange={(e) => setFormData({...formData, emotion: e.target.value as Emotion})}>
            {Object.values(Emotion).map(em => <option key={em} value={em}>{em}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
            <span>Base Vocal</span>
            <button 
              type="button" 
              onClick={handlePreviewVoice}
              disabled={isPreviewing}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${isPreviewing ? 'text-slate-400' : 'text-rose-600 hover:text-rose-700'}`}
            >
              {isPreviewing ? (
                <div className="flex gap-0.5">
                  <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                  Pré-ouvir
                </>
              )}
            </button>
          </label>
          <select className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all" value={formData.voice} onChange={(e) => setFormData({...formData, voice: e.target.value as VoiceType})}>
            <optgroup label="Especial"><option value={VoiceType.Cloned}>✨ Usar Referência Personalizada</option></optgroup>
            <optgroup label="Masculinas Juvenis (18-25 anos)">{Object.entries(maleVoices).filter(([k]) => [VoiceType.Mauro, VoiceType.Edmilson, VoiceType.Helder].includes(k as any)).map(([id, l]) => <option key={id} value={id}>{l}</option>)}</optgroup>
            <optgroup label="Femininas Juvenis (18-25 anos)">{Object.entries(femaleVoices).filter(([k]) => [VoiceType.Lussaty, VoiceType.Edivania, VoiceType.Katia].includes(k as any)).map(([id, l]) => <option key={id} value={id}>{l}</option>)}</optgroup>
            <optgroup label="Outras Masculinas">{Object.entries(maleVoices).filter(([k]) => ![VoiceType.Mauro, VoiceType.Edmilson, VoiceType.Helder].includes(k as any)).map(([id, l]) => <option key={id} value={id}>{l}</option>)}</optgroup>
            <optgroup label="Outras Femininas">{Object.entries(femaleVoices).filter(([k]) => ![VoiceType.Lussaty, VoiceType.Edivania, VoiceType.Katia].includes(k as any)).map(([id, l]) => <option key={id} value={id}>{l}</option>)}</optgroup>
          </select>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className={`w-full py-5 rounded-2xl text-lg font-black text-white transition-all shadow-xl ${isLoading ? 'bg-slate-300' : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:scale-[1.01] active:scale-95 shadow-rose-600/20'}`}>
        {isLoading ? 'Calibrando Sotaque...' : 'Gerar Narração Humana'}
      </button>
    </form>
  );
};

export default GeneratorForm;
