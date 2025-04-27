"use client";

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

const THEME_KEY = "theme"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null) 

  useEffect(() => {
    const html = document.documentElement
    const savedTheme = localStorage.getItem(THEME_KEY)

    if (savedTheme === "dark") {
      html.classList.add("dark")
      setIsDark(true)
    } else if (savedTheme === "light") {
      html.classList.remove("dark")
      setIsDark(false)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        html.classList.add("dark")
        setIsDark(true)
        localStorage.setItem(THEME_KEY, "dark")
      } else {
        html.classList.remove("dark")
        setIsDark(false)
        localStorage.setItem(THEME_KEY, "light")
      }
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const newIsDark = !isDark

    if (newIsDark) {
      html.classList.add("dark")
      localStorage.setItem(THEME_KEY, "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem(THEME_KEY, "light")
    }

    setIsDark(newIsDark)
  }

  if (isDark === null) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all duration-300 cursor-pointer"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-800" />
      )}
    </button>
  )
}
