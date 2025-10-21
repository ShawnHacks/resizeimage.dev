import type { MDXComponents } from 'mdx/types'
import { Cookie, Shield, BarChart3, Settings, Target, Globe, Calendar, AlertTriangle, Info, AlertCircle, CheckCircle, FileText, Lock } from 'lucide-react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-heading font-bold mb-6 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mb-4 text-foreground mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mb-3 mt-6">
        {children}
      </h4>
    ),
    
    // Paragraphs
    p: ({ children }) => (
      <p className="text-foreground leading-relaxed p+p:mt-4">
        {children}
      </p>
    ),
    
    // Lists - let prose handle the styling
    ul: ({ children }) => <ul>{children}</ul>,
    ol: ({ children }) => <ol>{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    
    // Links
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-primary dark:text-primary/80 hover:text-primary/80 dark:hover:text-primary/80 underline underline-offset-4 transition-colors"
      >
        {children}
      </a>
    ),
    
    // Custom Components
    Header: ({ children, lastUpdated = 'January 2025' }: { 
      children: React.ReactNode
      lastUpdated?: string
    }) => {
      return (
        <div className="text-center mb-12">
          {children}
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      )
    },
    
    TableOfContents: ({ children }: { children: React.ReactNode }) => (
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Table of Contents
        </h2>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {children}
        </div>
      </div>
    ),
    
    Section: ({ id, children }: { id?: string; children: React.ReactNode }) => (
      <section id={id} className="mb-8 scroll-mt-20">
        {children}
      </section>
    ),
    
    CookieTypeCard: ({ 
      type, 
      title, 
      description, 
      examples, 
      icon, 
      color, 
      bgColor 
    }: {
      type: string
      title: string
      description: string
      examples: string
      icon: React.ReactNode
      color: string
      bgColor: string
    }) => (
      <div className="border rounded-lg p-6 mb-6 bg-card">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <div className={color}>
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${color}`}>
                {type}
              </span>
            </div>
            <p className="text-muted-foreground mb-3">
              {description}
            </p>
            <div className="text-sm">
              <span className="font-medium">Examples: </span>
              <span className="text-muted-foreground">{examples}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    
    InfoBox: ({ 
      type, 
      title, 
      children 
    }: { 
      type: 'info' | 'warning' | 'success'
      title: string
      children: React.ReactNode 
    }) => {
      const styles = {
        info: {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-800',
          icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
          titleColor: 'text-blue-900 dark:text-blue-100'
        },
        warning: {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
          titleColor: 'text-amber-900 dark:text-amber-100'
        },
        success: {
          bg: 'bg-green-50 dark:bg-green-950/30',
          border: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
          titleColor: 'text-green-900 dark:text-green-100'
        }
      }
      
      const style = styles[type]
      
      return (
        <div className={`rounded-lg border p-4 my-6 ${style.bg} ${style.border}`}>
          <div className="flex items-start space-x-3">
            {style.icon}
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${style.titleColor}`}>
                {title}
              </h4>
              <div className="text-sm text-muted-foreground">
                {children}
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    ...components,
  }
}
