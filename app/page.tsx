"use client"

import { useState, useEffect } from "react"
import { DomainTable } from "@/components/domain-table"
import { Footer } from "@/components/footer"
import { CommandExamples } from "@/components/command-examples"
import { CommandInput } from "@/components/command-input"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, LogIn } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const router = useRouter()
  const [command, setCommand] = useState("domain-list --all")
  const [filter, setFilter] = useState({ type: "all" })
  const [commandHistory, setCommandHistory] = useState<string[]>(["domain-list --all"])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = localStorage.getItem("adminAuthenticated")
        if (authStatus === "true") {
          // 验证cookie是否也存在（通过API）
          const response = await fetch("/api/auth")
          const data = await response.json()
          if (data.success) {
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("验证登录状态出错:", error)
      }
    }

    checkAuthStatus()
  }, [])

  // 解析命令并设置筛选条件
  const parseCommand = (cmd: string) => {
    if (cmd.startsWith("domain-list")) {
      if (cmd.includes("--all")) {
        setFilter({ type: "all" })
      } else if (cmd.includes("--active")) {
        setFilter({ type: "status", value: "活跃" })
      } else if (cmd.includes("--expiring")) {
        setFilter({ type: "status", value: "即将到期" })
      } else if (cmd.includes("--parked")) {
        setFilter({ type: "status", value: "停放" })
      } else if (cmd.includes("--provider")) {
        const providerMatch = cmd.match(/--provider=(\w+)/)
        if (providerMatch && providerMatch[1]) {
          setFilter({ type: "provider", value: providerMatch[1] })
        }
      } else if (cmd.includes("--renewal")) {
        const renewalMatch = cmd.match(/--renewal=(\d+)年/)
        if (renewalMatch && renewalMatch[1]) {
          setFilter({ type: "renewal", value: `${renewalMatch[1]}年` })
        }
      }
    }
  }

  // 处理命令输入
  const handleCommandSubmit = (newCommand: string) => {
    if (newCommand.trim() === "") return

    setCommand(newCommand)
    parseCommand(newCommand)

    // 添加到历史记录，避免重复
    if (commandHistory[commandHistory.length - 1] !== newCommand) {
      setCommandHistory((prev) => [...prev, newCommand])
    }
  }

  // 处理登录
  const handleLogin = async () => {
    if (!password.trim()) {
      setLoginError("请输入密码")
      return
    }

    setIsLoggingIn(true)
    setLoginError("")

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
        setShowLoginDialog(false)

        // 重定向到管理页面
        router.push("/admin")
      } else {
        setLoginError(data.message || "认证失败")
      }
    } catch (error) {
      console.error("登录出错:", error)
      setLoginError("登录过程中发生错误")
    } finally {
      setIsLoggingIn(false)
    }
  }

  // 处理管理面板访问
  const handleAdminAccess = () => {
    if (isAuthenticated) {
      router.push("/admin")
    } else {
      setShowLoginDialog(true)
    }
  }

  // 示例命令列表
  const exampleCommands = [
    { command: "domain-list --all", description: "显示所有域名" },
    { command: "domain-list --active", description: "仅显示活跃域名" },
    { command: "domain-list --expiring", description: "仅显示即将到期域名" },
    { command: "domain-list --parked", description: "仅显示停放域名" },
    { command: "domain-list --provider=Namecheap", description: "按提供商筛选" },
    { command: "domain-list --renewal=1年", description: "按续期周期筛选" },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-black text-green-400 font-mono">
      <div className="w-full max-w-5xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 text-sm text-gray-400">域名列表 ~ </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdminAccess}
            className="text-green-400 hover:bg-gray-700 hover:text-green-300"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isAuthenticated ? "管理面板" : "登录"}
          </Button>
        </div>

        <div className="p-4 bg-[#0d1117] font-mono text-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-400">Viper3@domain</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$ </span>
            <span className="text-yellow-300">{command}</span>
          </div>

          <DomainTable filter={filter} />

          <CommandInput
            onCommandSubmit={handleCommandSubmit}
            commandHistory={commandHistory}
            availableCommands={exampleCommands.map((cmd) => cmd.command)}
          />

          <CommandExamples commands={exampleCommands} onCommandClick={handleCommandSubmit} />
        </div>
      </div>

      <Footer />

      {/* 登录对话框 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-green-400">管理员登录</DialogTitle>
            <DialogDescription className="text-gray-400">请输入管理员密码以访问管理面板</DialogDescription>
          </DialogHeader>

          {loginError && (
            <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>认证错误</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-password" className="text-gray-300">
                密码
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-700 bg-gray-900 text-gray-100"
                placeholder="输入管理员密码"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin()
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              取消
            </Button>
            <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700" disabled={isLoggingIn}>
              {isLoggingIn ? "登录中..." : "登录"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
