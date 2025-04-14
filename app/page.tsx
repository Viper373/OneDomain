"use client"

import { useState } from "react"
import { DomainTable } from "@/components/domain-table"
import { Footer } from "@/components/footer"
import { CommandExamples } from "@/components/command-examples"
import { CommandInput } from "@/components/command-input"

export default function Home() {
  const [command, setCommand] = useState("domain-list --all")
  const [filter, setFilter] = useState({ type: "all" })
  const [commandHistory, setCommandHistory] = useState<string[]>(["domain-list --all"])

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
        <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 text-sm text-gray-400">域名列表 ~ </div>
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
    </main>
  )
}
