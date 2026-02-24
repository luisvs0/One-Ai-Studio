import { Tone, AspectRatio, PostGoal, VisualStyle, CaptionLength } from './types';

export const TONE_OPTIONS = [
  { value: Tone.PROFESSIONAL, label: '👔 Profissional' },
  { value: Tone.FUN, label: '🎉 Divertido' },
  { value: Tone.MINIMALIST, label: '✨ Minimalista' },
  { value: Tone.INSPIRATIONAL, label: '💡 Inspiracional' },
  { value: Tone.WITTY, label: '😜 Engraçado' },
  { value: Tone.URGENT, label: '🚨 Urgente' },
  { value: Tone.EDUCATIONAL, label: '📚 Educativo' },
];

export const GOAL_OPTIONS = [
  { value: PostGoal.ENGAGEMENT, label: '💬 Engajamento' },
  { value: PostGoal.SALES, label: '💰 Vendas' },
  { value: PostGoal.AWARENESS, label: '🚀 Branding' },
  { value: PostGoal.EDUCATION, label: '📖 Educação' },
];

export const VISUAL_STYLE_OPTIONS = [
  { value: VisualStyle.PHOTOGRAPHY, label: '📸 Fotografia' },
  { value: VisualStyle.DIGITAL_ART, label: '🎨 Arte Digital' },
  { value: VisualStyle.MINIMALIST, label: '⚪ Minimalista' },
  { value: VisualStyle.VINTAGE, label: '🎞️ Vintage' },
  { value: VisualStyle.CYBERPUNK, label: '🤖 Cyberpunk' },
  { value: VisualStyle.MAGAZINE, label: '📖 Editorial' },
];

export const CAPTION_LENGTH_OPTIONS = [
  { value: CaptionLength.SHORT, label: '⚡ Curta' },
  { value: CaptionLength.MEDIUM, label: '⚖️ Média' },
  { value: CaptionLength.LONG, label: '📖 Longa' },
];

export const ASPECT_RATIO_OPTIONS = [
  { value: AspectRatio.SQUARE, label: 'Quadrado (Feed - 1:1)' },
  { value: AspectRatio.PORTRAIT, label: 'Retrato (Feed - 3:4)' },
  { value: AspectRatio.STORY, label: 'Story/Reels (9:16)' },
  { value: AspectRatio.LANDSCAPE, label: 'Paisagem (16:9)' },
];

export const PLACEHOLDER_IMAGE = "https://picsum.photos/600/600";

export const SUGGESTED_TOPICS = [
  "Dicas de produtividade para trabalhar em casa",
  "A importância do minimalismo no design digital",
  "Receita rápida de café da manhã saudável",
  "Tendências de moda sustentável para 2025",
  "Como a inteligência artificial está mudando o marketing",
  "5 livros que mudaram minha mentalidade de negócios",
  "Guia de viagem para um fim de semana na serra",
  "Exercícios de mindfulness para reduzir a ansiedade",
  "Bastidores do lançamento do meu novo produto",
  "Por que a consistência vence a intensidade nos estudos"
];