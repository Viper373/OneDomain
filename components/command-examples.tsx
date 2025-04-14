"use client"

interface CommandProps {
  command: string
  description: string
}

interface CommandExamplesProps {
  commands: CommandProps[]
  onCommandClick: (command: string) => void
}

export function CommandExamples({ commands, onCommandClick }: CommandExamplesProps) {
  return (
    <div className="mt-6 p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700">
      <h3 className="text-green-400 font-semibold mb-2">// 可用命令</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {commands.map((cmd, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer hover:bg-gray-700 p-1 rounded"
            onClick={() => onCommandClick(cmd.command)}
          >
            <span className="text-yellow-300 text-xs mr-2">{cmd.command}</span>
            <span className="text-gray-400 text-xs">- {cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
