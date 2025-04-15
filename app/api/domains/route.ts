import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 在实际应用中，这些数据应该从数据库获取
    const domains = [
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
    ]

    return NextResponse.json({ success: true, domains })
  } catch (error) {
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const domain = await request.json()

    // 在实际应用中，这里应该将域名保存到数据库

    return NextResponse.json({ success: true, domain: { ...domain, id: Date.now() } })
  } catch (error) {
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
