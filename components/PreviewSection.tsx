import React from 'react';
import { GeneratedContent, GenerationStatus, AspectRatio } from '../types';
import { Copy, Check, Download, Share2, Heart, MessageCircle, Bookmark, MoreHorizontal, Play, Video as VideoIcon } from 'lucide-react';

interface PreviewSectionProps {
  content: GeneratedContent;
  status: GenerationStatus;
  aspectRatio: AspectRatio;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ content, status, aspectRatio }) => {
  const [copiedCaption, setCopiedCaption] = React.useState(false);
  const [copiedTags, setCopiedTags] = React.useState(false);

  const copyToClipboard = (text: string, isTags: boolean) => {
    navigator.clipboard.writeText(text);
    if (isTags) {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } else {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  const handleDownloadMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    const url = content.videoUrl || content.imageUrl;
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `one-ai-${Date.now()}.${content.videoUrl ? 'mp4' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const hasMedia = content.imageUrl || content.videoUrl;

  // Empty State - Clean
  if (!content.caption && !hasMedia && !status.isGeneratingText && !status.isGeneratingMedia) {
    return (
      <div className="h-full min-h-[600px] w-full bg-white/50 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200/60">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100">
           <Share2 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Seu preview aparecerá aqui</h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          Configure seu post ao lado (Foto ou Vídeo) e clique em gerar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
      
      {/* Instagram Card Mockup */}
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Mockup Header */}
        <div className="px-5 py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
               <div className="w-full h-full bg-white rounded-full p-[2px]">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=OneAi" alt="avatar" className="w-full h-full rounded-full bg-slate-100" />
               </div>
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-slate-900 leading-none">one.ai</span>
               <span className="text-[11px] text-slate-500 mt-0.5">Original Audio</span>
             </div>
           </div>
           <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </div>

        {/* Media Area */}
        <div className={`relative bg-slate-100 group overflow-hidden flex items-center justify-center transition-all duration-500 ${
          aspectRatio === AspectRatio.SQUARE ? 'aspect-square' :
          aspectRatio === AspectRatio.PORTRAIT ? 'aspect-[3/4]' :
          aspectRatio === AspectRatio.STORY ? 'aspect-[9/16]' :
          'aspect-[16/9]'
        }`}>
          {status.isGeneratingMedia ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50">
               <div className="relative w-16 h-16">
                 <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
               </div>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
                  Criando Mídia
               </p>
            </div>
          ) : content.videoUrl ? (
             <div className="w-full h-full relative group">
                <video 
                  src={content.videoUrl} 
                  className="w-full h-full object-cover" 
                  loop 
                  muted // Auto-play often requires muted
                  autoPlay
                  controls
                  playsInline
                />
                <button 
                  onClick={handleDownloadMedia}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-full font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-white text-xs z-10"
                >
                  <Download className="w-3 h-3" /> Baixar
                </button>
                 <div className="absolute top-4 right-4 bg-black/50 text-white p-1.5 rounded-md backdrop-blur-sm pointer-events-none">
                    <VideoIcon className="w-4 h-4" />
                 </div>
             </div>
          ) : content.imageUrl ? (
            <div className="w-full h-full relative cursor-pointer" onClick={handleDownloadMedia}>
              <img 
                src={content.imageUrl} 
                alt="Generated" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                 <button className="bg-white/90 backdrop-blur text-slate-900 px-6 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 hover:bg-white">
                   <Download className="w-4 h-4" /> Baixar Imagem
                 </button>
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-300 text-sm">Mídia indisponível</div>
          )}
        </div>

        {/* Mockup Actions */}
        <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6 text-slate-800 hover:text-red-500 hover:fill-red-500 cursor-pointer transition-colors" />
                    <MessageCircle className="w-6 h-6 text-slate-800 hover:text-slate-600 cursor-pointer transition-colors" />
                    <Share2 className="w-6 h-6 text-slate-800 hover:text-slate-600 cursor-pointer transition-colors" />
                </div>
                <Bookmark className="w-6 h-6 text-slate-800 hover:text-slate-600 cursor-pointer transition-colors" />
            </div>
            
            {/* Likes */}
            <div className="text-sm font-bold text-slate-900 mb-2">
                1,234 likes
            </div>

            {/* Caption in Mockup */}
            <div className="text-sm text-slate-900 leading-relaxed">
                <span className="font-bold mr-2">one.ai</span>
                {status.isGeneratingText ? (
                    <span className="inline-block w-32 h-3 bg-slate-200 rounded animate-pulse align-middle"></span>
                ) : (
                    <span className="text-slate-700">{content.caption?.slice(0, 100)}{content.caption?.length > 100 ? '...' : ''}</span>
                )}
            </div>
             <div className="text-[10px] text-slate-400 uppercase mt-2 font-medium">2 hours ago</div>
        </div>
      </div>

      {/* Full Text Content & Hashtags */}
      {(content.caption || content.hashtags.length > 0) && (
        <div className="grid grid-cols-1 gap-4">
            
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legenda Completa</h4>
                    <button 
                        onClick={() => copyToClipboard(content.caption, false)}
                        className={`p-2 rounded-xl transition-all ${
                        copiedCaption ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                    >
                        {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed selection:bg-purple-100">
                    {content.caption}
                </p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hashtags</h4>
                    <button 
                        onClick={() => copyToClipboard(content.hashtags.join(' '), true)}
                        className={`p-2 rounded-xl transition-all ${
                        copiedTags ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                    >
                        {copiedTags ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {content.hashtags.map((tag, i) => (
                        <span key={i} className="text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-100 cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;