import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { gql } from '../../api/client'
import { ROLE_LABELS, type User } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

const EMPLOYEES = /* GraphQL */ `
  query Employees {
    employees {
      id
      name
      lastName
      email
      role
    }
  }
`

const REMOVE_EMPLOYEE = /* GraphQL */ `
  mutation RemoveEmployee($id: Int!) {
    removeEmployee(id: $id) {
      message
    }
  }
`

type Employee = Pick<User, 'id' | 'name' | 'lastName' | 'email' | 'role'>

// Antes: templates/employees/employees.html
export function EmployeesPage() {
  usePageTitle('Lista de Empleados')
  const [employees, setEmployees] = useState<Employee[] | null>(null)
  const { flash, showSuccess, showError } = useFlash()

  const loadEmployees = useCallback(() => {
    gql<{ employees: Employee[] }>(EMPLOYEES)
      .then((data) => setEmployees(data.employees))
      .catch(showError)
  }, [showError])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  async function handleDelete(employee: Employee) {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${employee.name}?`)) {
      return
    }
    try {
      await gql(REMOVE_EMPLOYEE, { id: employee.id })
      showSuccess('Empleado eliminado.')
      loadEmployees()
    } catch (error) {
      showError(error)
    }
  }

  return (
    <div className="employees-page">
      <div className="container">
        <Link className="btn comeback" to="/admin">
          &larr; Volver
        </Link>
        <h2>Lista de Empleados</h2>

        <FlashMessages flash={flash} />

        <Link className="btn create" to="/admin/empleados/nuevo">
          + Agregar Nuevo Empleado
        </Link>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{ROLE_LABELS[employee.role]}</td>
                <td>
                  <Link className="btn edit" to={`/admin/empleados/${employee.id}/editar`}>
                    Editar
                  </Link>
                  <button type="button" className="btn delete" onClick={() => handleDelete(employee)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {employees?.length === 0 && (
              <tr className="empty-row">
                <td colSpan={6}>No hay empleados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
