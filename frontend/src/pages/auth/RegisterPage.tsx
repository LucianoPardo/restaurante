import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { gql } from '../../api/client'
import { FlashMessages } from '../../components/FlashMessages'
import { PasswordInput } from '../../components/PasswordInput'
import { flashState, useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

const REGISTER = /* GraphQL */ `
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      id
    }
  }
`

// Antes: templates/register.html
export function RegisterPage() {
  usePageTitle('Registrarse')
  const navigate = useNavigate()
  const { flash, showError } = useFlash()
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // En Flask este campo se ignoraba; ahora se comprueba antes de enviar
    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden')
      return
    }

    setSending(true)
    try {
      await gql(REGISTER, { input: { name, lastName, email, password } })
      navigate('/login', { state: flashState('success', 'Cuenta creada. Ya puedes iniciar sesión.') })
    } catch (error) {
      showError(error)
      setSending(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Crear Cuenta</h2>

          <FlashMessages flash={flash} className="auth-flash" autoHide={false} />

          <div className="input-group">
            <i className="fas fa-user icon" />
            <input
              type="text"
              id="name"
              placeholder="Nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-user icon" />
            <input
              type="text"
              id="lastName"
              placeholder="Apellido"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-envelope icon" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <PasswordInput id="password" placeholder="Contraseña" value={password} onChange={setPassword} />
          <PasswordInput
            id="confirm_password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <button type="submit" className="register-button" disabled={sending}>
            {sending ? 'Registrando...' : 'Registrarse'}
          </button>

          <p className="login-link">
            ¿Ya tienes una cuenta? <Link to="/login">Ingresar aquí</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
