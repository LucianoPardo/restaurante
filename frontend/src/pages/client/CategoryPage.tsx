import { Link } from 'react-router'
import { MENU, type MenuSlug } from '../../data/menu'
import { usePageTitle } from '../../hooks/usePageTitle'

// Antes: platos.html, bebidas.html, postres.html y ensaladas.html (una plantilla por categoría).
// Ahora es una sola página que recibe qué categoría mostrar.
export function CategoryPage({ slug }: { slug: MenuSlug }) {
  const category = MENU.find((item) => item.slug === slug)!
  usePageTitle(category.title)

  return (
    <section className="page-section">
      <Link to="/menu" className="back-link">
        &larr; Volver al menú
      </Link>
      <h2>{category.title.toUpperCase()}</h2>
      <div className="menu-grid">
        {category.items.map((item) => (
          <div key={item.name} className="menu-card">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
