"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface UrlFormProps {
  onLinkCreated: (link: {
    id: string
    originalUrl: string
    shortCode: string
    clicks: number
    createdAt: Date
  }) => void
}

export function UrlForm({ onLinkCreated }: UrlFormProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url) {
      setError("Please enter a URL")
      return
    }

    try {
      new URL(url)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Generate a random short code
      const shortCode = Math.random().toString(36).substring(2, 8)

      onLinkCreated({
        id: Date.now().toString(),
        originalUrl: url,
        shortCode,
        clicks: Math.floor(Math.random() * 50),
        createdAt: new Date(),
      })

      setUrl("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to create short link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium text-foreground">
          Original URL
        </label>
        <div className="flex gap-3">
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Shorten"
            )}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
