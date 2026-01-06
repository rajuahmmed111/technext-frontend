"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap } from "lucide-react"
import { UrlForm } from "@/components/url-form"
import { RecentLinks } from "@/components/recent-links"

interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
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

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Load user's links
      const userLinks = localStorage.getItem(`links_${parsedUser.id}`)
      if (userLinks) {
        setShortLinks(JSON.parse(userLinks))
      }
    }
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Button 
                  size="sm" 
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Dashboard
                </Button>
              </div>
              <Button 
                variant="outline"
                size="sm" 
                onClick={() => {
                  localStorage.removeItem('user')
                  setUser(null)
                  setShortLinks([])
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              Sign In
            </Button>
          )}
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
          <Card className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 p-6 md:p-8 shadow-sm">
            <UrlForm onLinkCreated={handleNewLink} />
          </Card>
        </section>

        {/* Stats Section */}
        {shortLinks.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 shadow-sm">
                <div className="text-muted-foreground text-sm font-medium mb-2">Total Links</div>
                <div className="text-3xl font-bold text-primary">{shortLinks.length}</div>
              </Card>
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 shadow-sm">
                <div className="text-muted-foreground text-sm font-medium mb-2">Total Clicks</div>
                <div className="text-3xl font-bold text-primary">
                  {shortLinks.reduce((sum, link) => sum + link.clicks, 0)}
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 shadow-sm">
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
