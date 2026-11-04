import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/auth-context'

// Antes: templates/users/layout_client.html.
// <Outlet /> es el {% block main_content %}: ahí se dibuja cada página del cliente.
export function ClientLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="client-layout">
      <header>
        <div className="logo">NOMBRE RESTAURANTE</div>
        <nav>
          <NavLink to="/" end>
            INICIO
          </NavLink>
          <NavLink to="/menu">MENÚ</NavLink>
          <NavLink to="/reservas">RESERVAS</NavLink>
          <NavLink to="/perfil">MI CUENTA</NavLink>
        </nav>
        <div className="user">
          Hola, <span>{user?.name}</span>
          <button type="button" onClick={logout}>
            Cerrar Sesion
          </button>
        </div>
      </header>

      <main>
        <section className="banner">
          <div className="banner-text">
            <h1>EXPERIENCIAS GASTRONÓMICAS</h1>
            <Link to="/menu" className="banner-button">
              EXPLORAR MENÚ
            </Link>
          </div>
        </section>
        <Outlet />
      </main>
    </div>
  )
}
