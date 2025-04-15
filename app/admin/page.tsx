"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Settings, Database, User, LinkIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DomainForm } from "@/components/admin/domain-form"
import { ContactForm } from "@/components/admin/contact-form"
import { SocialLinksForm } from "@/components/admin/social-links-form"
import { SettingsForm } from "@/components/admin/settings-form"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    // 检查本地存储和API中的认证状态
    const checkAuth = async () => {
      try {
        const authStatus = localStorage.getItem("adminAuthenticated")
        if (authStatus === "true") {
          // 验证cookie是否也存在（通过API）
          const response = await fetch("/api/auth")
          const data = await response.json()
          if (data.success) {
            setIsAuthenticated(true)
          } else {
            // 如果API验证失败，清除本地存储
            localStorage.removeItem("adminAuthenticated")
          }
        }
      } catch (error) {
        console.error("验证登录状态出错:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      setError("请输入密码")
      return
    }

    setIsLoggingIn(true)
    setError("")

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        // 设置认证状态
        localStorage.setItem("adminAuthenticated", "true")
        setIsAuthenticated(true)
        setError("")
      } else {
        setError(data.message || "认证失败")
      }
    } catch (error) {
      console.error("登录出错:", error)
      setError("登录过程中发生错误")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      // 清除认证状态
      localStorage.removeItem("adminAuthenticated")

      // 清除cookie
      document.cookie = "adminAuthenticated=; path=/; max-age=0"

      setIsAuthenticated(false)

      // 使用replace而不是push，防止用户通过浏览器返回按钮回到管理页面
      router.replace("/")
    } catch (error) {
      console.error("登出错误:", error)
    }
  }

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-green-400"></div>
          <p className="mt-4 font-mono text-green-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md border-gray-700 bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle className="text-green-400">域名管理系统</CardTitle>
            <CardDescription className="text-gray-400">请输入管理员密码</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 border-red-800 bg-red-950 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>认证错误</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-300">
                    密码
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-700 bg-gray-900 text-gray-100"
                    placeholder="输入管理员密码"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "登录中..." : "登录"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 font-mono text-gray-100">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto p-4">
        <Tabs defaultValue="domains" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="domains" className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400">
              <Database className="mr-2 h-4 w-4" />
              域名管理
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400">
              <User className="mr-2 h-4 w-4" />
              联系方式
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400">
              <LinkIcon className="mr-2 h-4 w-4" />
              社交链接
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
            >
              <Settings className="mr-2 h-4 w-4" />
              系统设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="mt-0">
            <DomainForm />
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <ContactForm />
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <SocialLinksForm />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
