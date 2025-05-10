// components/theme/theme-script.tsx
"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    const script = document.createElement("script")
    script.innerHTML = `
      (function() {
        try {
          // Get the stored theme, fall back to system
          const storedTheme = localStorage.getItem('rosebud-theme') || 'system';
          
          // Check if it's set to system, get OS preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          // Determine theme to apply
          const themeToApply = 
            storedTheme === 'system' 
              ? (prefersDark ? 'dark' : 'light')
              : storedTheme;
          
          // Remove existing classes and add the appropriate one
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(themeToApply);
        } catch (e) {
          console.error('Theme initialization error:', e);
        }
      })();
    `
    script.async = false
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}
