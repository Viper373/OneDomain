export function ProfileInfo() {
  return (
    <div className="mt-6 p-4 bg-gray-800 bg-opacity-30 rounded-md border border-gray-700">
      <div className="text-cyan-400 font-bold mb-2">// Profile Information</div>
      <pre className="text-sm">
        <code>
          {`const profile = {
  name: "Domain Portfolio",
  title: "My Domain Collection",
  contact: {
    email: "contact@example.com",
    twitter: "@domainmanager"
  },
  links: {
    blog: "/blog",
    dashboard: "/dashboard"
  },
  copyright: "2022-${new Date().getFullYear()}"
};`}
        </code>
      </pre>
    </div>
  )
}
