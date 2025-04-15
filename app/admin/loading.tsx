export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-green-400"></div>
        <p className="mt-4 font-mono text-green-400">加载中...</p>
      </div>
    </div>
  )
}
