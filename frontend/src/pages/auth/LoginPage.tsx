import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { homePathFor, useAuth } from '../../auth/auth-context'
import { FlashMessages } from '../../components/FlashMessages'
import { PasswordInput } from '../../components/PasswordInput'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

// Antes: templates/login.html
export function LoginPage() {
  usePageTitle('Inicio Sesion')
  const { login } = useAuth()
  const navigate = useNavigate()
  const { flash, showError } = useFlash()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    try {
      const user = await login(email, password)
      navigate(homePathFor(user.role), { replace: true })
    } catch (error) {
      showError(error)
      setSending(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>

          <FlashMessages flash={flash} className="auth-flash" autoHide={false} />

          <div className="input-group">
            <i className="fas fa-envelope icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <PasswordInput id="password" placeholder="Contraseña" value={password} onChange={setPassword} />

          <button type="submit" className="login-button" disabled={sending}>
            {sending ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="register-link">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>

          <div className="separator" />

          {/* Decorativos, igual que en el original: todavía no hacen nada */}
          <div className="social-icons">
            <a href="#" className="social-icon facebook" title="Entrar con Facebook">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" className="social-icon twitter" title="Entrar con Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" className="social-icon google" title="Entrar con Google">
              <i className="fab fa-google" />
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
