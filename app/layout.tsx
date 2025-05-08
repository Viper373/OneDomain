import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Viper3's 域名",
  description: "一个简单的命令行式域名停靠页"
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
        <link rel="icon" type="image/png" href="/OneDomain.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}


import './globals.css'