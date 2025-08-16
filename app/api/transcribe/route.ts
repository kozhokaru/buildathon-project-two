import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Get the audio file from the request
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Check file size (25MB limit)
    const maxSize = 25 * 1024 * 1024
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      )
    }

    // Ensure the file has a proper extension for OpenAI
    // If the file doesn't have an extension, add .webm
    let fileName = audioFile.name
    if (!fileName.includes('.')) {
      fileName = 'recording.webm'
    }
    
    // Create a new File object with the proper name if needed
    const properAudioFile = new File([audioFile], fileName, {
      type: audioFile.type || 'audio/webm'
    })

    // Create form data for OpenAI API
    const openAIFormData = new FormData()
    openAIFormData.append('file', properAudioFile)
    openAIFormData.append('model', 'whisper-1')
    openAIFormData.append('response_format', 'text')
    openAIFormData.append('language', 'en') // You can make this dynamic if needed

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: openAIFormData,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: response.status }
      )
    }

    const transcript = await response.text()
    
    // Return the transcript
    return NextResponse.json({ 
      transcript: transcript.trim(),
      success: true 
    })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}

// Set max duration for the API route (30 seconds should be enough)
export const maxDuration = 30