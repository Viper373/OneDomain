"use client"

import { useEffect, useState } from "react"
import { Github } from "lucide-react"

interface ContactInfo {
  email: string
  wechat: string
}

interface SocialLink {
  github: string
  blog: string
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "contact@example.com",
    wechat: "DomainManager",
  })
  const [socialLinks, setSocialLinks] = useState<SocialLink>({
    github: "https://github.com/username",
    blog: "/blog",
  })
  const [footerText, setFooterText] = useState(`© 2022-${currentYear} 域名管理系统`)

  // 从本地存储加载数据
  useEffect(() => {
    const storedContactInfo = localStorage.getItem("contactInfo")
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo))
    }

    const storedSocialLinks = localStorage.getItem("simpleSocialLinks")
    if (storedSocialLinks) {
      setSocialLinks(JSON.parse(storedSocialLinks))
    }

    const storedSettings = localStorage.getItem("siteSettings")
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      if (settings.footerText) {
        setFooterText(settings.footerText)
      }
    }
  }, [])

  return (
    <footer className="w-full max-w-5xl mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-400 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-green-400 font-semibold mb-2">// 联系方式</h3>
          <p>
            <span className="text-gray-500">邮箱:</span>{" "}
            <a href={`mailto:${contactInfo.email}`} className="text-blue-400 hover:underline">
              {contactInfo.email}
            </a>
          </p>
          <p>
            <span className="text-gray-500">微信:</span> <span className="text-white">{contactInfo.wechat}</span>
          </p>
        </div>

        <div>
          <h3 className="text-green-400 font-semibold mb-2">// 链接</h3>
          <p>
            <span className="text-gray-500">博客:</span>{" "}
            <a href={socialLinks.blog} className="text-blue-400 hover:underline">
              {socialLinks.blog}
            </a>
          </p>
          <p>
            <span className="text-gray-500">GitHub:</span>{" "}
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center"
            >
              <Github className="h-3 w-3 mr-1 inline-block" />
              <span className="truncate">{socialLinks.github.replace("https://github.com/", "@")}</span>
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-green-400 font-semibold mb-2">// 信息</h3>
          <p>
            <span className="text-gray-500">版权:</span> <span className="text-white">{footerText}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
