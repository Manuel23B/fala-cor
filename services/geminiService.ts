
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationRequest, VoiceType, ContentType, AccentRegion } from "../types";

const API_KEY = process.env.API_KEY || "";

const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
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

  promptParts.push({ text: `
      Escreve um roteiro de fala natural e fluente em Português de Angola. 
      REGRA CRÍTICA: O texto deve ser escrito para facilitar a pronúncia angolana. 
      Evite construções gramaticais típicas de Portugal (ex: uso excessivo de 'estou a fazer' se o contexto pedir algo mais direto ou local). 
      Não use gírias brasileiras.
      
      Sotaque Alvo: ${params.accent}
      Emoção: ${params.emotion}
      Assunto: ${params.theme}
      Público: ${params.targetAudience}

      Crie frases que fluam organicamente, com pausas indicadas por vírgulas e reticências onde um angolano naturalmente respiraria ou enfatizaria o 'mambo'.
    `});

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: promptParts },
    config: {
      temperature: 0.85,
    },
  });

  return response.text || "";
};

export const generateSpeech = async (
  text: string, 
  voiceType: VoiceType, 
  emotion: string, 
  accent: AccentRegion,
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
      console.warn("Análise falhou.");
    }
  }
  
  let effectiveVoice = voiceType === VoiceType.Cloned ? VoiceType.Charon : voiceType;
  
  // Categorização de tom para o prompt
  const isYouthfulMale = voiceType === VoiceType.Puck || voiceType === VoiceType.Orus;
  const isDeepMale = voiceType === VoiceType.Charon || voiceType === VoiceType.Fenrir || voiceType === VoiceType.Enceladus;

  let vocalCharacter = "Locutor Angolano";
  if (isYouthfulMale) {
    vocalCharacter = "Homem Angolano Jovem, com voz leve, ágil e sem gravidade excessiva. O tom deve ser vibrante e juvenil.";
  } else if (isDeepMale) {
    vocalCharacter = "Homem Angolano com voz madura, profunda e ressonante.";
  } else if (voiceType === VoiceType.Zephyr || voiceType === VoiceType.Aoede || voiceType === VoiceType.Leda || voiceType === VoiceType.Kore) {
    vocalCharacter = "Mulher Angolana com voz clara e expressiva.";
  }

  const foneticaAngolana = `
    DIRETRIZES FONÉTICAS OBRIGATÓRIAS (ELIMINAÇÃO DE ERROS):
    1. NÃO use o sotaque de Portugal: Não feche as vogais excessivamente. O 'e' e o 'o' devem ter o brilho angolano.
    2. NÃO use o sotaque do Brasil: O 'L' no final das palavras deve ser DENTAL (L real), nunca vocalizado como 'U'.
    3. CADÊNCIA: Use o ritmo cadenciado de ${accent}. A fala deve ser melódica, mas firme.
    4. IDENTIDADE: A voz deve ser ${vocalCharacter}. Se for jovem, mantenha o tom leve e a energia de um rapaz da banda.
    5. NATURALIDADE: Introduza as pausas de respiração típicas de quem está a conversar, não de quem está a ler.
  `;

  const cloningInstruction = voiceType === VoiceType.Cloned && voiceProfile 
    ? `MODO CLONE REAL: Use esta identidade vocal: ${voiceProfile}. Replique a alma angolana do locutor original.`
    : `REFERÊNCIA DE VOZ: Use uma tonalidade angolana rica e expressiva.`;

  const speechPrompt = `
    ${foneticaAngolana}
    
    PERFORMANCE:
    - Emoção: ${emotion}
    - Estilo: ${contentType}
    - ${cloningInstruction}
    
    A tua missão é dar vida ao texto como se fosses um angolano nativo a falar com o coração. Sem vestígios artificiais.
    
    TEXTO: "${text}"
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: speechPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: effectiveVoice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Erro na síntese.");

  return createWavBlob(decodeBase64(base64Audio), 24000);
};

function createWavBlob(pcmData: Uint8Array, sampleRate: number): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, pcmData.length, true);
  return new Blob([header, pcmData], { type: 'audio/wav' });
}
