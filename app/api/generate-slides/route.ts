import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSlidePrompt } from '@/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    // Get transcript from request
    const { transcript } = await req.json()
    
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Generate slides using Claude
    const prompt = buildSlidePrompt(transcript)
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent structure
      system: "You are a professional presentation designer. Always respond with valid JSON only, no additional text.",
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // Extract the JSON from the response
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude')
    }

    // Parse the JSON response
    let slides
    try {
      // Clean the response in case there's any markdown formatting
      const jsonStr = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      slides = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      return NextResponse.json(
        { error: 'Failed to parse slide structure' },
        { status: 500 }
      )
    }

    // Validate the structure
    if (!slides.title || !slides.slides || !Array.isArray(slides.slides)) {
      return NextResponse.json(
        { error: 'Invalid slide structure received' },
        { status: 500 }
      )
    }

    // Ensure we have exactly 5 slides
    if (slides.slides.length !== 5) {
      // Adjust to exactly 5 slides if needed
      if (slides.slides.length > 5) {
        slides.slides = slides.slides.slice(0, 5)
      } else {
        // Add placeholder slides if less than 5
        while (slides.slides.length < 5) {
          slides.slides.push({
            title: `Additional Information ${slides.slides.length + 1}`,
            points: ['Further details to be added'],
            speakerNotes: 'Expand on this topic as needed'
          })
        }
      }
    }

    return NextResponse.json({ 
      slides,
      success: true 
    })

  } catch (error) {
    console.error('Slide generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate slides' },
      { status: 500 }
    )
  }
}

export const maxDuration = 30