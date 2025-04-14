"use client"

import { useState, useEffect } from "react"

interface TerminalProps {
  showPrompt: boolean
}

export function Terminal({ showPrompt }: TerminalProps) {
  const [text, setText] = useState("")
  const fullText = "domain-manager --load-profile --show-domains"

  useEffect(() => {
    if (showPrompt) {
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setText(fullText.substring(0, i + 1))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showPrompt])

  return (
    <div>
      <div className="flex items-center">
        <span className="text-green-400">user@server</span>
        <span className="text-white">:</span>
        <span className="text-blue-400">~/domains</span>
        <span className="text-white">$ </span>
        <span>{text}</span>
        {text.length < fullText.length && showPrompt && <span className="animate-pulse ml-0.5">▌</span>}
      </div>

      {text === fullText && (
        <div className="mt-2 text-gray-400">
          <p>Loading domain manager...</p>
          <p>Fetching profile information...</p>
          <p>Retrieving domain status...</p>
        </div>
      )}
    </div>
  )
}
