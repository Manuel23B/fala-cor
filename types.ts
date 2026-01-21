
export enum Emotion {
  Emotional = 'Emotional',
  Motivational = 'Motivational',
  Confident = 'Confident',
  Romantic = 'Romantic',
  Inspirational = 'Inspirational',
  LightCrying = 'Light Crying',
  Joy = 'Joy',
  Sadness = 'Sadness'
}

export enum AccentRegion {
  Geral = 'Geral (Angola)',
  Luanda = 'Luanda (Mais Urbano)',
  Benguela = 'Benguela (Mais Melódico)',
  Huambo = 'Planalto Central (Mais Pausado)',
  Cabinda = 'Norte (Vibração Cabinda)'
}

export enum ContentType {
  Narration = 'Narrações',
  SocialMedia = 'Redes Sociais',
  Marketing = 'Marketing e Vendas',
  Romantic = 'Mensagem Romântica',
  Thanks = 'Mensagem de Agradecimento',
  Courage = 'Mensagem de Courage',
  Apology = 'Pedido de Desculpas',
  Birthday = 'Mensagem de Aniversário',
  Condolences = 'Condolências',
  Professional = 'Aviso Profissional',
  Other = 'Outros'
}

export enum VoiceType {
  Charon = 'charon',
  Fenrir = 'fenrir',
  Orus = 'orus',
  Enceladus = 'enceladus',
  Zephyr = 'zephyr',
  Aoede = 'aoede',
  Leda = 'leda',
  Kore = 'kore',
  Puck = 'puck',
  Cloned = 'cloned'
}

export const VoiceLabels: Record<string, string> = {
  [VoiceType.Charon]: 'Masculina Madura (Charon)',
  [VoiceType.Fenrir]: 'Masculina Profunda (Fenrir)',
  [VoiceType.Enceladus]: 'Masculina Robusta (Enceladus)',
  [VoiceType.Puck]: 'Masculina Juvenil (Puck)',
  [VoiceType.Orus]: 'Masculina Jovem (Orus)',
  [VoiceType.Zephyr]: 'Feminina Suave (Zephyr)',
  [VoiceType.Aoede]: 'Feminina Expressiva (Aoede)',
  [VoiceType.Leda]: 'Feminina Clara (Leda)',
  [VoiceType.Kore]: 'Feminina Elegante (Kore)',
  [VoiceType.Cloned]: 'Voz Personalizada',
};

export enum Duration {
  Short = 'Curta',
  Medium = 'Média',
  Long = 'Longa'
}

export enum GenerationMode {
  AI = 'AI',
  Manual = 'Manual'
}

export interface GenerationRequest {
  mode: GenerationMode;
  manualText?: string;
  contentType: ContentType;
  emotion: Emotion;
  voice: VoiceType;
  accent: AccentRegion;
  theme: string;
  targetAudience: string;
  duration: Duration;
  voiceSampleBase64?: string;
  voiceSampleMimeType?: string;
}

export interface GenerationResponse {
  text: string;
  audioUrl?: string;
  audioBlob?: Blob;
  voiceLabel: string;
  styleLabel: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  voice: VoiceType;
  emotion: Emotion;
  contentType: ContentType;
}
