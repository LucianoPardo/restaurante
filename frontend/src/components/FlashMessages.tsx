import { useEffect, useState } from 'react'
import type { FlashBag } from '../hooks/useFlash'

type Phase = 'visible' | 'fading' | 'hidden'

interface FlashMessagesProps {
  flash: FlashBag
  className?: string
  autoHide?: boolean
}

// Muestra los mensajes y, como el script de las plantillas de Flask,
// los desvanece a los 3 segundos (salvo autoHide={false})
export function FlashMessages({ flash, className = 'flash-container-list', autoHide = true }: FlashMessagesProps) {
  // Recuerda a qué mensaje (id) corresponde la fase guardada
  const [timer, setTimer] = useState<{ id: number; phase: Phase }>({ id: -1, phase: 'visible' })

  useEffect(() => {
    if (!autoHide) {
      return
    }
    const fadeTimer = setTimeout(() => setTimer({ id: flash.id, phase: 'fading' }), 3000)
    const hideTimer = setTimeout(() => setTimer({ id: flash.id, phase: 'hidden' }), 3500)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [flash.id, autoHide])

  // Un mensaje nuevo siempre empieza visible
  const phase = timer.id === flash.id ? timer.phase : 'visible'

  if (flash.items.length === 0 || phase === 'hidden') {
    return null
  }

  return (
    <div
      className={className}
      style={{ opacity: phase === 'fading' ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}
    >
      {flash.items.map((item, index) => (
        <div key={index} className={`flash ${item.category}`}>
          {item.message}
        </div>
      ))}
    </div>
  )
}
