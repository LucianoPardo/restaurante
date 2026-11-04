import { useCallback, useState } from 'react'
import { useLocation } from 'react-router'
import { errorMessages } from '../api/client'

export interface Flash {
  category: 'success' | 'error'
  message: string
}

// "id" cambia con cada mensaje nuevo para reiniciar el temporizador que los oculta
export interface FlashBag {
  id: number
  items: Flash[]
}

// Para mandar un mensaje a la página siguiente: navigate('/ruta', { state: flashState(...) })
export function flashState(category: Flash['category'], message: string) {
  return { flash: { category, message } }
}

// Reemplaza a flash() + get_flashed_messages() de Flask.
// readNavigation: si es true, muestra el mensaje que llegó con navigate(..., { state })
export function useFlash(readNavigation = true) {
  const location = useLocation()
  const [flash, setFlash] = useState<FlashBag>(() => {
    const incoming = readNavigation ? (location.state as { flash?: Flash } | null)?.flash : undefined
    return { id: 0, items: incoming ? [incoming] : [] }
  })

  // useCallback: la función es siempre la misma entre renders,
  // así se puede poner en las dependencias de un useEffect sin que se repita
  const showSuccess = useCallback((message: string) => {
    setFlash((previous) => ({ id: previous.id + 1, items: [{ category: 'success', message }] }))
  }, [])

  const showError = useCallback((error: unknown) => {
    const items = errorMessages(error).map((message): Flash => ({ category: 'error', message }))
    setFlash((previous) => ({ id: previous.id + 1, items }))
  }, [])

  return { flash, showSuccess, showError }
}
