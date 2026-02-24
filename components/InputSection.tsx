import React, { useRef, useState } from 'react';
import { PostConfig, Tone, AspectRatio, MediaType, PostGoal, VisualStyle, CaptionLength } from '../types';
import { TONE_OPTIONS, ASPECT_RATIO_OPTIONS, SUGGESTED_TOPICS, GOAL_OPTIONS, VISUAL_STYLE_OPTIONS, CAPTION_LENGTH_OPTIONS } from '../constants';
import { X, Plus, Wand2, Sparkles, Type, Layout, Image as ImageIcon, Dice5, Trash2, Video, Camera, Users, Target, Palette, AlignLeft } from 'lucide-react';
import { enhanceUserPrompt } from '../services/geminiService';

interface InputSectionProps {
  config: PostConfig;
  setConfig: React.Dispatch<React.SetStateAction<PostConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleChange = (field: keyof PostConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const readPromises = fileList.map(file => 
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file as Blob);
        })
      );

      Promise.all(readPromises).then(results => {
        setConfig(prev => ({
          ...prev,
          referenceImages: [...prev.referenceImages, ...results]
        }));
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeReferenceImage = (index: number) => {
    setConfig(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index)
    }));
  };

  const handleSurpriseMe = () => {
    const randomTopic = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
    handleChange('topic', randomTopic);
  };

  const handleClear = () => {
    setConfig(prev => ({
      ...prev,
      topic: '',
      referenceImages: []
    }));
  };

  const handleEnhancePrompt = async () => {
    if (!config.topic.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceUserPrompt(config.topic);
      handleChange('topic', enhanced);
    } catch (error) {
      console.error("Error enhancing prompt", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (!isGenerating && config.topic.trim()) {
        onGenerate();
      }
    }
  };

  const renderRatioIcon = (ratio: string) => {
    switch (ratio) {
      case AspectRatio.SQUARE: return <div className="w-5 h-5 border-[2px] border-current rounded-sm bg-current/10" />;
      case AspectRatio.PORTRAIT: return <div className="w-4 h-6 border-[2px] border-current rounded-sm bg-current/10" />;
      case AspectRatio.STORY: return <div className="w-3 h-6 border-[2px] border-current rounded-sm bg-current/10" />;
      case AspectRatio.LANDSCAPE: return <div className="w-6 h-3 border-[2px] border-current rounded-sm bg-current/10" />;
      default: return <div className="w-5 h-5 border-[2px] border-current rounded-sm" />;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Media Type Toggle */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex relative">
        <button
          onClick={() => handleChange('mediaType', MediaType.IMAGE)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            config.mediaType === MediaType.IMAGE
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Camera className="w-4 h-4" /> Foto
        </button>
        <button
          onClick={() => handleChange('mediaType', MediaType.VIDEO)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            config.mediaType === MediaType.VIDEO
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Video className="w-4 h-4" /> Vídeo (Veo)
        </button>
      </div>

      {/* Topic Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Wand2 className="w-4 h-4" />
            </div>
            <label className="font-bold text-lg">Sobre o que vamos postar?</label>
          </div>
          <div className="flex gap-2 flex-wrap">
             {config.topic && (
                <button 
                  onClick={handleClear}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  title="Limpar formulário"
                >
                  <Trash2 className="w-3 h-3" /> Limpar
                </button>
             )}
             <button 
              onClick={handleSurpriseMe}
              className="text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              title="Gerar ideia aleatória"
            >
              <Dice5 className="w-3 h-3" /> Inspire-me
            </button>
            <button 
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || !config.topic.trim()}
              className={`text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm ${(!config.topic.trim() || isEnhancing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Transformar em um prompt detalhado"
            >
              {isEnhancing ? (
                <Sparkles className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              {isEnhancing ? "Melhorando..." : "Mágica"}
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            value={config.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.mediaType === MediaType.VIDEO ? "Descreva o vídeo que você quer criar..." : "Descreva sua ideia ou clique em 'Inspire-me'..."}
            className="w-full bg-white border-2 border-slate-100 p-6 rounded-3xl text-slate-700 placeholder-slate-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/5 transition-all resize-none h-32 text-lg shadow-sm group-hover:border-purple-200 outline-none leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
             <div className="text-xs font-medium text-slate-300 bg-white px-2 py-1 rounded-md">
              {config.topic.length} chars
            </div>
          </div>
        </div>
      </div>

      {/* Audience Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Users className="w-4 h-4" />
          </div>
          <label className="font-bold text-lg">Público-alvo</label>
        </div>
        <input
          type="text"
          value={config.audience}
          onChange={(e) => handleChange('audience', e.target.value)}
          placeholder="Ex: Jovens empreendedores, Pais de pet..."
          className="w-full bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl text-slate-700 placeholder-slate-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none shadow-sm"
        />
      </div>

      {/* Goal Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Target className="w-4 h-4" />
          </div>
          <label className="font-bold text-lg">Objetivo do Post</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('goal', option.value)}
              className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all border ${
                config.goal === option.value
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Style Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Palette className="w-4 h-4" />
          </div>
          <label className="font-bold text-lg">Estilo Visual</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_STYLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('visualStyle', option.value)}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border text-left flex items-center gap-2 ${
                config.visualStyle === option.value
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Caption Length Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <AlignLeft className="w-4 h-4" />
          </div>
          <label className="font-bold text-lg">Tamanho da Legenda</label>
        </div>
        <div className="flex gap-2">
          {CAPTION_LENGTH_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('captionLength', option.value)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                config.captionLength === option.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Tone Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
            <Type className="w-4 h-4" />
          </div>
          <label className="font-bold text-lg">Vibe & Tom</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange('tone', option.value)}
              className={`py-2.5 px-5 rounded-xl text-sm font-semibold transition-all transform active:scale-95 border ${
                config.tone === option.value
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Layout className="w-4 h-4" />
          </div>
          <label className="font-bold text-lg">Formato</label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ASPECT_RATIO_OPTIONS.map(opt => (
              <button 
                key={opt.value}
                onClick={() => handleChange('aspectRatio', opt.value as AspectRatio)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  config.aspectRatio === opt.value
                    ? 'border-purple-500 bg-purple-50/50 text-purple-700 shadow-sm'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-purple-200 hover:text-purple-500'
                }`}
              >
                {renderRatioIcon(opt.value)}
                <span className="text-xs font-medium">{opt.label.split(' ')[0]}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Reference Images */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <ImageIcon className="w-4 h-4" />
              </div>
              <label className="font-bold text-lg">
                {config.mediaType === MediaType.VIDEO ? "Imagem Inicial (Opcional)" : "Referências"}
              </label>
            </div>
            {config.referenceImages.length > 0 && (
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                {config.referenceImages.length} imgs
              </span>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            multiple={config.mediaType === MediaType.IMAGE} // Single image for video start frame usually preferred for simplicity, but multi supported in backend logic
            onChange={handleImageUpload}
          />

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {config.referenceImages.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100 ring-2 ring-transparent hover:ring-purple-200 transition-all">
                <img 
                  src={img} 
                  alt={`Ref ${idx}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => removeReferenceImage(idx)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover imagem"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50 flex flex-col items-center justify-center gap-1 transition-all text-slate-400 hover:text-purple-500"
              title={config.mediaType === MediaType.VIDEO ? "Definir frame inicial" : "Adicionar imagem"}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !config.topic.trim()}
          className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden group ${
            isGenerating || !config.topic.trim()
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
              : 'bg-slate-900 text-white shadow-purple-900/20 hover:shadow-purple-900/40'
          }`}
        >
          {/* Animated gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isGenerating ? 'opacity-100 animate-pulse' : ''}`} />
          
          <span className="relative flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" /> {config.mediaType === MediaType.VIDEO ? "Gerando Vídeo..." : "Criando..."}
              </>
            ) : (
              <>
                {config.mediaType === MediaType.VIDEO ? <Video className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                {config.mediaType === MediaType.VIDEO ? "Gerar Vídeo" : "Gerar Conteúdo"}
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default InputSection;