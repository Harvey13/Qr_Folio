"use client"

import { useEffect, useRef, useState } from "react"
import QRCodeStyling from "qr-code-styling"
import { Card } from "@/components/ui/card"

interface QRCodeDisplayProps {
  url: string
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const qrCode = useRef<QRCodeStyling | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !ref.current) return

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: 300,
        height: 300,
        data: url,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 8,
        },
        dotsOptions: {
          type: "rounded",
          color: "#000000",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#000000",
        },
        cornersDotOptions: {
          type: "dot",
          color: "#000000",
        },
      })

      ref.current.innerHTML = ""
      qrCode.current.append(ref.current)
    } else {
      qrCode.current.update({
        data: url,
      })
    }
  }, [url, isMounted])

  if (!isMounted) {
    return (
      <Card className="p-8 bg-card">
        <div className="size-[300px] flex items-center justify-center">
          <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-card">
      <div ref={ref} className="flex items-center justify-center" />
    </Card>
  )
}
