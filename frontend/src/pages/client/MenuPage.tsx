import { Link } from 'react-router'
import { MENU } from '../../data/menu'
import { usePageTitle } from '../../hooks/usePageTitle'

// Antes: templates/users/menu.html (en Flask no se mostraba). Ahora lista las categorías.
export function MenuPage() {
  usePageTitle('Menu')

  return (
    <section className="page-section">
      <h2>NUESTRO MENÚ</h2>
      <div className="menu-grid">
        {MENU.map((category) => (
          <Link key={category.slug} to={`/${category.slug}`} className="menu-card">
            <img src={category.cover} alt={category.title} />
            <p>{category.title.toUpperCase()}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
