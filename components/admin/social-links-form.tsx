"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SocialLink {
  github: string
  blog: string
}

export function SocialLinksForm() {
  const [socialLinks, setSocialLinks] = useState<SocialLink>({
    github: "https://github.com/username",
    blog: "/blog",
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  // 从本地存储加载社交链接
  useEffect(() => {
    const storedLinks = localStorage.getItem("simpleSocialLinks")
    if (storedLinks) {
      setSocialLinks(JSON.parse(storedLinks))
    }
  }, [])

  // 保存社交链接到本地存储
  const saveSocialLinks = () => {
    localStorage.setItem("simpleSocialLinks", JSON.stringify(socialLinks))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // 更新社交链接字段
  const updateLinkField = (field: keyof SocialLink, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="border-gray-700 bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl text-green-400">社交链接管理</CardTitle>
        <CardDescription className="text-gray-400">管理您的社交媒体和网站链接</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {saveSuccess && (
          <Alert className="border-green-800 bg-green-950 text-green-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>社交链接保存成功！</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="github" className="text-gray-300">
              GitHub 链接
            </Label>
            <Input
              id="github"
              value={socialLinks.github}
              onChange={(e) => updateLinkField("github", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog" className="text-gray-300">
              博客链接
            </Label>
            <Input
              id="blog"
              value={socialLinks.blog}
              onChange={(e) => updateLinkField("blog", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
              placeholder="/blog 或 https://yourblog.com"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={saveSocialLinks} className="ml-auto bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          保存链接
        </Button>
      </CardFooter>
    </Card>
  )
}
