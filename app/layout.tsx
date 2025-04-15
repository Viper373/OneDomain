import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "域名管理系统",
  description: "管理和展示您的域名投资组合",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 从本地存储加载主题设置
                const storedSettings = localStorage.getItem("siteSettings");
                if (storedSettings) {
                  try {
                    const settings = JSON.parse(storedSettings);
                    if (settings.theme) {
                      document.documentElement.setAttribute('data-theme', settings.theme);
                      document.body.className = 'theme-' + settings.theme;
                    }
                    
                    // 应用自定义CSS
                    if (settings.customCss) {
                      let style = document.getElementById('custom-css');
                      if (!style) {
                        style = document.createElement('style');
                        style.id = 'custom-css';
                        document.head.appendChild(style);
                      }
                      style.textContent = settings.customCss;
                    }
                  } catch (e) {
                    console.error('Error loading theme settings:', e);
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}


import './globals.css'