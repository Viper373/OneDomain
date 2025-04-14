"use client"

import { useState } from "react"

interface Domain {
  id: number
  name: string
  expiry: string
  renewalPeriod: string
  provider: string
  consoleUrl: string
  status: "活跃" | "即将到期" | "停放"
}

interface FilterProps {
  type: string
  value?: string
}

interface DomainTableProps {
  filter: FilterProps
}

export function DomainTable({ filter }: DomainTableProps) {
  const [domains] = useState<Domain[]>([
    {
      id: 1,
      name: "example.com",
      expiry: "2025-12-31",
      renewalPeriod: "1年",
      provider: "Namecheap",
      consoleUrl: "https://namecheap.com",
      status: "活跃",
    },
    {
      id: 2,
      name: "techblog.io",
      expiry: "2026-05-15",
      renewalPeriod: "2年",
      provider: "GoDaddy",
      consoleUrl: "https://godaddy.com",
      status: "活跃",
    },
    {
      id: 3,
      name: "webstore.shop",
      expiry: "2024-08-22",
      renewalPeriod: "1年",
      provider: "Google",
      consoleUrl: "https://domains.google",
      status: "即将到期",
    },
    {
      id: 4,
      name: "dev-tools.net",
      expiry: "2025-11-05",
      renewalPeriod: "1年",
      provider: "Namecheap",
      consoleUrl: "https://namecheap.com",
      status: "活跃",
    },
    {
      id: 5,
      name: "ai-solutions.tech",
      expiry: "2026-03-18",
      renewalPeriod: "2年",
      provider: "Cloudflare",
      consoleUrl: "https://cloudflare.com",
      status: "停放",
    },
  ])

  // 根据筛选条件过滤域名
  const filteredDomains = domains.filter((domain) => {
    if (filter.type === "all") return true
    if (filter.type === "status") return domain.status === filter.value
    if (filter.type === "provider") return domain.provider.toLowerCase() === filter.value?.toLowerCase()
    if (filter.type === "renewal") return domain.renewalPeriod === filter.value
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "活跃":
        return "text-green-400"
      case "即将到期":
        return "text-yellow-400"
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
              {filteredDomains.length > 0 ? (
                filteredDomains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{domain.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{domain.expiry}</td>
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
