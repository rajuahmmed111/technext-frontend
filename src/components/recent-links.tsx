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
        <Card key={link.id} className="bg-card border border-border p-4 hover:border-primary/50 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <code className="bg-input px-3 py-1 rounded text-sm text-primary font-mono font-medium">
                  s/{link.shortCode}
                </code>
                <span className="text-xs text-muted-foreground">{formatDate(link.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{truncateUrl(link.originalUrl)}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <div className="flex items-center gap-2 bg-input/50 px-3 py-2 rounded">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{link.clicks}</span>
              </div>

              <Button variant="outline" size="sm" onClick={() => onCopy(link.shortCode)} className="gap-2">
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
