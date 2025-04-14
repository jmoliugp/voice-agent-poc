"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Square, Volume2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function VoiceAgent() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [transcript, setTranscript] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      audioRef.current.onended = () => setIsPlaying(false)
    }

    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = handleRecordingStop

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setTranscript("")
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
    }
  }

  const handleRecordingStop = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

      // Create form data to send to API
      const formData = new FormData()
      formData.append("file", audioBlob, "recording.webm")
      formData.append("model", "whisper-1")

      // Transcribe audio using Whisper API
      const transcriptionResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!transcriptionResponse.ok) {
        throw new Error("Failed to transcribe audio")
      }

      const { text } = await transcriptionResponse.json()
      setTranscript(text)

      // Add user message
      const updatedMessages = [...messages, { role: "user", content: text }]
      setMessages(updatedMessages)

      // Get AI response
      const speechResponse = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      })

      if (!speechResponse.ok) {
        throw new Error("Failed to get speech response")
      }

      // Get response as blob and play it
      const aiAudioBlob = await speechResponse.blob()
      const audioUrl = URL.createObjectURL(aiAudioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
      }

      // Get the text response
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          // The first 16 bytes contain metadata, so we extract the JSON after that
          const responseText = await fetch("/api/extract-response-text", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audioUrl }),
          })

          if (!responseText.ok) {
            throw new Error("Failed to extract response text")
          }

          const { text: assistantText } = await responseText.json()

          // Add assistant message
          setMessages([...updatedMessages, { role: "assistant", content: assistantText }])
        } catch (error) {
          console.error("Error extracting response text:", error)
        }
      }
      reader.readAsArrayBuffer(aiAudioBlob)
    } catch (error) {
      console.error("Error processing recording:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const playLastResponse = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const stopPlaying = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex space-x-4">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={cn("h-16 w-16 rounded-full", isRecording && "animate-pulse")}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
              >
                {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-16 w-16 rounded-full"
                onClick={isPlaying ? stopPlaying : playLastResponse}
                disabled={isProcessing || messages.length === 0 || !messages.some((m) => m.role === "assistant")}
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                <span className="text-gray-500">Processing...</span>
              </div>
            )}

            {transcript && (
              <div className="w-full mt-4">
                <p className="font-medium text-sm text-gray-500">You said:</p>
                <p className="text-lg">{transcript}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Conversation</h2>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg",
                    message.role === "user" ? "bg-blue-100 ml-auto max-w-[80%]" : "bg-gray-100 mr-auto max-w-[80%]",
                  )}
                >
                  <p className="text-sm font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</p>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
