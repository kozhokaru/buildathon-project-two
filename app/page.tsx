import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthButton } from "@/components/auth-button"
import { ArrowRight, Mic, Wand2, Download, Presentation } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Presentation className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                VoiceSlides
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#features"
              >
                Features
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#how-it-works"
              >
                How It Works
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
            </div>
            <nav className="flex items-center">
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
        <div className="container relative">
          <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                Voice-to-Slide Generator
              </h1>
              <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                Transform your ideas into professional presentations in seconds. 
                Just speak or upload audio, and let AI create stunning slides instantly.
              </p>
              <div className="flex gap-4 mt-8">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Start Creating <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  <span>Voice Recording</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <span>Instant Export</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            Powerful Features
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            Everything you need to create professional presentations from voice
          </p>
        </div>
        <div className="mx-auto grid gap-4 md:grid-cols-3 mt-12">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <CardHeader className="relative">
              <Mic className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Record or Upload</CardTitle>
              <CardDescription>
                Record directly in your browser or upload existing audio files. 
                Supports MP3, WAV, and WebM formats up to 25MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browser recording</li>
                <li>• File upload support</li>
                <li>• Multiple formats</li>
                <li>• Visual feedback</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <CardHeader className="relative">
              <Wand2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Advanced AI transcribes your audio and generates structured, 
                professional slides with intelligent content organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Whisper transcription</li>
                <li>• Claude AI generation</li>
                <li>• Smart structuring</li>
                <li>• Speaker notes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <CardHeader className="relative">
              <Download className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Instant Export</CardTitle>
              <CardDescription>
                Download your presentation as HTML or PDF. 
                Present directly in browser or share with anyone.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HTML download</li>
                <li>• PDF export</li>
                <li>• Full-screen mode</li>
                <li>• Quick editing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-20 border-t">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            How It Works
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            Three simple steps to transform your voice into professional slides
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Speak or Upload</h3>
              <p className="text-sm text-muted-foreground">
                Record your ideas directly or upload an existing audio file
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">AI Processing</h3>
              <p className="text-sm text-muted-foreground">
                Our AI transcribes and structures your content into slides
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Download & Present</h3>
              <p className="text-sm text-muted-foreground">
                Export as HTML or PDF and present your professional slides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center rounded-lg border bg-card p-8">
          <h2 className="text-2xl font-bold">Ready to Create Your Presentation?</h2>
          <p className="text-muted-foreground">
            Transform your voice into professional slides in seconds. No design skills required.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/dashboard">
              <Button size="lg">Start Creating</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Presentation className="h-5 w-5" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              VoiceSlides - Transform your voice into presentations instantly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}