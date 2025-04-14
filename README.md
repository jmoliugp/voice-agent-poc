# Voice Agent POC

A proof-of-concept voice agent application that demonstrates real-time voice interaction with an AI assistant. This application allows users to speak to an AI and receive voice responses, creating a natural conversation experience.

## Demo

The application features a clean, modern interface with:

- A prominent microphone button for voice recording
- Real-time transcription display
- Conversation history with user and assistant messages
- Playback controls for previous responses
- Responsive design that works on both desktop and mobile devices

## Features

- 🎤 Real-time voice recording and playback
- 🎯 Automatic speech-to-text transcription using OpenAI's Whisper API
- 💬 AI-powered conversation using GPT-4
- 🔊 Text-to-speech conversion using OpenAI's TTS API
- 📝 Conversation history display
- 🎨 Modern, responsive UI with intuitive controls

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Audio Processing**: Web Audio API
- **AI Services**: OpenAI APIs (Whisper, GPT-4, TTS)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- OpenAI API key
- Modern web browser with Web Audio API support

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Development

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

## How It Works

1. User clicks the microphone button to start recording
2. User speaks their message
3. Recording is automatically transcribed using Whisper API
4. Transcription is sent to GPT-4 for response generation
5. Response is converted to speech using TTS API
6. Speech is played back to the user
7. Conversation history is updated and displayed

## Project Structure

```
voice-agent-poc/
├── app/
│   ├── api/
│   │   ├── transcribe/     # Speech-to-text API
│   │   ├── speech/         # Text-to-speech API
│   │   └── extract-response-text/  # Response text extraction
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── voice-agent.tsx     # Main voice agent component
├── lib/
│   └── utils.ts            # Utility functions
├── public/
├── styles/
└── package.json
```

## API Endpoints

- `/api/transcribe`: Convert audio to text
- `/api/speech`: Generate speech from text
- `/api/extract-response-text`: Extract text from audio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the AI services
- Next.js team for the amazing framework
- Radix UI for the accessible components
- Tailwind CSS for the utility-first styling

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/voice-agent-poc/issues).

## Success Metrics

- Response time under 3 seconds
- 95% transcription accuracy
- Smooth playback experience
- Clear error messages
- Accessible interface
