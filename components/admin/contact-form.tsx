"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContactInfo {
  email: string
  wechat: string
}

export function ContactForm() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "contact@example.com",
    wechat: "DomainManager",
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  // 从本地存储加载联系信息
  useEffect(() => {
    const storedContactInfo = localStorage.getItem("contactInfo")
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo))
    }
  }, [])

  // 保存联系信息到本地存储
  const saveContactInfo = () => {
    localStorage.setItem("contactInfo", JSON.stringify(contactInfo))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // 更新联系信息字段
  const updateContactField = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="border-gray-700 bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl text-green-400">联系方式管理</CardTitle>
        <CardDescription className="text-gray-400">更新您的联系信息</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {saveSuccess && (
          <Alert className="border-green-800 bg-green-950 text-green-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>联系信息保存成功！</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              电子邮箱
            </Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => updateContactField("email", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wechat" className="text-gray-300">
              微信
            </Label>
            <Input
              id="wechat"
              value={contactInfo.wechat}
              onChange={(e) => updateContactField("wechat", e.target.value)}
              className="border-gray-700 bg-gray-900 text-gray-100"
              placeholder="WeChat ID"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={saveContactInfo} className="ml-auto bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          保存联系方式
        </Button>
      </CardFooter>
    </Card>
  )
}
