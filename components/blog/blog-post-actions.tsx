"use client"

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BlogPostActionsProps {
  title: string
  description: string
  shareLabel: string
}

export function BlogPostActions({ title, description, shareLabel }: BlogPostActionsProps) {
  const handleShare = async () => {
    const shareData = {
      title,
      text: description,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        throw new Error('Web Share API not supported')
      }
    } catch (err) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link Copied!", {
        description: "The article URL has been copied to your clipboard.",
      })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      {shareLabel}
    </Button>
  )
}
