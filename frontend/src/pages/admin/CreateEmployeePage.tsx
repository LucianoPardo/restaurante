import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { gql } from '../../api/client'
import { FlashMessages } from '../../components/FlashMessages'
import { flashState, useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

const CREATE_EMPLOYEE = /* GraphQL */ `
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
    }
  }
`

// Antes: templates/employees/create_employee.html
export function CreateEmployeePage() {
  usePageTitle('Crear Empleado')
  const navigate = useNavigate()
  const { flash, showError } = useFlash()
  const [form, setForm] = useState({ name: '', lastName: '', email: '', password: '', role: 'empleado' })
  const [saving, setSaving] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      await gql(CREATE_EMPLOYEE, { input: form })
      navigate('/admin/empleados', { state: flashState('success', 'Empleado creado exitosamente.') })
    } catch (error) {
      showError(error)
      setSaving(false)
    }
  }

  return (
    <div className="create-employee-page">
      <div className="form-wrapper">
        <FlashMessages flash={flash} className="flash-container" autoHide={false} />

        <form onSubmit={handleSubmit}>
          <h2>Crear Empleado</h2>

          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            required
          />

          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            value={form.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            required
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
            minLength={6}
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
            required
          />

          <label htmlFor="role">Rol:</label>
          <select id="role" value={form.role} onChange={(event) => update('role', event.target.value)} required>
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>

          <div className="button-group">
            <button type="submit" disabled={saving}>
              {saving ? 'Creando...' : 'Crear'}
            </button>
            <Link to="/admin/empleados">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
