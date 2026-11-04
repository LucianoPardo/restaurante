import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { gql } from '../../api/client'
import type { Reservation } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatDate } from '../../utils/format'

// Cada reserva trae los datos del cliente que la hizo (la relación con User)
const ALL_RESERVATIONS = /* GraphQL */ `
  query AllReservations {
    reservations {
      id
      fecha
      numeroPersonas
      comentario
      user {
        name
        lastName
        email
      }
    }
  }
`

// Página nueva: en Flask el personal no podía ver las reservas.
// Usa los mismos estilos que la lista de empleados.
export function AllReservationsPage() {
  usePageTitle('Reservas')
  const [reservations, setReservations] = useState<Reservation[] | null>(null)
  const { flash, showError } = useFlash()

  useEffect(() => {
    gql<{ reservations: Reservation[] }>(ALL_RESERVATIONS)
      .then((data) => setReservations(data.reservations))
      .catch(showError)
  }, [showError])

  return (
    <div className="employees-page">
      <div className="container">
        <Link className="btn comeback" to="/admin">
          &larr; Volver
        </Link>
        <h2>Reservas</h2>

        <FlashMessages flash={flash} />

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Personas</th>
              <th>Comentario</th>
              <th>Cliente</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {reservations?.map((reservation) => (
              <tr key={reservation.id}>
                <td>{formatDate(reservation.fecha)}</td>
                <td>{reservation.numeroPersonas}</td>
                <td>{reservation.comentario || '-'}</td>
                <td>
                  {reservation.user?.name} {reservation.user?.lastName}
                </td>
                <td>{reservation.user?.email}</td>
              </tr>
            ))}
            {reservations?.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>No hay reservas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
