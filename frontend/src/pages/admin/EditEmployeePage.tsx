import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessages, gql } from '../../api/client'
import type { User } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { flashState, useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

const EMPLOYEE = /* GraphQL */ `
  query Employee($id: Int!) {
    employee(id: $id) {
      name
      lastName
      email
      role
    }
  }
`

const UPDATE_EMPLOYEE = /* GraphQL */ `
  mutation UpdateEmployee($id: Int!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
    }
  }
`

interface EmployeeForm {
  name: string
  lastName: string
  email: string
  role: string
  password: string
}

// Antes: templates/employees/edit_employee.html
export function EditEmployeePage() {
  usePageTitle('Editar Empleado')
  const { id } = useParams()
  const navigate = useNavigate()
  const { flash, showError } = useFlash()
  const [form, setForm] = useState<EmployeeForm | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    gql<{ employee: Pick<User, 'name' | 'lastName' | 'email' | 'role'> }>(EMPLOYEE, { id: Number(id) })
      .then(({ employee }) =>
        setForm({
          name: employee.name,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          password: '',
        }),
      )
      .catch((error) =>
        navigate('/admin/empleados', { state: flashState('error', errorMessages(error)[0]) }),
      )
  }, [id, navigate])

  function update(field: keyof EmployeeForm, value: string) {
    setForm((current) => current && { ...current, [field]: value })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form) {
      return
    }

    // Si la contraseña queda en blanco no se cambia
    const { password, ...data } = form
    setSaving(true)
    try {
      await gql(UPDATE_EMPLOYEE, { id: Number(id), input: password ? { ...data, password } : data })
      navigate('/admin/empleados', { state: flashState('success', 'Empleado actualizado.') })
    } catch (error) {
      showError(error)
      setSaving(false)
    }
  }

  if (!form) {
    return <p className="page-loading">Cargando...</p>
  }

  return (
    <div className="edit-employee-page">
      <form onSubmit={handleSubmit}>
        <h2>Editar Empleado</h2>
        <FlashMessages flash={flash} className="flash-container" autoHide={false} />

        <label htmlFor="name">Nombre del Empleado</label>
        <input
          type="text"
          id="name"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          required
        />

        <label htmlFor="lastName">Apellido</label>
        <input
          type="text"
          id="lastName"
          value={form.lastName}
          onChange={(event) => update('lastName', event.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Dejar en blanco si no quiere cambiar la contraseña"
          minLength={6}
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
        />

        {/* En Flask el rol no venía marcado y al guardar se perdía el de Administrador */}
        <label htmlFor="role">Rol:</label>
        <select id="role" value={form.role} onChange={(event) => update('role', event.target.value)} required>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>

        <div className="button-group">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <Link to="/admin/empleados">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
