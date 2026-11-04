import { useEffect } from 'react'

// El <title> que antes ponía cada plantilla de Flask
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
