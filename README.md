# 🎙️ Voice-to-Slide Generator

**Transform your voice into professional presentations instantly.** Record or upload audio, and let AI create stunning slides in seconds - perfect for hackathons, pitches, and presentations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e?style=flat-square&logo=supabase)

## ✨ Features

### Voice-to-Slide Generation
- 🎤 **Audio Recording** - Record directly in browser with visual feedback
- 📁 **File Upload** - Support for MP3, WAV, WebM formats (up to 25MB)
- 🤖 **AI Transcription** - OpenAI Whisper for accurate speech-to-text
- ✨ **Smart Slides** - Claude AI generates structured presentations
- 📊 **Live Preview** - Interactive slide viewer with Reveal.js
- ✏️ **Quick Editing** - Edit slides before exporting
- 💾 **Export Options** - Download as HTML or print to PDF

### Technical Stack
- **Framework**: Next.js 15 with App Router
- **AI Services**: OpenAI Whisper + Anthropic Claude
- **Presentation**: Reveal.js (CDN)
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Supabase Auth
- **Type Safety**: TypeScript with strict mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key (for transcription)
- Anthropic API key (for slide generation)
- Supabase account (free tier works)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/voice-to-slides.git
cd voice-to-slides

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### 2. Configure API Keys

Edit `.env.local` and add your API keys:

```env
# Supabase (get from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for Whisper transcription)
OPENAI_API_KEY=sk-...your_openai_key

# Anthropic (for slide generation)
ANTHROPIC_API_KEY=sk-ant-...your_anthropic_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 How to Use

1. **Navigate to Dashboard**: Click "Start Creating" on the landing page
2. **Choose Input Method**:
   - **Record**: Click record button and speak your presentation
   - **Upload**: Drag and drop or select an audio file
3. **Wait for Processing**:
   - Audio is transcribed using Whisper
   - Claude AI generates 5 professional slides
4. **Review & Edit**:
   - Preview slides in the viewer
   - Make quick edits if needed
5. **Export**:
   - Download as HTML for sharing
   - Print to PDF for offline use

## 🏗️ Project Structure

```
/app
  /api
    /transcribe         # Whisper API integration
    /generate-slides    # Claude slide generation
  /(dashboard)
    /dashboard          # Main app interface
/components
  audio-recorder.tsx    # Browser recording
  audio-uploader.tsx    # File upload handling
  slide-viewer.tsx      # Reveal.js presentation
  slide-editor.tsx      # Quick edit interface
/lib
  prompts.ts           # AI prompt templates
```

## 🎯 Perfect For

- **Hackathon Presentations**: Create your pitch deck in minutes
- **Quick Demos**: Turn ideas into slides instantly
- **Meeting Prep**: Transform notes into presentations
- **Educational Content**: Convert lectures to slides

## 🛠️ Development

### Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding Features

The codebase is designed for rapid iteration:
- Audio processing in `/app/api/transcribe`
- Slide generation logic in `/app/api/generate-slides`
- UI components are modular and reusable
- Prompts can be customized in `/lib/prompts.ts`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

```bash
# Quick deploy script
npm run deploy
```

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📝 API Usage & Limits

- **OpenAI Whisper**: $0.006/minute of audio
- **Claude API**: ~$0.01 per presentation
- **File Size**: 25MB max for audio uploads
- **Recording**: 3 minutes max duration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - use this for whatever you want!

## 🏆 Built for Hackathons

This project was built to win hackathons. It focuses on:
- **Speed**: Generate presentations in under 30 seconds
- **Quality**: Professional output without manual editing
- **Simplicity**: One-click from voice to slides
- **Polish**: Clean UI that impresses judges

---

**Made with ⚡ for hackathon warriors**