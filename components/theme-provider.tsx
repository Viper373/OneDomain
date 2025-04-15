"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "terminal" | "modern" | "minimal"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "terminal" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    // 从本地存储加载主题设置
    const storedSettings = localStorage.getItem("siteSettings")
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings)
        if (settings.theme) {
          setTheme(settings.theme)
        }
      } catch (e) {
        console.error("Error loading theme settings:", e)
      }
    }
  }, [])

  useEffect(() => {
    // 应用主题
    document.documentElement.setAttribute("data-theme", theme)

    // 根据主题应用不同的样式
    if (theme === "terminal") {
      document.documentElement.classList.add("theme-terminal")
      document.documentElement.classList.remove("theme-modern", "theme-minimal")
    } else if (theme === "modern") {
      document.documentElement.classList.add("theme-modern")
      document.documentElement.classList.remove("theme-terminal", "theme-minimal")
    } else if (theme === "minimal") {
      document.documentElement.classList.add("theme-minimal")
      document.documentElement.classList.remove("theme-terminal", "theme-modern")
    }
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
