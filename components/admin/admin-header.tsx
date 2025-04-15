"use client"

import { LogOut, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminHeaderProps {
  onLogout: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b border-gray-700 bg-gray-800 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-green-400" />
          <h1 className="text-xl font-bold text-green-400">域名管理系统</h1>
          <span className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300">管理面板</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">
            返回前台
          </Link>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-300 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" />
            退出
          </Button>
        </div>
      </div>
    </header>
  )
}
