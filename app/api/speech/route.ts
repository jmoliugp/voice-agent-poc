import { type NextRequest, NextResponse } from "next/server"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Add system message if not present
    const formattedMessages: Message[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    if (!formattedMessages.some((m) => m.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content: "You are a helpful voice assistant. Keep your responses concise and conversational.",
      })
    }

    // First, get the text response from the chat API
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: formattedMessages,
        max_tokens: 150,
      }),
    })

    if (!chatResponse.ok) {
      const error = await chatResponse.json()
      console.error("OpenAI Chat API error:", error)
      return NextResponse.json({ error: "Failed to get chat response" }, { status: chatResponse.status })
    }

    const chatResult = await chatResponse.json()
    const responseText = chatResult.choices[0].message.content

    // Then, convert the text to speech
    const speechResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "alloy",
        input: responseText,
        response_format: "mp3",
      }),
    })

    if (!speechResponse.ok) {
      const error = await speechResponse.text()
      console.error("OpenAI Speech API error:", error)
      return NextResponse.json({ error: "Failed to generate speech" }, { status: speechResponse.status })
    }

    // Get the audio data
    const audioData = await speechResponse.arrayBuffer()

    // Create a new response with the audio data and metadata
    const response = new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Response-Text": responseText,
      },
    })

    return response
  } catch (error) {
    console.error("Error in speech API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
