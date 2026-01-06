"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"

interface Link {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: Date
  lastClicked?: Date
}

export default function RedirectPage({ params }: { params: { shortCode: string } }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [url, setUrl] = useState("")
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const findAndRedirect = async () => {
      try {
        // Get all users' links from localStorage
        const users = Object.keys(localStorage).filter(key => key.startsWith('links_'))
        let foundUrl = ""
        let linkId = ""
        let userId = ""

        for (const userKey of users) {
          const links = JSON.parse(localStorage.getItem(userKey) || "[]")
          const link = links.find((l: Link) => l.shortCode === params.shortCode)
          
          if (link) {
            foundUrl = link.originalUrl
            linkId = link.id
            userId = userKey.replace('links_', '')
            break
          }
        }

        if (!foundUrl) {
          setError("Short link not found")
          return
        }

        setUrl(foundUrl)

        // Increment click count
        const userLinks = JSON.parse(localStorage.getItem(`links_${userId}`) || "[]")
        const updatedLinks = userLinks.map((link: Link) => 
          link.id === linkId 
            ? { ...link, clicks: link.clicks + 1, lastClicked: new Date() }
            : link
        )
        localStorage.setItem(`links_${userId}`, JSON.stringify(updatedLinks))

        // Countdown and redirect
        let count = 3
        const timer = setInterval(() => {
          count -= 1
          setCountdown(count)
          
          if (count === 0) {
            clearInterval(timer)
            window.location.href = foundUrl
          }
        }, 1000)

        return () => clearInterval(timer)
      } catch {
        setError("An error occurred while redirecting")
      }
    }

    findAndRedirect()
  }, [params.shortCode])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
            <p className="text-gray-600 mb-6">The short link you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to LinkSnap
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
          <p className="text-gray-600 mb-6">You will be redirected to:</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-mono break-all">{url}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-lg font-medium text-gray-900">{countdown}</span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">Redirecting automatically...</p>
          
          <button
            onClick={() => window.location.href = url}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Now
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← Back to LinkSnap
          </button>
        </div>
      </div>
    </div>
  )
}
