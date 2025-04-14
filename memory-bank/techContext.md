# Voice Agent POC - Tech Context

## Technology Stack

### Core Framework

- **Next.js 15.2.4**
  - App Router
  - API Routes
  - Server Components
  - TypeScript support

### Frontend

- **React 19**
  - Hooks for state management
  - Client components
  - Event handling

### Styling

- **Tailwind CSS**
  - Utility-first CSS
  - Responsive design
  - Custom theme configuration

### UI Components

- **Radix UI**
  - Accessible primitives
  - Custom components
  - Theme support

### Audio Processing

- **Web Audio API**
  - MediaRecorder
  - AudioContext
  - Blob handling

### External Services

- **OpenAI APIs**
  - Whisper API (speech-to-text)
  - GPT-4 (conversation)
  - TTS API (text-to-speech)

## Development Setup

### Prerequisites

1. Node.js (v18 or higher)
2. pnpm package manager
3. OpenAI API key
4. Modern web browser with Web Audio API support

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Add OpenAI API key to .env
OPENAI_API_KEY=your_api_key_here
```

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Project Structure

```
voice-agent-poc/
├── app/
│   ├── api/
│   │   ├── transcribe/
│   │   ├── speech/
│   │   └── extract-response-text/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── voice-agent.tsx
├── lib/
│   └── utils.ts
├── public/
├── styles/
└── package.json
```

## Dependencies

### Production Dependencies

- @hookform/resolvers: Form validation
- @radix-ui/\*: UI components
- autoprefixer: CSS prefixing
- class-variance-authority: Class utilities
- cmdk: Command palette
- date-fns: Date manipulation
- lucide-react: Icons
- next: Framework
- next-themes: Theme support
- react: Core library
- react-dom: DOM rendering
- react-hook-form: Form handling
- tailwind-merge: Class merging
- zod: Schema validation

### Development Dependencies

- @types/node: TypeScript types
- @types/react: React types
- postcss: CSS processing
- tailwindcss: CSS framework
- typescript: Type checking

## Environment Variables

```env
OPENAI_API_KEY=your_api_key_here
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Endpoints

1. `/api/transcribe`

   - POST: Convert audio to text
   - Accepts: audio/webm file
   - Returns: JSON with transcription

2. `/api/speech`

   - POST: Generate speech from text
   - Accepts: JSON with messages
   - Returns: audio/mpeg file

3. `/api/extract-response-text`
   - POST: Extract text from audio
   - Accepts: JSON with audio URL
   - Returns: JSON with text

## Performance Considerations

1. Audio file size limits
2. API rate limits
3. Browser memory usage
4. Network latency
5. Response time optimization
