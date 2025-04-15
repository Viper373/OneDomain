"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inter } from "@/app/ui/fonts"

interface SiteSettings {
  siteName: string
  siteTitle: string
  siteDescription: string
  theme: "terminal" | "modern" | "minimal"
  enableAnalytics: boolean
  enableNotifications: boolean
  customCss: string
  customJs: string
  footerText: string
}

export function SettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "域名管理",
    siteTitle: "我的域名收藏",
    siteDescription: "管理和展示我的域名投资组合",
    theme: "terminal",
    enableAnalytics: false,
    enableNotifications: true,
    customCss: "",
    customJs: "",
    footerText: "© 2022-2025 域名管理系统",
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  // 从本地存储加载设置
  useEffect(() => {
    const storedSettings = localStorage.getItem("siteSettings")
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings)
        // 确保不加载管理员密码字段
        const { adminPassword, ...otherSettings } = parsedSettings
        setSettings((prev) => ({ ...prev, ...otherSettings }))
      } catch (error) {
        console.error("加载设置出错:", error)
      }
    }
  }, [])

  // 保存设置到本地存储
  const saveSettings = () => {
    // 获取当前存储的设置，确保不覆盖管理员密码
    const storedSettings = localStorage.getItem("siteSettings")
    let currentSettings = {}

    if (storedSettings) {
      try {
        currentSettings = JSON.parse(storedSettings)
      } catch (error) {
        console.error("解析存储的设置出错:", error)
      }
    }

    // 合并设置，保留管理员密码
    const mergedSettings = { ...currentSettings, ...settings }
    localStorage.setItem("siteSettings", JSON.stringify(mergedSettings))

    // 应用主题设置
    document.documentElement.setAttribute("data-theme", settings.theme)
    document.body.className = `${inter.className} theme-${settings.theme}`

    // 如果有自定义CSS，应用它
    let customStyleElement = document.getElementById("custom-css")
    if (!customStyleElement && settings.customCss) {
      customStyleElement = document.createElement("style")
      customStyleElement.id = "custom-css"
      document.head.appendChild(customStyleElement)
    }

    if (customStyleElement) {
      customStyleElement.textContent = settings.customCss
    }

    // 如果有自定义JS，应用它
    if (settings.customJs) {
      try {
        // 安全地执行自定义JS
        const executeScript = new Function(settings.customJs)
        executeScript()
      } catch (error) {
        console.error("Error executing custom JS:", error)
      }
    }

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // 更新设置字段
  const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="border-gray-700 bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl text-green-400">系统设置</CardTitle>
        <CardDescription className="text-gray-400">配置网站的基本设置和外观</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {saveSuccess && (
          <Alert className="border-green-800 bg-green-950 text-green-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>设置保存成功！主题和自定义代码已应用。</AlertDescription>
          </Alert>
        )}

        <Alert className="border-blue-800 bg-blue-950 text-blue-400">
          <Info className="h-4 w-4" />
          <AlertDescription>管理员密码现在通过环境变量设置，无需在此页面配置。</AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteName" className="text-gray-300">
              网站名称
            </Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => updateSetting("siteName", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteTitle" className="text-gray-300">
              网站标题
            </Label>
            <Input
              id="siteTitle"
              value={settings.siteTitle}
              onChange={(e) => updateSetting("siteTitle", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="siteDescription" className="text-gray-300">
              网站描述
            </Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting("siteDescription", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme" className="text-gray-300">
              主题
            </Label>
            <Select
              value={settings.theme}
              onValueChange={(value: "terminal" | "modern" | "minimal") => updateSetting("theme", value)}
            >
              <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                <SelectValue placeholder="选择主题" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                <SelectItem value="terminal">终端风格</SelectItem>
                <SelectItem value="modern">现代风格</SelectItem>
                <SelectItem value="minimal">极简风格</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-green-400">功能设置</h3>

          <div className="flex items-center justify-between rounded-lg border border-gray-700 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableAnalytics" className="text-gray-300">
                启用分析
              </Label>
              <p className="text-xs text-gray-400">跟踪网站访问和用户行为</p>
            </div>
            <Switch
              id="enableAnalytics"
              checked={settings.enableAnalytics}
              onCheckedChange={(checked) => updateSetting("enableAnalytics", checked)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-700 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableNotifications" className="text-gray-300">
                启用通知
              </Label>
              <p className="text-xs text-gray-400">接收域名到期和重要事件的通知</p>
            </div>
            <Switch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-green-400">高级设置</h3>

          <div className="space-y-2">
            <Label htmlFor="customCss" className="text-gray-300">
              自定义CSS
            </Label>
            <Textarea
              id="customCss"
              value={settings.customCss}
              onChange={(e) => updateSetting("customCss", e.target.value)}
              className="min-h-[100px] border-gray-700 bg-gray-900 text-gray-100 font-mono"
              placeholder=".custom-class { color: #34d399; }"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customJs" className="text-gray-300">
              自定义JavaScript
            </Label>
            <Textarea
              id="customJs"
              value={settings.customJs}
              onChange={(e) => updateSetting("customJs", e.target.value)}
              className="min-h-[100px] border-gray-700 bg-gray-900 text-gray-100 font-mono"
              placeholder="document.addEventListener('DOMContentLoaded', function() { /* your code */ });"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerText" className="text-gray-300">
              页脚文本
            </Label>
            <Input
              id="footerText"
              value={settings.footerText}
              onChange={(e) => updateSetting("footerText", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={saveSettings} className="ml-auto bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </CardFooter>
    </Card>
  )
}
