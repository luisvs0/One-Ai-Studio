import React, { useState, useRef, useEffect } from 'react';
import { PostConfig, GeneratedContent, GenerationStatus, Tone, AspectRatio, MediaType, PostGoal, VisualStyle, CaptionLength } from './types';
import InputSection from './components/InputSection';
import PreviewSection from './components/PreviewSection';
import { generatePostText, generatePostImage, generatePostVideo } from './services/geminiService';
import { Sparkles, Zap, Key } from 'lucide-react';

const App: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState<PostConfig>({
    topic: '',
    audience: '',
    tone: Tone.PROFESSIONAL,
    goal: PostGoal.ENGAGEMENT,
    visualStyle: VisualStyle.PHOTOGRAPHY,
    captionLength: CaptionLength.MEDIUM,
    aspectRatio: AspectRatio.SQUARE,
    mediaType: MediaType.IMAGE,
    referenceImages: [],
  });

  const [content, setContent] = useState<GeneratedContent>({
    caption: '',
    hashtags: [],
    imageUrl: null,
    videoUrl: null,
  });

  const [status, setStatus] = useState<GenerationStatus>({
    isGeneratingText: false,
    isGeneratingMedia: false,
    error: null,
  });

  // Auto-scroll to preview when content is generated
  useEffect(() => {
    if ((content.caption || content.imageUrl || content.videoUrl) && !status.isGeneratingText && !status.isGeneratingMedia) {
      if (previewRef.current) {
        // Add a small delay to ensure rendering is complete
        setTimeout(() => {
          previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [content.caption, content.imageUrl, content.videoUrl, status.isGeneratingText, status.isGeneratingMedia]);

  const handleGenerate = async () => {
    // API Key Check for Veo
    if (config.mediaType === MediaType.VIDEO && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        try {
          await (window as any).aistudio.openSelectKey();
          // Assuming successful selection if promise resolves
        } catch (e) {
          setStatus(prev => ({ ...prev, error: "É necessário selecionar uma chave API paga para gerar vídeos com Veo." }));
          return;
        }
      }
    }

    setStatus({ isGeneratingText: true, isGeneratingMedia: true, error: null });
    setContent({ caption: '', hashtags: [], imageUrl: null, videoUrl: null });

    const textPromise = generatePostText(config)
      .then((data) => {
        setContent(prev => ({ ...prev, caption: data.caption, hashtags: data.hashtags }));
      })
      .catch((err) => {
        console.error("Failed to generate text", err);
        setStatus(prev => ({ ...prev, error: "Falha ao gerar o texto." }));
      })
      .finally(() => {
        setStatus(prev => ({ ...prev, isGeneratingText: false }));
      });

    let mediaPromise;
    
    if (config.mediaType === MediaType.VIDEO) {
      mediaPromise = generatePostVideo(config)
        .then((url) => {
          setContent(prev => ({ ...prev, videoUrl: url }));
        })
        .catch((err) => {
          console.error("Failed to generate video", err);
           // Handle "Requested entity was not found" specific error for API key issues
           if (err.message && err.message.includes("Requested entity was not found")) {
             if ((window as any).aistudio) {
               (window as any).aistudio.openSelectKey().catch(console.error);
             }
             setStatus(prev => ({ 
               ...prev, 
               error: "Erro de autenticação. Por favor, selecione sua chave API novamente." 
             }));
           } else {
             setStatus(prev => ({ 
               ...prev, 
               error: prev.error ? prev.error + " Falha ao gerar vídeo." : "Falha ao gerar vídeo: " + err.message 
             }));
           }
        })
        .finally(() => {
          setStatus(prev => ({ ...prev, isGeneratingMedia: false }));
        });
    } else {
      mediaPromise = generatePostImage(config)
        .then((url) => {
          setContent(prev => ({ ...prev, imageUrl: url }));
        })
        .catch((err) => {
          console.error("Failed to generate image", err);
          setStatus(prev => ({ 
            ...prev, 
            error: prev.error ? prev.error + " Falha ao gerar imagem." : "Falha ao gerar a imagem." 
          }));
        })
        .finally(() => {
          setStatus(prev => ({ ...prev, isGeneratingMedia: false }));
        });
    }

    await Promise.all([textPromise, mediaPromise]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 selection:bg-purple-200 selection:text-purple-900 font-sans">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header - Modern & Centered */}
        <div className="flex flex-col items-center justify-center mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 border border-purple-100 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500 fill-purple-500" />
            <span className="text-xs font-semibold tracking-wide text-purple-900 uppercase">Inteligência Criativa</span>
          </div>
          
          <img 
            src="/logo.png" 
            alt="One Ai" 
            className="h-28 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image not found
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('logo-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <h1 id="logo-fallback" className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 hidden">
            One <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Ai</span>
          </h1>

          <p className="text-slate-500 max-w-lg text-lg">
            Transforme ideias em realidade visual em segundos.
          </p>
        </div>

        {/* Error Alert */}
        {status.error && (
          <div className="mb-8 mx-auto max-w-2xl bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-bounce">
            <Zap className="w-5 h-5 flex-shrink-0 fill-red-200" />
            <p className="font-medium">{status.error}</p>
          </div>
        )}

        {/* Main Layout - Card based */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column - Input Panel */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 sticky top-8 transition-all hover:shadow-[0_20px_40px_rgb(124,58,237,0.05)]">
            <InputSection 
              config={config} 
              setConfig={setConfig} 
              onGenerate={handleGenerate} 
              isGenerating={status.isGeneratingText || status.isGeneratingMedia}
            />
          </div>

          {/* Right Column - Preview Panel */}
          <div className="lg:col-span-7" ref={previewRef}>
             <PreviewSection content={content} status={status} aspectRatio={config.aspectRatio} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;