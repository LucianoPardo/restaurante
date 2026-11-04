import { Link } from 'react-router'
import type { Role } from '../../api/types'
import { useAuth } from '../../auth/auth-context'
import { usePageTitle } from '../../hooks/usePageTitle'

interface DashboardCard {
  to: string
  icon: string
  label: string
  roles: Role[]
  extraClass?: string
}

const CARDS: DashboardCard[] = [
  { to: '/admin/empleados', icon: 'fas fa-users', label: 'Gestionar Empleados', roles: ['admin'] },
  { to: '/admin/insumos', icon: 'fas fa-warehouse', label: 'Inventario', roles: ['admin'] },
  {
    to: '/admin/ventas',
    icon: 'fas fa-chart-line',
    label: 'Reportes de Ventas',
    roles: ['admin'],
    extraClass: 'card-reports',
  },
  { to: '/admin/reservas', icon: 'fas fa-calendar-check', label: 'Reservas', roles: ['admin', 'empleado'] },
]

// Antes: templates/employees/main.html.
// El rol "empleado" ahora también entra aquí, pero solo ve la tarjeta de Reservas.
export function DashboardPage() {
  usePageTitle('Panel de Control | Restaurant Management')
  const { user, logout } = useAuth()
  const cards = CARDS.filter((card) => user && card.roles.includes(user.role))

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="header-title">Restaurant Management</h1>
        <button type="button" onClick={logout} className="logout-btn">
          <i className="fas fa-sign-out-alt" />
          Cerrar Sesión
        </button>
      </header>

      <main className="dashboard-main">
        <div className="main-content">
          <h2 className="main-title">¿Qué deseas gestionar?</h2>
          <div className="grid-container">
            {cards.map((card) => (
              <Link key={card.to} to={card.to} className={`card ${card.extraClass ?? ''}`}>
                <div className="icon">
                  <i className={card.icon} />
                </div>
                <p className="card-text">{card.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
