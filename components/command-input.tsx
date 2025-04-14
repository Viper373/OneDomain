"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface CommandInputProps {
  onCommandSubmit: (command: string) => void
  commandHistory: string[]
  availableCommands: string[]
}

export function CommandInput({ onCommandSubmit, commandHistory, availableCommands }: CommandInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestion, setSuggestion] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // 当历史记录变化时，重置历史索引
  useEffect(() => {
    setHistoryIndex(-1)
  }, [commandHistory])

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // 处理命令补全
  const handleTabCompletion = () => {
    if (suggestion) {
      setInputValue(inputValue + suggestion)
      setSuggestion("")
    }
  }

  // 生成命令补全建议
  const generateSuggestion = (input: string) => {
    if (!input) return ""

    // 找到匹配的命令
    const matchingCommand = availableCommands.find(
      (cmd) => cmd.toLowerCase().startsWith(input.toLowerCase()) && cmd !== input,
    )

    if (matchingCommand) {
      // 只返回需要补全的部分
      return matchingCommand.slice(input.length)
    }

    return ""
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 回车键提交命令
    if (e.key === "Enter") {
      onCommandSubmit(inputValue)
      setInputValue("")
      setHistoryIndex(-1)
      setSuggestion("")
      return
    }

    // Tab键补全命令
    if (e.key === "Tab") {
      e.preventDefault()
      handleTabCompletion()
      return
    }

    // 上下键导航历史
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex])
        setSuggestion("")
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex])
        setSuggestion("")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputValue("")
        setSuggestion("")
      }
      return
    }
  }

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // 更新补全建议
    if (value) {
      const newSuggestion = generateSuggestion(value)
      setSuggestion(newSuggestion)
    } else {
      setSuggestion("")
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center">
        <span className="text-green-400">Viper3@domain</span>
        <span className="text-white">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-white">$ </span>
        <div className="relative inline-flex items-center">
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none text-yellow-300 w-64 caret-green-400"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ caretColor: "#34d399", caretShape: "block" }}
          />
          {suggestion && (
            <div className="absolute pointer-events-none text-gray-500" style={{ left: `${inputValue.length}ch` }}>
              {suggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
