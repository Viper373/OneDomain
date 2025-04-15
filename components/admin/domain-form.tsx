"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, AlertCircle, ArrowDown, ArrowUp, Copy, Upload, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface Domain {
  id: number
  name: string
  expiry: string
  renewalPeriod: string
  renewalValue?: number
  renewalUnit?: string
  provider: string
  consoleUrl: string
  status: "活跃" | "即将到期" | "停放"
  isPermanent?: boolean
  displayOrder?: number // 前台显示顺序
}

type SortField = "name" | "expiry" | "renewalPeriod" | "provider" | "status" | "displayOrder"
type SortDirection = "asc" | "desc"

export function DomainForm() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showCloneDialog, setShowCloneDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [sortField, setSortField] = useState<SortField>("displayOrder")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null)
  const [importText, setImportText] = useState("")
  const [importError, setImportError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 新域名表单状态
  const [newDomain, setNewDomain] = useState<Omit<Domain, "id">>({
    name: "",
    expiry: new Date().toISOString().split("T")[0],
    renewalPeriod: "1年",
    renewalValue: 1,
    renewalUnit: "年",
    provider: "",
    consoleUrl: "",
    status: "活跃",
    isPermanent: false,
    displayOrder: 0,
  })

  // 模拟从本地存储加载域名数据
  useEffect(() => {
    const storedDomains = localStorage.getItem("domainData")
    if (storedDomains) {
      const parsedDomains = JSON.parse(storedDomains)

      // 确保所有域名都有displayOrder属性
      const domainsWithOrder = parsedDomains.map((domain: Domain, index: number) => ({
        ...domain,
        displayOrder: domain.displayOrder !== undefined ? domain.displayOrder : index,
      }))

      setDomains(domainsWithOrder)
    } else {
      // 默认域名数据
      const defaultDomains: Domain[] = [
        {
          id: 1,
          name: "example.com",
          expiry: "2025-12-31",
          renewalPeriod: "1年",
          renewalValue: 1,
          renewalUnit: "年",
          provider: "Namecheap",
          consoleUrl: "https://namecheap.com",
          status: "活跃",
          displayOrder: 0,
        },
        {
          id: 2,
          name: "techblog.io",
          expiry: "2026-05-15",
          renewalPeriod: "2年",
          renewalValue: 2,
          renewalUnit: "年",
          provider: "GoDaddy",
          consoleUrl: "https://godaddy.com",
          status: "活跃",
          displayOrder: 1,
        },
        {
          id: 3,
          name: "webstore.shop",
          expiry: "2024-08-22",
          renewalPeriod: "30天",
          renewalValue: 30,
          renewalUnit: "天",
          provider: "Google",
          consoleUrl: "https://domains.google",
          status: "即将到期",
          displayOrder: 2,
        },
        {
          id: 4,
          name: "dev-tools.net",
          expiry: "2025-11-05",
          renewalPeriod: "6个月",
          renewalValue: 6,
          renewalUnit: "月",
          provider: "Namecheap",
          consoleUrl: "https://namecheap.com",
          status: "活跃",
          displayOrder: 3,
        },
        {
          id: 5,
          name: "ai-solutions.tech",
          expiry: "2026-03-18",
          renewalPeriod: "无",
          renewalValue: 0,
          renewalUnit: "无",
          provider: "Cloudflare",
          consoleUrl: "https://cloudflare.com",
          status: "停放",
          isPermanent: true,
          displayOrder: 4,
        },
      ]
      setDomains(defaultDomains)
      localStorage.setItem("domainData", JSON.stringify(defaultDomains))
    }
    setIsLoading(false)
  }, [])

  // 保存域名数据到本地存储
  const saveDomains = () => {
    localStorage.setItem("domainData", JSON.stringify(domains))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // 添加新域名
  const addDomain = () => {
    const newId = domains.length > 0 ? Math.max(...domains.map((d) => d.id)) + 1 : 1
    const maxDisplayOrder =
      domains.length > 0 ? Math.max(...domains.map((d) => (d.displayOrder !== undefined ? d.displayOrder : 0))) : -1

    // 计算续期周期显示文本
    let renewalPeriod = "无"
    if (newDomain.renewalValue && newDomain.renewalValue > 0 && newDomain.renewalUnit) {
      renewalPeriod = `${newDomain.renewalValue}${newDomain.renewalUnit}`
    }

    const domainToAdd = {
      ...newDomain,
      id: newId,
      renewalPeriod,
      displayOrder: maxDisplayOrder + 1,
    }

    setDomains([...domains, domainToAdd])

    // 重置表单
    setNewDomain({
      name: "",
      expiry: new Date().toISOString().split("T")[0],
      renewalPeriod: "1年",
      renewalValue: 1,
      renewalUnit: "年",
      provider: "",
      consoleUrl: "",
      status: "活跃",
      isPermanent: false,
      displayOrder: 0,
    })

    setShowAddDialog(false)
    saveDomains()
  }

  // 克隆域名
  const cloneDomain = () => {
    if (!selectedDomainId) return

    const sourceDomain = domains.find((d) => d.id === selectedDomainId)
    if (!sourceDomain) return

    const newId = domains.length > 0 ? Math.max(...domains.map((d) => d.id)) + 1 : 1
    const maxDisplayOrder =
      domains.length > 0 ? Math.max(...domains.map((d) => (d.displayOrder !== undefined ? d.displayOrder : 0))) : -1

    // 创建克隆域名，但使用新的名称和ID
    const clonedDomain = {
      ...sourceDomain,
      id: newId,
      name: `${sourceDomain.name.split(".")[0]}-clone.${sourceDomain.name.split(".").slice(1).join(".")}`,
      displayOrder: maxDisplayOrder + 1,
    }

    setDomains([...domains, clonedDomain])
    setShowCloneDialog(false)
    saveDomains()
  }

  // 删除域名
  const deleteDomain = (id: number) => {
    setDomains(domains.filter((domain) => domain.id !== id))
    saveDomains()
  }

  // 更新域名字段
  const updateDomainField = (id: number, field: keyof Domain, value: any) => {
    setDomains(
      domains.map((domain) => {
        if (domain.id === id) {
          const updatedDomain = { ...domain, [field]: value }

          // 如果更新的是续期值或单位，同时更新续期周期显示文本
          if (field === "renewalValue" || field === "renewalUnit") {
            const renewalValue = field === "renewalValue" ? value : domain.renewalValue
            const renewalUnit = field === "renewalUnit" ? value : domain.renewalUnit

            if (renewalValue && renewalValue > 0 && renewalUnit) {
              updatedDomain.renewalPeriod = `${renewalValue}${renewalUnit}`
            } else {
              updatedDomain.renewalPeriod = "无"
            }
          }

          return updatedDomain
        }
        return domain
      }),
    )
  }

  // 切换域名的永久状态
  const togglePermanent = (id: number, isPermanent: boolean) => {
    setDomains(
      domains.map((domain) => {
        if (domain.id === id) {
          return {
            ...domain,
            isPermanent,
            // 更新到期日显示，但保留续期周期
            expiry: isPermanent
              ? "永久"
              : domain.expiry === "永久"
                ? new Date().toISOString().split("T")[0]
                : domain.expiry,
          }
        }
        return domain
      }),
    )
  }

  // 移动域名显示顺序
  const moveDomainOrder = (id: number, direction: "up" | "down") => {
    const domainIndex = domains.findIndex((d) => d.id === id)
    if (domainIndex === -1) return

    const newDomains = [...domains]
    const currentDomain = newDomains[domainIndex]

    if (direction === "up" && domainIndex > 0) {
      // 交换当前域名和上一个域名的显示顺序
      const prevDomain = newDomains[domainIndex - 1]
      const tempOrder = currentDomain.displayOrder
      currentDomain.displayOrder = prevDomain.displayOrder
      prevDomain.displayOrder = tempOrder
    } else if (direction === "down" && domainIndex < domains.length - 1) {
      // 交换当前域名和下一个域名的显示顺序
      const nextDomain = newDomains[domainIndex + 1]
      const tempOrder = currentDomain.displayOrder
      currentDomain.displayOrder = nextDomain.displayOrder
      nextDomain.displayOrder = tempOrder
    }

    setDomains(newDomains)
    saveDomains()
  }

  // 排序域名
  const sortDomains = (field: SortField) => {
    // 如果点击当前排序字段，则切换排序方向
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // 如果点击新字段，则设置为该字段升序排序
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // 获取排序图标
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null

    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 inline ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 inline ml-1" />
    )
  }

  // 导出域名模板
  const exportDomainTemplate = () => {
    const template = {
      domains: [
        {
          name: "example.com",
          expiry: "2025-12-31",
          renewalValue: 1,
          renewalUnit: "年",
          provider: "Namecheap",
          consoleUrl: "https://namecheap.com",
          status: "活跃",
          isPermanent: false,
        },
        {
          name: "example-permanent.com",
          expiry: "",
          renewalValue: 2,
          renewalUnit: "年",
          provider: "GoDaddy",
          consoleUrl: "https://godaddy.com",
          status: "活跃",
          isPermanent: true,
        },
      ],
    }

    const jsonString = JSON.stringify(template, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "domain-template.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 处理文件导入
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        setImportText(content)
      } catch (error) {
        console.error("读取文件错误:", error)
        setImportError("读取文件失败，请检查文件格式")
      }
    }
    reader.readAsText(file)
  }

  // 导入域名
  const importDomains = () => {
    try {
      setImportError("")

      // 尝试解析JSON
      const importData = JSON.parse(importText)

      if (!importData.domains || !Array.isArray(importData.domains) || importData.domains.length === 0) {
        setImportError("无效的导入数据格式，请确保包含domains数组")
        return
      }

      const newId = domains.length > 0 ? Math.max(...domains.map((d) => d.id)) + 1 : 1
      const maxDisplayOrder =
        domains.length > 0 ? Math.max(...domains.map((d) => (d.displayOrder !== undefined ? d.displayOrder : 0))) : -1

      // 处理导入的域名
      const importedDomains = importData.domains.map((domain: any, index: number) => {
        // 验证必要字段
        if (!domain.name) {
          throw new Error(`第 ${index + 1} 个域名缺少必要的name字段`)
        }

        // 计算续期周期显示文本
        let renewalPeriod = "无"
        if (domain.renewalValue && domain.renewalValue > 0 && domain.renewalUnit) {
          renewalPeriod = `${domain.renewalValue}${domain.renewalUnit}`
        }

        return {
          id: newId + index,
          name: domain.name,
          expiry: domain.isPermanent ? "永久" : domain.expiry || new Date().toISOString().split("T")[0],
          renewalPeriod,
          renewalValue: domain.renewalValue || 0,
          renewalUnit: domain.renewalUnit || "无",
          provider: domain.provider || "",
          consoleUrl: domain.consoleUrl || "",
          status: domain.status || "活跃",
          isPermanent: !!domain.isPermanent,
          displayOrder: maxDisplayOrder + index + 1,
        }
      })

      // 添加导入的域名
      setDomains([...domains, ...importedDomains])
      setShowImportDialog(false)
      setImportText("")
      saveDomains()
    } catch (error) {
      console.error("导入错误:", error)
      setImportError(`导入失败: ${error instanceof Error ? error.message : "未知错误"}`)
    }
  }

  // 应用排序
  const sortedDomains = [...domains].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "displayOrder":
        comparison = (a.displayOrder || 0) - (b.displayOrder || 0)
        break
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "expiry":
        // 永久域名始终排在最后
        if (a.isPermanent && !b.isPermanent) return 1
        if (!a.isPermanent && b.isPermanent) return -1
        if (a.isPermanent && b.isPermanent) return 0
        comparison = new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
        break
      case "renewalPeriod":
        // 处理"无"的情况
        if (a.renewalPeriod === "无" && b.renewalPeriod !== "无") return -1
        if (a.renewalPeriod !== "无" && b.renewalPeriod === "无") return 1
        if (a.renewalPeriod === "无" && b.renewalPeriod === "无") return 0

        // 尝试比较数值部分
        const aMatch = a.renewalPeriod.match(/^(\d+)(.*)$/)
        const bMatch = b.renewalPeriod.match(/^(\d+)(.*)$/)

        if (aMatch && bMatch) {
          // 如果单位相同，比较数值
          if (aMatch[2] === bMatch[2]) {
            comparison = Number.parseInt(aMatch[1]) - Number.parseInt(bMatch[1])
          } else {
            // 单位不同，按单位优先级排序：天、周、月、年
            const unitPriority: Record<string, number> = { 天: 1, 周: 2, 月: 3, 半年: 4, 年: 5 }
            comparison = (unitPriority[aMatch[2]] || 0) - (unitPriority[bMatch[2]] || 0)
          }
        } else {
          comparison = a.renewalPeriod.localeCompare(b.renewalPeriod)
        }
        break
      case "provider":
        comparison = a.provider.localeCompare(b.provider)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>
  }

  return (
    <Card className="border-gray-700 bg-gray-800 text-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl text-green-400">域名管理</CardTitle>
          <CardDescription className="text-gray-400">管理您的所有域名信息</CardDescription>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                添加域名
              </Button>
            </DialogTrigger>
            <DialogContent className="border-gray-700 bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-green-400">添加新域名</DialogTitle>
                <DialogDescription className="text-gray-400">填写新域名的详细信息</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-300">
                    域名
                  </Label>
                  <Input
                    id="name"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                    className="border-gray-700 bg-gray-900 text-gray-100"
                    placeholder="example.com"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="permanent"
                    checked={newDomain.isPermanent}
                    onCheckedChange={(checked) => {
                      const isPermanent = checked === true
                      setNewDomain({
                        ...newDomain,
                        isPermanent,
                      })
                    }}
                  />
                  <Label htmlFor="permanent" className="text-gray-300">
                    永久域名（无到期日）
                  </Label>
                </div>

                {!newDomain.isPermanent && (
                  <div className="grid gap-2">
                    <Label htmlFor="expiry" className="text-gray-300">
                      到期日期
                    </Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={newDomain.expiry}
                      onChange={(e) => setNewDomain({ ...newDomain, expiry: e.target.value })}
                      className="border-gray-700 bg-gray-900 text-gray-100"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="renewal" className="text-gray-300">
                    续期周期
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="renewalValue"
                      type="number"
                      min="0"
                      value={newDomain.renewalValue}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 0
                        setNewDomain({
                          ...newDomain,
                          renewalValue: value,
                          renewalPeriod: value > 0 && newDomain.renewalUnit ? `${value}${newDomain.renewalUnit}` : "无",
                        })
                      }}
                      className="border-gray-700 bg-gray-900 text-gray-100 w-24"
                      placeholder="数值"
                    />
                    <Select
                      value={newDomain.renewalUnit}
                      onValueChange={(value) => {
                        setNewDomain({
                          ...newDomain,
                          renewalUnit: value,
                          renewalPeriod:
                            newDomain.renewalValue && newDomain.renewalValue > 0
                              ? `${newDomain.renewalValue}${value}`
                              : "无",
                        })
                      }}
                    >
                      <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100 flex-1">
                        <SelectValue placeholder="选择单位" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                        <SelectItem value="天">天</SelectItem>
                        <SelectItem value="周">周</SelectItem>
                        <SelectItem value="月">月</SelectItem>
                        <SelectItem value="半年">半年</SelectItem>
                        <SelectItem value="年">年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="provider" className="text-gray-300">
                    提供商
                  </Label>
                  <Input
                    id="provider"
                    value={newDomain.provider}
                    onChange={(e) => setNewDomain({ ...newDomain, provider: e.target.value })}
                    className="border-gray-700 bg-gray-900 text-gray-100"
                    placeholder="Namecheap"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="console" className="text-gray-300">
                    控制台URL
                  </Label>
                  <Input
                    id="console"
                    value={newDomain.consoleUrl}
                    onChange={(e) => setNewDomain({ ...newDomain, consoleUrl: e.target.value })}
                    className="border-gray-700 bg-gray-900 text-gray-100"
                    placeholder="https://namecheap.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-gray-300">
                    状态
                  </Label>
                  <Select
                    value={newDomain.status}
                    onValueChange={(value: "活跃" | "即将到期" | "停放") =>
                      setNewDomain({ ...newDomain, status: value })
                    }
                  >
                    <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                      <SelectItem value="活跃">活跃</SelectItem>
                      <SelectItem value="即将到期">即将到期</SelectItem>
                      <SelectItem value="停放">停放</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  className="border-gray-600 text-gray-300"
                >
                  取消
                </Button>
                <Button onClick={addDomain} className="bg-green-600 hover:bg-green-700">
                  添加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Copy className="mr-2 h-4 w-4" />
                克隆域名
              </Button>
            </DialogTrigger>
            <DialogContent className="border-gray-700 bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-green-400">克隆现有域名</DialogTitle>
                <DialogDescription className="text-gray-400">选择一个域名作为模板快速创建新域名</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="templateDomain" className="text-gray-300">
                    选择模板域名
                  </Label>
                  <Select
                    value={selectedDomainId?.toString() || ""}
                    onValueChange={(value) => setSelectedDomainId(Number(value))}
                  >
                    <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                      <SelectValue placeholder="选择一个域名" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                      {domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id.toString()}>
                          {domain.name} ({domain.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDomainId && (
                  <div className="rounded-md bg-gray-900 p-3 text-sm">
                    <p className="mb-2 text-gray-400">将创建以下域名的副本：</p>
                    {(() => {
                      const domain = domains.find((d) => d.id === selectedDomainId)
                      if (!domain) return null
                      return (
                        <div className="space-y-1">
                          <p>
                            <span className="text-gray-500">域名:</span> {domain.name}
                          </p>
                          <p>
                            <span className="text-gray-500">提供商:</span> {domain.provider}
                          </p>
                          <p>
                            <span className="text-gray-500">续期周期:</span> {domain.renewalPeriod}
                          </p>
                          <p>
                            <span className="text-gray-500">状态:</span> {domain.status}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCloneDialog(false)}
                  className="border-gray-600 text-gray-300"
                >
                  取消
                </Button>
                <Button onClick={cloneDomain} className="bg-green-600 hover:bg-green-700" disabled={!selectedDomainId}>
                  克隆
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="mr-2 h-4 w-4" />
                导入域名
              </Button>
            </DialogTrigger>
            <DialogContent className="border-gray-700 bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle className="text-green-400">批量导入域名</DialogTitle>
                <DialogDescription className="text-gray-400">通过JSON文件批量导入域名</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="importFile" className="text-gray-300">
                    选择JSON文件
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportDomainTemplate}
                    className="border-gray-600 text-gray-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    下载模板
                  </Button>
                </div>
                <Input
                  id="importFile"
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />

                <Label htmlFor="importContent" className="text-gray-300">
                  或直接粘贴JSON内容
                </Label>
                <Textarea
                  id="importContent"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="min-h-[200px] border-gray-700 bg-gray-900 text-gray-100 font-mono"
                  placeholder='{"domains": [{"name": "example.com", ...}]}'
                />

                {importError && (
                  <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{importError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImportDialog(false)
                    setImportText("")
                    setImportError("")
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  className="border-gray-600 text-gray-300"
                >
                  取消
                </Button>
                <Button
                  onClick={importDomains}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!importText.trim()}
                >
                  导入
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={saveDomains} className="border-gray-600 text-gray-300">
            <Save className="mr-2 h-4 w-4" />
            保存更改
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {saveSuccess && (
          <Alert className="mb-4 border-green-800 bg-green-950 text-green-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>保存成功！</AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    显示顺序
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-200"
                    onClick={() => sortDomains("name")}
                  >
                    域名 {getSortIcon("name")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-200"
                    onClick={() => sortDomains("expiry")}
                  >
                    到期日 {getSortIcon("expiry")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-200"
                    onClick={() => sortDomains("renewalPeriod")}
                  >
                    续期周期 {getSortIcon("renewalPeriod")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-200"
                    onClick={() => sortDomains("provider")}
                  >
                    提供商 {getSortIcon("provider")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-200"
                    onClick={() => sortDomains("status")}
                  >
                    状态 {getSortIcon("status")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    控制台URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedDomains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-700">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDomainOrder(domain.id, "up")}
                          className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{domain.displayOrder}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDomainOrder(domain.id, "down")}
                          className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Input
                        value={domain.name}
                        onChange={(e) => updateDomainField(domain.id, "name", e.target.value)}
                        className="h-8 border-gray-700 bg-gray-800 text-gray-100"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        {domain.isPermanent ? (
                          <div className="flex items-center h-8 px-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100">
                            永久
                          </div>
                        ) : (
                          <Input
                            type="date"
                            value={domain.expiry}
                            onChange={(e) => updateDomainField(domain.id, "expiry", e.target.value)}
                            className="h-8 border-gray-700 bg-gray-800 text-gray-100"
                          />
                        )}
                        <Checkbox
                          checked={domain.isPermanent}
                          onCheckedChange={(checked) => togglePermanent(domain.id, checked === true)}
                          className="ml-2"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={domain.renewalValue}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value) || 0
                            updateDomainField(domain.id, "renewalValue", value)
                          }}
                          className="h-8 border-gray-700 bg-gray-800 text-gray-100 w-16"
                        />
                        <Select
                          value={domain.renewalUnit}
                          onValueChange={(value) => updateDomainField(domain.id, "renewalUnit", value)}
                        >
                          <SelectTrigger className="h-8 border-gray-700 bg-gray-800 text-gray-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                            <SelectItem value="天">天</SelectItem>
                            <SelectItem value="周">周</SelectItem>
                            <SelectItem value="月">月</SelectItem>
                            <SelectItem value="半年">半年</SelectItem>
                            <SelectItem value="年">年</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Input
                        value={domain.provider}
                        onChange={(e) => updateDomainField(domain.id, "provider", e.target.value)}
                        className="h-8 border-gray-700 bg-gray-800 text-gray-100"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Select
                        value={domain.status}
                        onValueChange={(value: "活跃" | "即将到期" | "停放") =>
                          updateDomainField(domain.id, "status", value)
                        }
                      >
                        <SelectTrigger className="h-8 border-gray-700 bg-gray-800 text-gray-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                          <SelectItem value="活跃">活跃</SelectItem>
                          <SelectItem value="即将到期">即将到期</SelectItem>
                          <SelectItem value="停放">停放</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Input
                        value={domain.consoleUrl}
                        onChange={(e) => updateDomainField(domain.id, "consoleUrl", e.target.value)}
                        className="h-8 border-gray-700 bg-gray-800 text-gray-100"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDomain(domain.id)}
                        className="h-8 text-red-400 hover:bg-red-950 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
