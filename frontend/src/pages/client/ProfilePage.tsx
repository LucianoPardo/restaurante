import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { gql } from '../../api/client'
import type { User } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

// Con GraphQL la página pide solo los campos que muestra
const ME = /* GraphQL */ `
  query Me {
    me {
      name
      lastName
      direccion
      telefono
      email
    }
  }
`

type Profile = Pick<User, 'name' | 'lastName' | 'direccion' | 'telefono' | 'email'>

// Antes: templates/users/perfil_user.html
export function ProfilePage() {
  usePageTitle('Perfil')
  const [user, setUser] = useState<Profile | null>(null)
  const { flash, showError } = useFlash()

  // Se ejecuta al abrir la página: pide los datos al backend
  useEffect(() => {
    gql<{ me: Profile }>(ME)
      .then((data) => setUser(data.me))
      .catch(showError)
  }, [showError])

  return (
    <div className="perfil-container">
      <div className="perfil-card readonly">
        <h2>Mi Perfil</h2>
        <FlashMessages flash={flash} className="flash-stack" />

        {user ? (
          <form>
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" value={user.name} readOnly />

            <label htmlFor="last_name">Apellido:</label>
            <input type="text" id="last_name" value={user.lastName} readOnly />

            <label htmlFor="direccion">Direccion:</label>
            <input type="text" id="direccion" value={user.direccion ?? ''} readOnly />

            <label htmlFor="telefono">Celular:</label>
            <input type="text" id="telefono" value={user.telefono ?? ''} readOnly />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={user.email} readOnly />

            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" value="********" readOnly />

            <Link to="/perfil/editar" className="btn">
              Editar Perfil
            </Link>
          </form>
        ) : (
          <p className="page-loading">Cargando...</p>
        )}
      </div>
    </div>
  )
}
