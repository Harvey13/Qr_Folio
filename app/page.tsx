"use client"

import { useState, useRef, useEffect, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCodeDisplay } from "@/components/qr-code-display"

interface Link {
  url: string
  title: string
  icon?: string
}

export default function LinkBookPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch("/links.json")
        const data: Link[] = await response.json()
        setLinks(data)
      } catch (error) {
        console.error("Failed to fetch links:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLinks()
  }, [])

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentPage < links.length - 1) {
      setCurrentPage(currentPage + 1)
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < links.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des liens...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Portfolio Links</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{links.length > 0 ? currentPage + 1 : 0}</span>
            <span>/</span>
            <span>{links.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-6 relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {links.length > 0 ? (
          <>
            <div className="w-full max-w-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${currentPage * -100}%)`,
                }}
              >
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 flex flex-col items-center gap-8 text-center"
                  >
                    {/* Icon and Title */}
                    <div className="space-y-4">
                      {link.icon && (
                        <div className="flex justify-center">
                          <img 
                            src={link.icon} 
                            alt={`${link.title} icon`} 
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">{link.title}</h2>
                      </div>
                    </div>

                    {/* QR Code */}
                    <QRCodeDisplay url={link.url} />

                    {/* URL Display */}
                    <div className="w-full max-w-md">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        <span className="truncate max-w-xs">{link.url}</span>
                        <ExternalLink className="size-4 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Desktop */}
            <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={currentPage === 0}
                className="pointer-events-auto size-12 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="size-6" />
                <span className="sr-only">Page précédente</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={currentPage === links.length - 1}
                className="pointer-events-auto size-12 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <ChevronRight className="size-6" />
                <span className="sr-only">Page suivante</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Aucun lien à afficher</h2>
            <p className="text-muted-foreground">Veuillez ajouter des liens dans le fichier `public/links.json`.</p>
          </div>
        )}
      </main>

      {links.length > 0 && (
        <>
          {/* Pagination Dots */}
          <div className="pb-8 px-6">
            <div className="max-w-4xl mx-auto flex justify-center gap-2">
              {links.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentPage ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Aller à la page ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Swipe Hint - Mobile */}
          <div className="md:hidden pb-4 text-center text-sm text-muted-foreground">
            <p>Swipez pour naviguer</p>
          </div>
        </>
      )}
    </div>
  )
}
