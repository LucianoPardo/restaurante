import { Link } from 'react-router'
import { ReservationForm } from '../../components/ReservationForm'
import { usePageTitle } from '../../hooks/usePageTitle'

const HIGHLIGHTS = [
  {
    label: 'PLATO PRINCIPAL',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
    to: '/platos',
  },
  { label: 'BEBIDAS', image: '/img/bebidas/vino2.jpg', to: '/bebidas' },
  { label: 'POSTRE', image: '/img/postres/flan.jpg', to: '/postres' },
]

// Antes: templates/users/home.html (el contenido por defecto de layout_client.html)
export function HomePage() {
  usePageTitle('Inicio')

  return (
    <section className="content">
      <div className="menu-section">
        <h2>NUESTRO MENÚ</h2>
        <div className="menu-items">
          {HIGHLIGHTS.map((item) => (
            <Link key={item.to} to={item.to} className="item">
              <img src={item.image} alt={item.label} />
              <p>{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <aside className="sidebar">
        <ReservationForm />
      </aside>
    </section>
  )
}
