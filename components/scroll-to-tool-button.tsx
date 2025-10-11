'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface ScrollToToolButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showArrow?: boolean
}

export function ScrollToToolButton({ 
  children, 
  variant = 'default', 
  size = 'lg',
  className = '',
  showArrow = false
}: ScrollToToolButtonProps) {
  const scrollToTool = () => {
    const toolElement = document.getElementById('screenshot-tool')
    if (toolElement) {
      toolElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Button 
      size={size} 
      variant={variant}
      onClick={scrollToTool} 
      className={`gap-2 ${className}`}
    >
      <span>{children}</span>
      {showArrow && <ArrowRight className="w-5 h-5" />}
    </Button>
  )
}
