import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AspectRatio, Tone, PostConfig, PostGoal, VisualStyle, CaptionLength } from "../types";

// Helper to get a fresh client instance. 
// For Veo, we must ensure we use the key selected by the user via window.aistudio if available, 
// or fall back to process.env.API_KEY.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Response schema for text generation
const textResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    caption: {
      type: Type.STRING,
      description: "Uma legenda envolvente para o Instagram, incluindo emojis relevantes.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Uma lista de 10-15 hashtags relevantes e populares.",
    },
  },
  required: ["caption", "hashtags"],
};

export const generatePostText = async (config: PostConfig) => {
  try {
    const ai = getAiClient();
    const prompt = `Você é um estrategista de conteúdo especialista em Instagram. 
    Crie um post de alta conversão sobre: "${config.topic}". 
    
    Contexto Adicional:
    - Público-alvo: ${config.audience || 'Geral'}
    - Objetivo do Post: ${config.goal}
    - Tom de voz: ${config.tone}
    - Tamanho da Legenda: ${config.captionLength}
    
    Estrutura da Legenda:
    1. Gancho inicial (Hook) impactante nas primeiras 2 linhas.
    2. Corpo do texto com informações valiosas ou storytelling envolvente.
    3. Use quebras de linha para facilitar a leitura (escaneabilidade).
    4. Inclua um Call to Action (CTA) claro no final condizente com o objetivo (${config.goal}).
    5. Use emojis de forma estratégica.
    
    Escreva em Português do Brasil.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: textResponseSchema,
        temperature: 0.8,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Não foi possível gerar o texto.");
  } catch (error) {
    console.error("Erro ao gerar texto:", error);
    throw error;
  }
};

export const enhanceUserPrompt = async (draft: string) => {
  try {
    const ai = getAiClient();
    const prompt = `You are an expert prompt engineer for Instagram content creation. 
    Rewrite the following user description into a detailed, high-quality prompt suitable for generating a stunning, scroll-stopping Instagram post (image or video).
    
    User description: "${draft}"
    
    Rules:
    1. Focus on lighting (e.g., golden hour, soft studio, cinematic), textures, composition, and a clear, compelling subject.
    2. Make it sound like a high-end lifestyle or professional photography shot.
    3. Keep it concise but highly descriptive (under 60 words).
    4. Output ONLY the enhanced prompt text in English for maximum compatibility with AI models.
    5. Do not add quotes, explanations, or prefixes.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || draft;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return draft; // Fallback to original
  }
};

export const generatePostImage = async (config: PostConfig) => {
  try {
    const ai = getAiClient();
    
    // Enhanced Instagram-focused prompt
    const ratioDescription = {
      [AspectRatio.SQUARE]: "quadrada (1:1), ideal para o feed do Instagram",
      [AspectRatio.PORTRAIT]: "vertical (3:4), formato retrato para o feed do Instagram",
      [AspectRatio.STORY]: "vertical longa (9:16), perfeita para Stories ou Reels do Instagram",
      [AspectRatio.LANDSCAPE]: "horizontal (16:9), formato paisagem"
    }[config.aspectRatio];

    let promptText = `Create a professional, high-end Instagram post image about: "${config.topic}".
    The visual style should be: ${config.visualStyle}.
    The mood and tone should be: ${config.tone}.
    Target Audience: ${config.audience || 'General Instagram users'}.
    
    CRITICAL REQUIREMENT:
    - You MUST generate the image in the following format: ${ratioDescription}.
    - This is for an Instagram post, so ensure the composition perfectly fits a ${config.aspectRatio} aspect ratio.
    
    Compositional Guidelines:
    - Aesthetic: Modern, clean, and highly engaging for social media.
    - Style Specifics: ${config.visualStyle} aesthetic.
    - Lighting: Professional studio lighting or soft natural daylight.
    - Quality: Photorealistic, 8k resolution, cinematic depth of field, sharp focus.
    - Vibe: Trending on Instagram, influencer-style photography, premium brand aesthetic.
    - NO text, NO logos, NO watermarks.`;
    
    if (config.referenceImages.length > 0) {
      promptText += " The output image MUST be strongly inspired by the provided reference images in terms of composition, lighting, and color palette.";
    }

    const parts: any[] = [{ text: promptText }];

    if (config.referenceImages.length > 0) {
      config.referenceImages.forEach((img) => {
        // Extract base64 data and mime type
        // Data URL format: data:image/jpeg;base64,....
        const matches = img.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const data = matches[2];
          parts.push({
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          });
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        }
      }
    });

    // Extract image from parts
    const responseParts = response.candidates?.[0]?.content?.parts;
    let textFallback = "";

    if (responseParts) {
      for (const part of responseParts) {
        // Prioritize finding the image
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        // Collect text in case image generation failed/was refused
        if (part.text) {
          textFallback += part.text;
        }
      }
    }
    
    if (textFallback) {
      // If the model returned text but no image, it's likely a refusal or explanation
      throw new Error(`O modelo retornou texto ao invés de imagem: "${textFallback.slice(0, 100)}..."`);
    }
    
    throw new Error("Nenhuma imagem gerada. Tente simplificar o tópico ou trocar as referências.");
  } catch (error: any) {
    console.error("Erro ao gerar imagem:", error);
    throw new Error(error.message || "Falha desconhecida ao gerar imagem.");
  }
};

export const generatePostVideo = async (config: PostConfig) => {
  try {
    const ai = getAiClient();
    
    // Map existing aspect ratios to Veo supported ratios (16:9 or 9:16)
    // 1:1 and 3:4/9:16 map to 9:16 (Portrait)
    // 16:9 maps to 16:9 (Landscape)
    const videoAspectRatio = config.aspectRatio === AspectRatio.LANDSCAPE ? '16:9' : '9:16';

    const promptText = `Cinematic video about: ${config.topic}. 
    Style: ${config.visualStyle}.
    Mood: ${config.tone}. 
    Target Audience: ${config.audience || 'General social media users'}.
    High quality, professional lighting, 4k, trending on social media.`;

    // Config for Veo
    const veoConfig: any = {
      numberOfVideos: 1,
      resolution: '720p', // Using 720p for faster preview generation
      aspectRatio: videoAspectRatio
    };

    // If reference image exists, use the first one as a starting image
    let imageInput = undefined;
    if (config.referenceImages.length > 0) {
      const matches = config.referenceImages[0].match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        imageInput = {
          mimeType: matches[1],
          imageBytes: matches[2]
        };
      }
    }

    // Call generateVideos (starts the operation)
    // Note: prompt is optional if image is provided, but we'll provide prompt for better context
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: promptText,
      image: imageInput,
      config: veoConfig
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
       // Try to parse the error message if it's a JSON string
       try {
         const errorMessage = typeof operation.error.message === 'string' ? operation.error.message : JSON.stringify(operation.error.message);
         const errorObj = JSON.parse(errorMessage);
         if (errorObj.error && errorObj.error.message) {
            throw new Error(errorObj.error.message);
         }
       } catch (e) {
         // If not JSON or other error, use the raw message
       }
       throw new Error(`Veo Error: ${operation.error.message}`);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("Vídeo gerado, mas URI não encontrado.");
    }

    // Append API key to fetch the actual video bytes
    const videoUrlWithKey = `${videoUri}&key=${process.env.API_KEY}`;
    
    return videoUrlWithKey;

  } catch (error: any) {
    console.error("Erro ao gerar vídeo:", error);
    throw new Error(error.message || "Falha desconhecida ao gerar vídeo.");
  }
};