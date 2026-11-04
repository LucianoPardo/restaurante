import { useCallback, useEffect, useState } from 'react'
import { gql } from '../../api/client'
import type { Reservation } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { ReservationForm } from '../../components/ReservationForm'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatDate, today } from '../../utils/format'

const MY_RESERVATIONS = /* GraphQL */ `
  query MyReservations {
    myReservations {
      id
      fecha
      numeroPersonas
      comentario
    }
  }
`

const CANCEL_RESERVATION = /* GraphQL */ `
  mutation CancelReservation($id: Int!) {
    cancelReservation(id: $id) {
      message
    }
  }
`

// Antes: templates/users/reservas.html (+ ahora se pueden cancelar)
export function ReservationsPage() {
  usePageTitle('Mis Reservas')
  const [reservations, setReservations] = useState<Reservation[] | null>(null)
  const { flash, showSuccess, showError } = useFlash()

  const loadReservations = useCallback(() => {
    gql<{ myReservations: Reservation[] }>(MY_RESERVATIONS)
      .then((data) => setReservations(data.myReservations))
      .catch(showError)
  }, [showError])

  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  async function handleCancel(reservation: Reservation) {
    if (!confirm(`¿Cancelar la reserva del ${formatDate(reservation.fecha)}?`)) {
      return
    }
    try {
      await gql(CANCEL_RESERVATION, { id: reservation.id })
      showSuccess('Reserva cancelada.')
      loadReservations()
    } catch (error) {
      showError(error)
    }
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card reserva">
        <h2>Mis Reservas</h2>
        <FlashMessages flash={flash} className="flash-stack" />

        {reservations === null && <p>Cargando...</p>}
        {reservations?.length === 0 && <p>No tienes reservas aún.</p>}
        {reservations && reservations.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Personas</th>
                <th>Comentario</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{formatDate(reservation.fecha)}</td>
                  <td>{reservation.numeroPersonas}</td>
                  <td>{reservation.comentario || '-'}</td>
                  <td>
                    {reservation.fecha >= today() && (
                      <button type="button" className="btn-cancel" onClick={() => handleCancel(reservation)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <aside className="sidebar">
        <div className="mis_reservas">
          <ReservationForm onCreated={loadReservations} />
        </div>
      </aside>
    </div>
  )
}
