export const SLIDE_GENERATION_PROMPT = `You are an expert presentation designer. Convert the following transcript into a professional presentation with EXACTLY 5 slides.

Output a JSON object with the following structure:
{
  "title": "Main presentation title",
  "slides": [
    {
      "title": "Slide title",
      "points": ["Point 1", "Point 2", "Point 3"],
      "speakerNotes": "What the presenter should say for this slide"
    }
  ]
}

Requirements:
- Create EXACTLY 5 slides
- Each slide should have a clear, concise title
- Include 3-5 bullet points per slide (keep them short and impactful)
- Bullet points should be complete thoughts but concise (5-10 words ideal)
- Speaker notes should expand on the bullet points with what the presenter would actually say
- Make the content professional and well-structured
- Use clear, business-appropriate language
- Ensure logical flow from slide to slide
- First slide should be an introduction/overview
- Last slide should be a conclusion/summary/next steps

[TRANSCRIPT]:
`

export function buildSlidePrompt(transcript: string): string {
  return SLIDE_GENERATION_PROMPT + transcript
}