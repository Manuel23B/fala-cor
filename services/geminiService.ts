
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
      Evite construções gramaticais típicas de Portugal. 
      Não use gírias brasileiras.
      
      Sotaque Alvo: ${params.accent}
      Emoção: ${params.emotion}
      Assunto: ${params.theme}
      Público: ${params.targetAudience}

      Crie frases que fluam organicamente, com pausas indicadas por vírgulas e reticências onde um angolano naturalmente respiraria ou enfatizaria o 'mambo'. Use termos como 'banda', 'sentir', 'nosso' de forma natural.
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
  
  // Mapeamento de Personas para Bases Vocais da API
  let effectiveVoice: string = voiceType;
  let vocalPersona = "Locutor Angolano Genérico";

  // Mapeamento Detalhado
  if (voiceType === VoiceType.Cloned) {
    effectiveVoice = 'charon';
  } else if (voiceType === VoiceType.Kizua) {
    effectiveVoice = 'puck';
    vocalPersona = "Homem angolano muito jovem, voz urbana de Luanda, rápida e cheia de 'ginga'.";
  } else if (voiceType === VoiceType.Beto) {
    effectiveVoice = 'orus';
    vocalPersona = "Homem angolano jovem-adulto, voz relaxada, fala como se estivesse a conversar com um amigo na banda.";
  } else if (voiceType === VoiceType.Ndalu) {
    effectiveVoice = 'fenrir';
    vocalPersona = "Homem angolano, voz madura e serena, cadência pausada e profunda.";
  } else if (voiceType === VoiceType.Nayma) {
    effectiveVoice = 'zephyr';
    vocalPersona = "Mulher angolana, voz doce, vogais bem abertas e pronúncia límpida.";
  } else if (voiceType === VoiceType.Kianda) {
    effectiveVoice = 'aoede';
    vocalPersona = "Mulher angolana, voz melódica e expressiva, com cadência que lembra o litoral.";
  } else if (voiceType === VoiceType.Yola) {
    effectiveVoice = 'leda';
    vocalPersona = "Mulher angolana enérgica, voz firme para marketing e motivação, com pausas de impacto.";
  } 
  // Novas personas juvenis
  else if (voiceType === VoiceType.Lussaty) {
    effectiveVoice = 'zephyr';
    vocalPersona = "Mulher angolana de 19 anos, voz muito jovem, fresca e vibrante, estilo digital influencer, fala com entusiasmo.";
  } else if (voiceType === VoiceType.Edivania) {
    effectiveVoice = 'aoede';
    vocalPersona = "Mulher angolana de 22 anos, voz moderna e urbana de Luanda, equilibrada e clara, tom de jovem profissional.";
  } else if (voiceType === VoiceType.Katia) {
    effectiveVoice = 'leda';
    vocalPersona = "Mulher angolana de 25 anos, voz confiante e criativa, tom de voz firme mas ainda assim jovem e cativante.";
  } else if (voiceType === VoiceType.Mauro) {
    effectiveVoice = 'puck';
    vocalPersona = "Homem angolano de 18 anos, voz cheia de energia, fala rápido, estilo urbano e descontraído, muita 'vibe'.";
  } else if (voiceType === VoiceType.Edmilson) {
    effectiveVoice = 'orus';
    vocalPersona = "Homem angolano de 21 anos, voz intelectual e suave, tom de voz calmo e pensativo, textura vocal jovem e limpa.";
  } else if (voiceType === VoiceType.Helder) {
    effectiveVoice = 'puck';
    vocalPersona = "Homem angolano de 24 anos, voz carismática de locutor jovem, tom quente e acolhedor, excelente cadência e pausas naturais.";
  }

  const foneticaAngolana = `
    INSTRUÇÕES FONÉTICAS DE ALTA FIDELIDADE:
    1. RESPIRAÇÃO NATURAL: Insira pausas de respiração audíveis após vírgulas e pontos. A fala não deve ser contínua como um robô.
    2. ELIMINAÇÃO DE PT-PT: Proibido fechar o 'e' e o 'o' como em Lisboa. Use o brilho vocálico de Luanda.
    3. ELIMINAÇÃO DE PT-BR: O 'L' no final de palavras deve ser DENTAL (L real), nunca vocalizado como 'U'.
    4. RITMO: Siga a cadência de ${accent}. Se for Luanda, seja mais ágil. Se for Huambo, seja mais pausado.
    5. PERSONA: Você é ${vocalPersona}. Fale com alma, não apenas leia.
  `;

  const cloningInstruction = voiceType === VoiceType.Cloned && voiceProfile 
    ? `MODO CLONE REAL: Use esta identidade vocal: ${voiceProfile}. Replique a alma angolana do locutor original.`
    : `REFERÊNCIA DE VOZ: Use uma tonalidade angolana rica.`;

  const speechPrompt = `
    ${foneticaAngolana}
    
    PERFORMANCE:
    - Emoção: ${emotion}
    - Estilo: ${contentType}
    - ${cloningInstruction}
    
    TEXTO PARA NARRAR: "${text}"
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
