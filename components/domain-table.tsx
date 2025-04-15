"use client"

import { useState, useEffect } from "react"

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
  displayOrder?: number
}

interface FilterProps {
  type: string
  value?: string
}

interface DomainTableProps {
  filter: FilterProps
}

export function DomainTable({ filter }: DomainTableProps) {
  const [domains, setDomains] = useState<Domain[]>([])

  // 从本地存储加载域名数据
  useEffect(() => {
    const storedDomains = localStorage.getItem("domainData")
    if (storedDomains) {
      setDomains(JSON.parse(storedDomains))
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
    }
  }, [])

  // 根据筛选条件过滤域名
  const filteredDomains = domains.filter((domain) => {
    if (filter.type === "all") return true
    if (filter.type === "status") return domain.status === filter.value
    if (filter.type === "provider") return domain.provider.toLowerCase() === filter.value?.toLowerCase()
    if (filter.type === "renewal") return domain.renewalPeriod === filter.value
    return true
  })

  // 按照显示顺序排序域名
  const sortedDomains = [...filteredDomains].sort((a, b) => {
    const orderA = a.displayOrder !== undefined ? a.displayOrder : 999
    const orderB = b.displayOrder !== undefined ? b.displayOrder : 999
    return orderA - orderB
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "活跃":
        return "text-green-400"
      case "即将到期":
        return "text-red-400" // 改为红色
      case "停放":
        return "text-blue-400"
      default:
        return "text-white"
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="border border-gray-700 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  域名
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  到期日
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  续期周期
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  提供商
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  状态
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  管理
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 bg-opacity-50 divide-y divide-gray-700">
              {sortedDomains.length > 0 ? (
                sortedDomains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{domain.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      {domain.isPermanent ? "永久" : domain.expiry}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{domain.renewalPeriod}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{domain.provider}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${getStatusColor(domain.status)} bg-opacity-10 bg-current`}
                      >
                        {domain.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <a
                        href={domain.consoleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-400 rounded hover:bg-opacity-50 transition-colors"
                      >
                        传送门
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    没有找到匹配的域名
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
