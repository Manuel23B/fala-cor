
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
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  voice: VoiceType;
  emotion: Emotion;
  contentType: ContentType;
}
