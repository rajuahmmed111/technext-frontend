"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap } from "lucide-react"
import { UrlForm } from "@/components/url-form"
import { RecentLinks } from "@/components/recent-links"

export default function Home() {
  const [copied, setCopied] = useState<string | null>(null)
  const [shortLinks, setShortLinks] = useState<
    Array<{
      id: string
      originalUrl: string
      shortCode: string
      clicks: number
      createdAt: Date
    }>
  >([])

  const handleCopyClick = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`
    navigator.clipboard.writeText(shortUrl)
    setCopied(shortCode)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleNewLink = (link: (typeof shortLinks)[0]) => {
    setShortLinks([link, ...shortLinks])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LinkSnap</h1>
              <p className="text-xs text-muted-foreground">Smart URL shortening</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Shorten your URLs instantly</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Create memorable short links, track clicks, and manage your URLs all in one place. No sign-up required.
            </p>
          </div>

          {/* URL Input Card */}
          <Card className="bg-card border border-border p-6 md:p-8">
            <UrlForm onLinkCreated={handleNewLink} />
          </Card>
        </section>

        {/* Stats Section */}
        {shortLinks.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border border-border p-6">
                <div className="text-muted-foreground text-sm font-medium mb-2">Total Links</div>
                <div className="text-3xl font-bold text-primary">{shortLinks.length}</div>
              </Card>
              <Card className="bg-card border border-border p-6">
                <div className="text-muted-foreground text-sm font-medium mb-2">Total Clicks</div>
                <div className="text-3xl font-bold text-primary">
                  {shortLinks.reduce((sum, link) => sum + link.clicks, 0)}
                </div>
              </Card>
              <Card className="bg-card border border-border p-6">
                <div className="text-muted-foreground text-sm font-medium mb-2">Avg Clicks</div>
                <div className="text-3xl font-bold text-primary">
                  {Math.round(shortLinks.reduce((sum, link) => sum + link.clicks, 0) / shortLinks.length)}
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Recent Links */}
        {shortLinks.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6">Your Links</h3>
            <RecentLinks links={shortLinks} onCopy={handleCopyClick} copied={copied} />
          </section>
        )}
      </main>
    </div>
  )
}
