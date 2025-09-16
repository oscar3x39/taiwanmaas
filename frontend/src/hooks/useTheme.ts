// 🤖 AI-Generated Theme Hook
// 🎨 主題管理自定義 Hook

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { setTheme, toggleTheme } from '@/store/slices/uiSlice'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector(state => state.ui)

  // 🎨 Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Apply current theme
    if (theme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      root.setAttribute('data-theme', systemTheme)
    } else {
      root.classList.add(theme)
      root.setAttribute('data-theme', theme)
    }
  }, [theme])

  // 🎯 Theme utilities
  const setLightTheme = () => dispatch(setTheme('light'))
  const setDarkTheme = () => dispatch(setTheme('dark'))
  const setSystemTheme = () => dispatch(setTheme('system'))
  const toggle = () => dispatch(toggleTheme())

  // 🎯 Get current effective theme
  const getEffectiveTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }

  return {
    theme,
    effectiveTheme: getEffectiveTheme(),
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme: toggle,
    isLight: getEffectiveTheme() === 'light',
    isDark: getEffectiveTheme() === 'dark',
  }
}