import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // 从环境变量获取管理员密码
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error("环境变量ADMIN_PASSWORD未设置")
      return NextResponse.json({ success: false, message: "服务器配置错误" }, { status: 500 })
    }

    if (password === adminPassword) {
      // 设置一个HTTP-only cookie用于服务器端验证
      const response = NextResponse.json({ success: true })
      response.cookies.set("adminAuthenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24小时
        path: "/",
      })
      return response
    } else {
      return NextResponse.json({ success: false, message: "密码不正确" }, { status: 401 })
    }
  } catch (error) {
    console.error("认证错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // 这个端点用于检查用户是否已经认证（通过cookie）
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
