# One Ai 🚀

**One Ai** é uma plataforma avançada de criação de conteúdo para Instagram, alimentada pela inteligência artificial de ponta do Google Gemini. Transforme ideias simples em posts profissionais, completos com legendas magnéticas, hashtags estratégicas e mídias (fotos e vídeos) de alta qualidade em segundos.

---

## ✨ Funcionalidades Principais

- **📸 Geração de Imagens Premium**: Criação de fotos fotorrealistas e estéticas usando o modelo `gemini-2.5-flash-image`, com suporte total a diferentes proporções (1:1, 3:4, 9:16, 16:9).
- **🎥 Geração de Vídeos (Veo)**: Integração com o modelo `veo-3.1-fast-generate-preview` para criar vídeos cinematográficos curtos para Reels e Stories.
- **✍️ Estrategista de Conteúdo**: Geração de legendas otimizadas para conversão, com ganchos (hooks) poderosos, storytelling e chamadas para ação (CTA) claras.
- **🎯 Configurações Avançadas**:
    - **Público-alvo**: Personalize a linguagem para seu nicho específico.
    - **Objetivos**: Escolha entre Engajamento, Vendas, Branding ou Educação.
    - **Estilos Visuais**: De Fotografia Realista a Cyberpunk ou Editorial de Revista.
    - **Vibe & Tom**: Ajuste a personalidade da marca (Profissional, Divertido, Urgente, etc).
- **🪄 Mágica de Prompt**: Refinamento automático de ideias simples em prompts detalhados para melhores resultados visuais.
- **📱 Preview em Tempo Real**: Mockup do Instagram para visualizar como o post ficará antes de publicar.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **IA/ML**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
    - **Texto**: `gemini-2.5-flash`
    - **Imagem**: `gemini-2.5-flash-image`
    - **Vídeo**: `veo-3.1-fast-generate-preview`

---

## 🚀 Como Funciona

### 1. Configuração do Post
O usuário define o tópico, público, objetivo e estilo visual. O sistema utiliza esses parâmetros para construir contextos ricos que são enviados aos modelos da Google.

### 2. Geração de Texto
O `gemini-2.5-flash` atua como um estrategista de marketing, analisando o objetivo e o público para criar uma legenda estruturada com ganchos e CTAs, além de selecionar as hashtags mais relevantes.

### 3. Geração de Mídia
- **Imagens**: O sistema traduz o estilo visual e o tópico em prompts técnicos em inglês para garantir a máxima qualidade e fidelidade ao formato escolhido (Aspect Ratio).
- **Vídeos**: Utiliza o modelo Veo para gerar vídeos dinâmicos. Caso o usuário forneça uma imagem de referência, ela é usada como o frame inicial do vídeo.

---

## 🔑 Configuração e Instalação

Para rodar o projeto localmente ou em produção, é necessário configurar as chaves de API do Google Gemini.

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 📝 Licença e Direitos Autorais

Este projeto foi desenvolvido com foco em excelência criativa e inovação tecnológica.

© 2026 **Luís Vargas**. Todos os direitos reservados.

---

*Desenvolvido com ❤️ para criadores de conteúdo que buscam o próximo nível.*
