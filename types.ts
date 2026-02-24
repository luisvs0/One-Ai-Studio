export enum Tone {
  PROFESSIONAL = 'Profissional',
  FUN = 'Divertido',
  MINIMALIST = 'Minimalista',
  INSPIRATIONAL = 'Inspiracional',
  WITTY = 'Engraçado/Irônico',
  URGENT = 'Urgente/Escasso',
  EDUCATIONAL = 'Educativo'
}

export enum PostGoal {
  ENGAGEMENT = 'Engajamento',
  SALES = 'Vendas/Conversão',
  AWARENESS = 'Reconhecimento de Marca',
  EDUCATION = 'Educação/Valor'
}

export enum VisualStyle {
  PHOTOGRAPHY = 'Fotografia Realista',
  DIGITAL_ART = 'Arte Digital/3D',
  MINIMALIST = 'Minimalista Clean',
  VINTAGE = 'Vintage/Retro',
  CYBERPUNK = 'Futurista/Cyberpunk',
  MAGAZINE = 'Editorial de Revista'
}

export enum CaptionLength {
  SHORT = 'Curta (Direta)',
  MEDIUM = 'Média (Equilibrada)',
  LONG = 'Longa (Storytelling)'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4', // Using 3:4 as proxy for 4:5 as 4:5 isn't natively supported by all models, mapping to nearest valid
  STORY = '9:16',
  LANDSCAPE = '16:9'
}

export enum MediaType {
  IMAGE = 'Imagem',
  VIDEO = 'Vídeo'
}

export interface PostConfig {
  topic: string;
  audience: string;
  tone: Tone;
  goal: PostGoal;
  visualStyle: VisualStyle;
  captionLength: CaptionLength;
  aspectRatio: AspectRatio;
  mediaType: MediaType;
  referenceImages: string[];
}

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
  imageUrl: string | null;
  videoUrl: string | null;
}

export interface GenerationStatus {
  isGeneratingText: boolean;
  isGeneratingMedia: boolean;
  error: string | null;
}