import { useState, type FormEvent } from 'react'
import { gql } from '../api/client'
import { useFlash } from '../hooks/useFlash'
import { today } from '../utils/format'
import { FlashMessages } from './FlashMessages'

const CREATE_RESERVATION = /* GraphQL */ `
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
    }
  }
`

// Tarjeta "RESERVAR UNA MESA" (se usa en el inicio y en Mis Reservas)
export function ReservationForm({ onCreated }: { onCreated?: () => void }) {
  const [fecha, setFecha] = useState('')
  const [numeroPersonas, setNumeroPersonas] = useState('1')
  const [comentario, setComentario] = useState('')
  const [sending, setSending] = useState(false)
  const { flash, showSuccess, showError } = useFlash(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    try {
      await gql(CREATE_RESERVATION, {
        input: {
          fecha,
          numeroPersonas: Number(numeroPersonas),
          comentario: comentario.trim() || undefined,
        },
      })
      showSuccess('Reserva creada con éxito.')
      setFecha('')
      setNumeroPersonas('1')
      setComentario('')
      onCreated?.()
    } catch (error) {
      showError(error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="card reserva">
      <h3>RESERVAR UNA MESA</h3>
      <form onSubmit={handleSubmit}>
        <FlashMessages flash={flash} className="flash-stack" />

        <label htmlFor="fecha">Fecha:</label>
        <input
          type="date"
          id="fecha"
          min={today()}
          value={fecha}
          onChange={(event) => setFecha(event.target.value)}
          required
        />

        <label htmlFor="numero_personas">Número de personas:</label>
        <input
          type="number"
          id="numero_personas"
          min="1"
          max="10"
          value={numeroPersonas}
          onChange={(event) => setNumeroPersonas(event.target.value)}
          required
        />

        <label htmlFor="comentario">Comentarios (Opcional):</label>
        <textarea
          id="comentario"
          placeholder="Ej: Mesa cerca de la ventana"
          maxLength={100}
          value={comentario}
          onChange={(event) => setComentario(event.target.value)}
        />

        <button type="submit" disabled={sending}>
          {sending ? 'ENVIANDO...' : 'CONFIRMAR RESERVA'}
        </button>
      </form>
    </div>
  )
}
