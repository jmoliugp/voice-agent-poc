import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const model = (formData.get("model") as string) || "whisper-1"

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Create a new FormData instance for the OpenAI API request
    const openAIFormData = new FormData()
    openAIFormData.append("file", file)
    openAIFormData.append("model", model)

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to transcribe audio" }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in transcribe API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
