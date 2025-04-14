export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full max-w-5xl mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-400 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-green-400 font-semibold mb-2">// 联系方式</h3>
          <p>
            <span className="text-gray-500">邮箱:</span>{" "}
            <a href="mailto:contact@example.com" className="text-blue-400 hover:underline">
              contact@example.com
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-green-400 font-semibold mb-2">// 链接</h3>
          <p>
            <span className="text-gray-500">博客:</span>{" "}
            <a href="/blog" className="text-blue-400 hover:underline">
              /blog
            </a>
          </p>
          <p>
            <span className="text-gray-500">GitHub:</span>{" "}
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @username
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-green-400 font-semibold mb-2">// 信息</h3>
          <p>
            <span className="text-gray-500">名称:</span> <span className="text-white">域名管理</span>
          </p>
          <p>
            <span className="text-gray-500">版权:</span> <span className="text-white">© 2022-{currentYear}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
