"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, Pause, Play, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  maxDuration?: number // in seconds, default 180 (3 minutes)
}

export function AudioRecorder({ onRecordingComplete, maxDuration = 180 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused, maxDuration])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Try different mime types in order of preference for OpenAI Whisper compatibility
      let mimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'
      } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
        mimeType = 'audio/mpeg'
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Create blob with explicit webm type for OpenAI compatibility
        const blob = new Blob(chunksRef.current, { 
          type: 'audio/webm' 
        })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)
      setAudioBlob(null)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const handleUseRecording = () => {
    if (audioBlob) {
      setIsProcessing(true)
      onRecordingComplete(audioBlob)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setDuration(0)
    setIsProcessing(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Record Audio</h3>
          {duration > 0 && (
            <div className="text-2xl font-mono font-medium">
              {formatTime(duration)} / {formatTime(maxDuration)}
            </div>
          )}
        </div>

        {/* Recording visualization */}
        <div className="relative h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {isRecording && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 bg-primary rounded-full transition-all duration-300",
                    isPaused ? "h-4" : "animate-pulse"
                  )}
                  style={{
                    height: isPaused ? '16px' : `${20 + Math.random() * 40}px`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          )}
          {!isRecording && !audioBlob && (
            <p className="text-muted-foreground">Click record to start</p>
          )}
          {!isRecording && audioBlob && (
            <p className="text-muted-foreground">Recording complete</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isRecording && !audioBlob && (
            <Button onClick={startRecording} size="lg" className="gap-2">
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              {!isPaused ? (
                <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2">
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeRecording} variant="outline" size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Resume
                </Button>
              )}
              <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
                <Square className="h-5 w-5" />
                Stop
              </Button>
            </>
          )}

          {audioBlob && !isRecording && (
            <>
              <Button onClick={resetRecording} variant="outline" size="lg">
                Record Again
              </Button>
              <Button 
                onClick={handleUseRecording} 
                size="lg" 
                className="gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Use This Recording'
                )}
              </Button>
            </>
          )}
        </div>

        {/* Info text */}
        <p className="text-sm text-muted-foreground text-center">
          {isRecording 
            ? `Recording... ${maxDuration - duration} seconds remaining`
            : "Maximum recording duration: 3 minutes"
          }
        </p>
      </div>
    </Card>
  )
}