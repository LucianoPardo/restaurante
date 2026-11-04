import { useState } from 'react'

interface PasswordInputProps {
  id: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

// Campo de contraseña con el "ojito" (antes togglePasswordVisibility en login.html)
export function PasswordInput({ id, placeholder, value, onChange }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="input-group password-group">
      <i className="fas fa-lock icon" />
      <input
        type={visible ? 'text' : 'password'}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
      <button
        type="button"
        className="toggle-password"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <i className={visible ? 'fas fa-eye' : 'fas fa-eye-slash'} />
      </button>
    </div>
  )
}
