"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, Trash2, BarChart3 } from "lucide-react"

interface Link {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: Date
}

interface RecentLinksProps {
  links: Link[]
  onCopy: (shortCode: string) => void
  copied: string | null
}

export function RecentLinks({ links, onCopy, copied }: RecentLinksProps) {
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

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Card key={link.id} className="bg-gradient-to-br from-white to-blue-50/20 border border-blue-100 p-4 hover:border-blue-300 transition-all duration-200 hover:shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <code className="bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 rounded text-sm text-blue-700 font-mono font-medium border border-blue-300">
                  s/{link.shortCode}
                </code>
                <span className="text-xs text-muted-foreground">{formatDate(link.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{truncateUrl(link.originalUrl)}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded border border-blue-200">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{link.clicks}</span>
              </div>

              <Button size="sm" onClick={() => onCopy(link.shortCode)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
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
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
