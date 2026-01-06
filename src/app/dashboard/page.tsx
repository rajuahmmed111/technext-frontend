"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Copy, 
  Check, 
  BarChart3, 
  ExternalLink, 
  Trash2, 
  LogOut, 
  Zap,
  TrendingUp,
  Users,
  Link2
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
}

interface Link {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: Date
  lastClicked?: Date
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [newUrl, setNewUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Free plan limit
  const FREE_PLAN_LIMIT = 10

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Load user's links from localStorage
    const userLinks = localStorage.getItem(`links_${parsedUser.id}`)
    if (userLinks) {
      setLinks(JSON.parse(userLinks))
    }
  }, [router])

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newUrl) {
      setError("Please enter a URL")
      return
    }

    // Validate URL
    try {
      new URL(newUrl)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    // Check free plan limit
    if (user?.plan === 'free' && links.length >= FREE_PLAN_LIMIT) {
      setError(`Free plan limit reached. Upgrade to Pro for unlimited links (${links.length}/${FREE_PLAN_LIMIT})`)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generate short code
      const shortCode = Math.random().toString(36).substring(2, 8)
      
      const newLink: Link = {
        id: Date.now().toString(),
        originalUrl: newUrl,
        shortCode,
        clicks: 0,
        createdAt: new Date()
      }

      const updatedLinks = [newLink, ...links]
      setLinks(updatedLinks)
      
      // Save to localStorage
      if (user) {
        localStorage.setItem(`links_${user.id}`, JSON.stringify(updatedLinks))
      }
      
      setNewUrl("")
    } catch {
      setError("Failed to create short link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`
    navigator.clipboard.writeText(shortUrl)
    setCopied(shortCode)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = (linkId: string) => {
    const updatedLinks = links.filter(link => link.id !== linkId)
    setLinks(updatedLinks)
    
    if (user) {
      localStorage.setItem(`links_${user.id}`, JSON.stringify(updatedLinks))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateUrl = (url: string) => {
    const maxLength = 50
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const avgClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LinkSnap</h1>
              <p className="text-xs text-gray-600">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={user.plan === 'free' ? 'secondary' : 'default'}>
                {user.plan === 'free' ? 'Free Plan' : 'Pro Plan'}
              </Badge>
              {user.plan === 'free' && (
                <span className="text-sm text-gray-600">
                  {links.length}/{FREE_PLAN_LIMIT} links
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{links.length}</div>
                <div className="text-sm text-gray-600">Total Links</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 border border-green-100 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalClicks}</div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgClicks}</div>
                <div className="text-sm text-gray-600">Avg Clicks</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{user.plan}</div>
                <div className="text-sm text-gray-600">Current Plan</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Create New Link */}
        <Card className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Short Link</h2>
          <form onSubmit={handleCreateLink} className="flex gap-3">
            <Input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8"
            >
              {isLoading ? "Creating..." : "Shorten"}
            </Button>
          </form>
          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
        </Card>

        {/* Upgrade Banner */}
        {user.plan === 'free' && links.length >= FREE_PLAN_LIMIT * 0.8 && (
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Upgrade to Pro Plan</h3>
                <p className="text-white/90">Get unlimited links, advanced analytics, and custom domains.</p>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}

        {/* Links Table */}
        {links.length > 0 && (
          <Card className="bg-white border border-blue-100 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Your Links</h2>
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 rounded text-sm text-blue-700 font-mono font-medium border border-blue-300">
                          s/{link.shortCode}
                        </code>
                        <span className="text-xs text-gray-500">{formatDate(link.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{truncateUrl(link.originalUrl)}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">{link.clicks}</span>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleCopy(link.shortCode)}
                        className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {copied === link.shortCode ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.originalUrl, '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {links.length === 0 && (
          <Card className="bg-white border border-blue-100 p-12 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Link2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-600 mb-4">Create your first short link to get started!</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
