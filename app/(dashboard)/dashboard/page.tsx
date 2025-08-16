"use client"

import { useState } from "react"
import { AudioRecorder } from "@/components/audio-recorder"
import { AudioUploader } from "@/components/audio-uploader"
import { SlideViewer, Presentation } from "@/components/slide-viewer"
import { SlideEditor } from "@/components/slide-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, AlertCircle, Mic, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ProcessingStep = 'idle' | 'transcribing' | 'generating' | 'complete' | 'error'

export default function DashboardPage() {
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle')
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [transcript, setTranscript] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAudioInput = async (audio: Blob | File) => {
    setError(null)
    setProcessingStep('transcribing')
    setPresentation(null)
    setTranscript("")

    try {
      // Step 1: Transcribe audio
      const formData = new FormData()
      
      // Ensure the audio has a proper filename for OpenAI
      if (audio instanceof Blob) {
        // If it's a blob from recording, create a File with proper extension
        const audioFile = new File([audio], 'recording.webm', { 
          type: audio.type || 'audio/webm' 
        })
        formData.append('audio', audioFile)
      } else {
        // If it's already a File from upload, use it directly
        formData.append('audio', audio)
      }

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!transcribeResponse.ok) {
        const error = await transcribeResponse.json()
        throw new Error(error.error || 'Transcription failed')
      }

      const { transcript } = await transcribeResponse.json()
      setTranscript(transcript)
      
      // Step 2: Generate slides
      setProcessingStep('generating')
      
      const slidesResponse = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      })

      if (!slidesResponse.ok) {
        const error = await slidesResponse.json()
        throw new Error(error.error || 'Slide generation failed')
      }

      const { slides } = await slidesResponse.json()
      setPresentation(slides)
      setProcessingStep('complete')
      
      toast({
        title: "Success!",
        description: "Your presentation has been generated successfully.",
      })

    } catch (err) {
      console.error('Processing error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during processing')
      setProcessingStep('error')
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      })
    }
  }

  const handlePresentationEdit = (updatedPresentation: Presentation) => {
    setPresentation(updatedPresentation)
    toast({
      title: "Changes saved",
      description: "Your presentation has been updated.",
    })
  }

  const getProgressValue = () => {
    switch (processingStep) {
      case 'transcribing': return 33
      case 'generating': return 66
      case 'complete': return 100
      default: return 0
    }
  }

  const getProgressMessage = () => {
    switch (processingStep) {
      case 'transcribing': return 'Transcribing your audio...'
      case 'generating': return 'Generating slides with AI...'
      case 'complete': return 'Your presentation is ready!'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Presentation</h1>
        <p className="text-muted-foreground">
          Transform your voice into professional slides in seconds
        </p>
      </div>

      {/* Step 1: Audio Input */}
      {processingStep === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Provide Your Audio</CardTitle>
            <CardDescription>
              Record your presentation or upload an existing audio file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="record" className="gap-2">
                  <Mic className="h-4 w-4" />
                  Record
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="record" className="mt-4">
                <AudioRecorder onRecordingComplete={handleAudioInput} />
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <AudioUploader onFileSelect={handleAudioInput} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {(processingStep === 'transcribing' || processingStep === 'generating') && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Your Audio</CardTitle>
            <CardDescription>
              Please wait while we create your presentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{getProgressMessage()}</span>
            </div>
            <Progress value={getProgressValue()} className="w-full" />
            {transcript && processingStep === 'generating' && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Transcript:</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {transcript}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {processingStep === 'error' && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try again with a different audio file or recording.
          </AlertDescription>
        </Alert>
      )}

      {/* Step 2: View and Edit Presentation */}
      {processingStep === 'complete' && presentation && (
        <>
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Your presentation has been generated successfully! You can now preview, edit, or export it.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <SlideViewer presentation={presentation} />
            <SlideEditor 
              presentation={presentation} 
              onSave={handlePresentationEdit}
            />
          </div>

          {transcript && (
            <Card>
              <CardHeader>
                <CardTitle>Original Transcript</CardTitle>
                <CardDescription>
                  The text that was extracted from your audio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{transcript}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}