import VoiceAgent from "@/components/voice-agent"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Voice Agent POC</h1>
        <p className="text-center mb-8 text-gray-600">
          Click the microphone button and speak. The AI will respond with voice.
        </p>
        <VoiceAgent />
      </div>
    </main>
  )
}
