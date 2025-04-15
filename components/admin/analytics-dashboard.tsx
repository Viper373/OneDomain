"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "周一", 访问量: 40 },
  { name: "周二", 访问量: 30 },
  { name: "周三", 访问量: 20 },
  { name: "周四", 访问量: 27 },
  { name: "周五", 访问量: 18 },
  { name: "周六", 访问量: 23 },
  { name: "周日", 访问量: 34 },
]

export function AnalyticsDashboard() {
  return (
    <Card className="border-gray-700 bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-xl text-green-400">访问分析</CardTitle>
        <CardDescription className="text-gray-400">查看您的域名页面访问统计</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", color: "#E5E7EB" }}
                itemStyle={{ color: "#34D399" }}
              />
              <Bar dataKey="访问量" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
