"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Save, X, Plus, Trash2 } from "lucide-react"
import { Presentation, Slide } from "./slide-viewer"

interface SlideEditorProps {
  presentation: Presentation
  onSave: (presentation: Presentation) => void
}

export function SlideEditor({ presentation: initialPresentation, onSave }: SlideEditorProps) {
  const [presentation, setPresentation] = useState<Presentation>(initialPresentation)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)

  const handleTitleChange = (value: string) => {
    setPresentation(prev => ({ ...prev, title: value }))
  }

  const handleSlideChange = (index: number, field: keyof Slide, value: any) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === index ? { ...slide, [field]: value } : slide
      )
    }))
  }

  const handlePointChange = (slideIndex: number, pointIndex: number, value: string) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === slideIndex 
          ? {
              ...slide,
              points: slide.points.map((point, j) => 
                j === pointIndex ? value : point
              )
            }
          : slide
      )
    }))
  }

  const addPoint = (slideIndex: number) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === slideIndex 
          ? { ...slide, points: [...slide.points, 'New bullet point'] }
          : slide
      )
    }))
  }

  const removePoint = (slideIndex: number, pointIndex: number) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === slideIndex 
          ? {
              ...slide,
              points: slide.points.filter((_, j) => j !== pointIndex)
            }
          : slide
      )
    }))
  }

  const handleSave = () => {
    onSave(presentation)
    setIsEditing(false)
    setEditingSlideIndex(null)
  }

  const handleCancel = () => {
    setPresentation(initialPresentation)
    setIsEditing(false)
    setEditingSlideIndex(null)
  }

  if (!isEditing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Edit</h3>
          <Button onClick={() => setIsEditing(true)} size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Slides
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Click edit to make quick changes to your slides before exporting.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Presentation</h3>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Presentation Title */}
        <div>
          <label className="text-sm font-medium">Presentation Title</label>
          <Input
            value={presentation.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Slides */}
        <div className="space-y-4">
          {presentation.slides.map((slide, slideIndex) => (
            <Card key={slideIndex} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Slide {slideIndex + 1}</h4>
                  <Button
                    onClick={() => setEditingSlideIndex(
                      editingSlideIndex === slideIndex ? null : slideIndex
                    )}
                    variant="ghost"
                    size="sm"
                  >
                    {editingSlideIndex === slideIndex ? 'Collapse' : 'Expand'}
                  </Button>
                </div>

                {editingSlideIndex === slideIndex && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Slide Title</label>
                      <Input
                        value={slide.title}
                        onChange={(e) => handleSlideChange(slideIndex, 'title', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Bullet Points</label>
                      <div className="space-y-2 mt-1">
                        {slide.points.map((point, pointIndex) => (
                          <div key={pointIndex} className="flex gap-2">
                            <Input
                              value={point}
                              onChange={(e) => handlePointChange(slideIndex, pointIndex, e.target.value)}
                            />
                            <Button
                              onClick={() => removePoint(slideIndex, pointIndex)}
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => addPoint(slideIndex)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Point
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Speaker Notes</label>
                      <Textarea
                        value={slide.speakerNotes}
                        onChange={(e) => handleSlideChange(slideIndex, 'speakerNotes', e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}