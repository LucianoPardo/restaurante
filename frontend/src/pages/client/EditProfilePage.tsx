import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { gql } from '../../api/client'
import type { User } from '../../api/types'
import { useAuth } from '../../auth/auth-context'
import { FlashMessages } from '../../components/FlashMessages'
import { flashState, useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

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

const UPDATE_ME = /* GraphQL */ `
  mutation UpdateMe($input: UpdateProfileInput!) {
    updateMe(input: $input) {
      name
    }
  }
`

type Profile = Pick<User, 'name' | 'lastName' | 'direccion' | 'telefono' | 'email'>

interface ProfileForm {
  name: string
  lastName: string
  direccion: string
  telefono: string
  email: string
  password: string
}

// Antes: templates/users/update.html
export function EditProfilePage() {
  usePageTitle('Editar Perfil')
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const { flash, showError } = useFlash()
  const [form, setForm] = useState<ProfileForm | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    gql<{ me: Profile }>(ME)
      .then(({ me }) =>
        setForm({
          name: me.name,
          lastName: me.lastName,
          direccion: me.direccion ?? '',
          telefono: me.telefono ?? '',
          email: me.email,
          password: '',
        }),
      )
      .catch(showError)
  }, [showError])

  function update(field: keyof ProfileForm, value: string) {
    setForm((current) => current && { ...current, [field]: value })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form) {
      return
    }

    // La contraseña solo se envía si se escribió una nueva
    const { password, ...data } = form
    setSaving(true)
    try {
      const result = await gql<{ updateMe: { name: string } }>(UPDATE_ME, {
        input: password ? { ...data, password } : data,
      })
      updateUser({ name: result.updateMe.name })
      navigate('/perfil', { state: flashState('success', 'Datos actualizados correctamente.') })
    } catch (error) {
      showError(error)
      setSaving(false)
    }
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Mi Perfil</h2>
        <FlashMessages flash={flash} className="flash-stack" autoHide={false} />

        {form ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              required
            />

            <label htmlFor="last_name">Apellido:</label>
            <input
              type="text"
              id="last_name"
              value={form.lastName}
              onChange={(event) => update('lastName', event.target.value)}
              required
            />

            <label htmlFor="direccion">Direccion:</label>
            <input
              type="text"
              id="direccion"
              value={form.direccion}
              onChange={(event) => update('direccion', event.target.value)}
            />

            <label htmlFor="telefono">Celular:</label>
            <input
              type="tel"
              id="telefono"
              value={form.telefono}
              onChange={(event) => update('telefono', event.target.value)}
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              required
            />

            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              placeholder="Dejar en blanco para no cambiarla"
              minLength={6}
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
            />

            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Datos'}
            </button>
            <Link to="/perfil" className="btn secondary">
              Cancelar
            </Link>
          </form>
        ) : (
          <p className="page-loading">Cargando...</p>
        )}
      </div>
    </div>
  )
}
