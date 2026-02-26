
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationRequest, VoiceType, ContentType, AccentRegion, Emotion, ToneIntensity } from "../types.ts";

const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const analyzeVoiceSample = async (base64: string, mimeType: string): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64,
            mimeType: mimeType
          }
        },
        {
          text: "Analise a essência fonética desta voz angolana. Foque na curvatura das vogais e na dentalidade das consoantes. Descreva como esta pessoa específica pronuncia o português angolano para que possamos replicar sem cair em sotaques de Portugal ou Brasil. Identifique se há influência regional específica."
        }
      ]
    }
  });
  return response.text || "voz angolana autêntica";
};

export const generateText = async (params: GenerationRequest): Promise<string> => {
  const ai = getGeminiClient();
  
  const promptParts: any[] = [];
  if (params.voiceSampleBase64) {
    promptParts.push({
      inlineData: {
        data: params.voiceSampleBase64,
        mimeType: params.voiceSampleMimeType || "audio/mpeg"
      }
    });
  }

  const getEmotionInstructions = (emotion: Emotion) => {
    switch (emotion) {
      case Emotion.LoveDeclaration:
        return "O tom é de uma declaração de amor profunda. Escreva como alguém que está a falar baixinho ao ouvido, com frases curtas, pausas emocionais (use ...) e termos afetuosos como 'meu mambo', 'minha vida', 'estou a sentir'. O ritmo deve ser melódico.";
      case Emotion.Joy:
        return "O tom é de pura alegria e entusiasmo. Use frases exclamativas, ritmo rápido e palavras vibrantes. A energia deve ser contagiante.";
      case Emotion.Sadness:
        return "O tom é melancólico e pesado. Use frases mais longas e lentas, com pausas de suspiro. A voz deve soar carregada de emoção contida.";
      case Emotion.LightCrying:
        return "O tom é de choro leve, voz embargada. Use interrupções no meio das palavras, respirações ofegantes e frases que parecem falhar.";
      case Emotion.Confident:
        return "O tom é firme, seguro e autoritário. Use frases diretas, sem hesitação, com ênfase clara nas palavras-chave.";
      case Emotion.Motivational:
        return "O tom é inspirador e crescente. Comece calmo e vá aumentando a intensidade e a paixão ao longo do texto.";
      default:
        return `O tom deve ser ${emotion}. Ajuste o vocabulário e o ritmo para refletir este estado emocional de forma natural.`;
    }
  };

  const emotionInstructions = getEmotionInstructions(params.emotion);

  promptParts.push({ text: `
      Escreve um roteiro de fala ORGÂNICA em Português de Angola. 
      NÃO escreva como um livro. Escreva como um angolano FALANDO em voz alta.
      
      REGRAS DE NATURALIDADE:
      1. Use repetições leves ou interjeições naturais (ex: 'olha só', 'então', 'sabes?', 'pá', 'mambo').
      2. Estruture as frases para que a voz suba e desça de tom naturalmente (entonação angolana).
      3. Use pontuação (vírgulas, reticências, pontos de exclamação) para forçar pausas de pensamento e variações de tom.
      
      Sotaque: ${params.accent}
      Emoção: ${params.emotion}
      Contexto: ${params.theme}
      
      ${emotionInstructions}

      Gere apenas o texto da fala, sem instruções entre parênteses ou metadados.
    `});

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: promptParts },
    config: {
      temperature: 0.9,
    },
  });

  return response.text || "";
};

export const generateSpeech = async (
  text: string, 
  voiceType: VoiceType, 
  emotion: string, 
  accent: AccentRegion,
  toneIntensity: ToneIntensity = ToneIntensity.Normal,
  contentType?: ContentType,
  voiceSampleBase64?: string,
  voiceSampleMimeType?: string
): Promise<Blob> => {
  const ai = getGeminiClient();
  
  let voiceProfile = "";
  if (voiceSampleBase64) {
    try {
      voiceProfile = await analyzeVoiceSample(voiceSampleBase64, voiceSampleMimeType || "audio/mpeg");
    } catch (e) {
      console.warn("Análise de voz falhou, procedendo com voz padrão.");
    }
  }
  
  // Mapeamento rigoroso para vozes suportadas: Charon, Puck, Kore, Fenrir, Zephyr
  let effectiveVoice = 'Charon';
  let vocalPersona = "Locutor Angolano";

  switch(voiceType) {
    case VoiceType.Kizua:
    case VoiceType.Mauro:
    case VoiceType.Helder:
    case VoiceType.Puck:
      effectiveVoice = 'Puck';
      vocalPersona = "Jovem, tom urbano e vibrante.";
      break;
    case VoiceType.Beto:
    case VoiceType.Edmilson:
    case VoiceType.Orus:
    case VoiceType.Charon:
    case VoiceType.Cloned:
      effectiveVoice = 'Charon';
      vocalPersona = "Homem maduro, voz equilibrada e natural.";
      break;
    case VoiceType.Ndalu:
    case VoiceType.Enceladus:
    case VoiceType.Fenrir:
      effectiveVoice = 'Fenrir';
      vocalPersona = "Voz profunda, grave e autoritária.";
      break;
    case VoiceType.Nayma:
    case VoiceType.Lussaty:
    case VoiceType.Zephyr:
      effectiveVoice = 'Zephyr';
      vocalPersona = "Feminina, tom doce, jovem e suave.";
      break;
    case VoiceType.Kianda:
    case VoiceType.Aoede:
    case VoiceType.Kore:
      effectiveVoice = 'Kore';
      vocalPersona = "Feminina, elegante, expressiva e profunda.";
      break;
    case VoiceType.Yola:
    case VoiceType.Leda:
    case VoiceType.Katia:
    case VoiceType.Edivania:
      effectiveVoice = 'Kore'; // Fallback para vozes femininas enérgicas
      vocalPersona = "Feminina, confiante e clara.";
      break;
    default:
      effectiveVoice = 'Charon';
  }

  const speechPrompt = `
    DIRETRIZ DE PERFORMANCE HUMANA ANGOLANA (ALTA FIDELIDADE):
    1. PROSÓDIA E TOM: Evite a monotonia. Varie o tom (pitch) e a velocidade de forma dinâmica conforme a emoção (${emotion}). 
    2. INTENSIDADE VOCAL: O tom deve ser ${toneIntensity}. Ajuste a pressão subglótica e a ressonância para este estilo.
    3. ENTONAÇÃO: Use uma curvatura melódica natural de Angola. Acentue as sílabas tônicas com variações sutis de frequência.
    4. RESPIRAÇÃO E PAUSAS: Inclua micro-pausas e respirações orgânicas entre as frases para realismo máximo.
    5. SOTAQUE ${accent.toUpperCase()}: Aplique a fonética regional específica, focando na abertura das vogais e na cadência rítmica.
    6. IDENTIDADE VOCAL: ${vocalPersona}
    ${voiceProfile ? `REFERÊNCIA DE DNA VOCAL: ${voiceProfile}` : ''}
    
    TEXTO PARA NARRAÇÃO: "${text}"
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: speechPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: effectiveVoice as any },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("A API não retornou dados de áudio.");

  return createWavBlob(decodeBase64(base64Audio), 24000);
};

function createWavBlob(pcmData: Uint8Array, sampleRate: number): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  view.setUint32(0, 0x52494646, false); // RIFF
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false); // WAVE
  view.setUint32(12, 0x666d7420, false); // fmt 
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false); // data
  view.setUint32(40, pcmData.length, true);
  return new Blob([header, pcmData], { type: 'audio/wav' });
}
