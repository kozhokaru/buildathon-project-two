"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Maximize2, Download, FileText, Loader2 } from "lucide-react"

export interface Slide {
  title: string
  points: string[]
  speakerNotes: string
}

export interface Presentation {
  title: string
  slides: Slide[]
}

interface SlideViewerProps {
  presentation: Presentation
  onExport?: (format: 'html' | 'pdf') => void
}

export function SlideViewer({ presentation, onExport }: SlideViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const generateRevealHTML = () => {
    const slidesHTML = presentation.slides.map(slide => `
      <section>
        <h2>${slide.title}</h2>
        <ul>
          ${slide.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
        <aside class="notes">
          ${slide.speakerNotes}
        </aside>
      </section>
    `).join('')

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presentation.title}</title>
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reset.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/white.css">
  
  <style>
    .reveal h1, .reveal h2 {
      color: #2563eb;
      text-transform: none;
      line-height: 1.2;
    }
    .reveal h1 {
      font-size: 2.5em;
    }
    .reveal h2 {
      font-size: 1.8em;
      margin-bottom: 0.8em;
    }
    .reveal ul {
      display: block;
      margin-left: 1em;
    }
    .reveal li {
      font-size: 0.9em;
      line-height: 1.4;
      margin-bottom: 0.5em;
      text-align: left;
    }
    .reveal .slides section {
      text-align: left;
    }
    .reveal .slides section h1,
    .reveal .slides section h2 {
      text-align: center;
    }
    .reveal .progress {
      color: #2563eb;
    }
    .reveal .controls {
      color: #2563eb;
    }
    @media print {
      .reveal .slides section {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section>
        <h1>${presentation.title}</h1>
        <p style="text-align: center; margin-top: 2em; color: #666;">
          Generated with VoiceSlides
        </p>
      </section>
      ${slidesHTML}
      <section>
        <h2>Thank You</h2>
        <p style="text-align: center; margin-top: 2em;">Questions?</p>
      </section>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/notes/notes.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/markdown/markdown.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/highlight/highlight.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      controls: true,
      progress: true,
      center: false,
      transition: 'slide',
      plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
    });
  </script>
</body>
</html>
    `
  }

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(generateRevealHTML())
        doc.close()
        setIsLoading(false)
      }
    }
  }, [presentation])

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (!isFullscreen) {
        iframeRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleExportHTML = () => {
    const html = generateRevealHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${presentation.title.replace(/\s+/g, '-').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (onExport) {
      onExport('html')
    }
  }

  const handleExportPDF = () => {
    // Generate the HTML content with print-specific modifications
    const htmlContent = generateRevealHTML()
    
    // Modify HTML for better printing
    const printHTML = htmlContent.replace(
      '</head>',
      `<style>
        @media print {
          .reveal .slides section {
            page-break-after: always !important;
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: 700px !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 50px !important;
          }
          .reveal .slides {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
          }
          .reveal {
            overflow: visible !important;
          }
          .reveal .controls,
          .reveal .progress,
          .reveal .slide-number,
          .reveal .speaker-notes {
            display: none !important;
          }
        }
      </style>
      <script>
        window.addEventListener('load', function() {
          // Initialize Reveal first
          if (typeof Reveal !== 'undefined') {
            Reveal.initialize({
              hash: false,
              controls: false,
              progress: false,
              center: false,
              transition: 'none',
              plugins: []
            }).then(() => {
              // Trigger print after Reveal is ready
              setTimeout(() => {
                window.print();
                // Close window after print
                window.addEventListener('afterprint', function() {
                  window.close();
                });
              }, 1000);
            });
          } else {
            // Fallback if Reveal doesn't load
            setTimeout(() => {
              window.print();
              window.addEventListener('afterprint', function() {
                window.close();
              });
            }, 2000);
          }
        });
      </script>
      </head>`
    )
    
    // Open in a new window for printing
    const printWindow = window.open('', '_blank', 'width=1024,height=768')
    
    if (printWindow) {
      // Write the modified HTML content to the new window
      printWindow.document.write(printHTML)
      printWindow.document.close()
      
      if (onExport) {
        onExport('pdf')
      }
    } else {
      // Fallback if popup is blocked
      alert('Please allow popups for this site to export PDF')
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Presentation Preview</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleFullscreen}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
            <Button
              onClick={handleExportHTML}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download HTML
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="relative w-full" style={{ height: '500px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full border rounded-lg"
            title="Presentation Preview"
            sandbox="allow-scripts allow-same-origin allow-modals"
          />
        </div>

        <div className="text-sm text-muted-foreground text-center">
          Use arrow keys to navigate between slides. Press 'S' for speaker notes.
        </div>
      </div>
    </Card>
  )
}