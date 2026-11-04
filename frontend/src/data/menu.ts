// Contenido de las plantillas platos.html, bebidas.html, postres.html y ensaladas.html.
// El menú no está en la base de datos (tampoco lo estaba en Flask).

export type MenuSlug = 'platos' | 'bebidas' | 'postres' | 'ensaladas'

export interface MenuItem {
  name: string
  image: string
}

export interface MenuCategory {
  slug: MenuSlug
  title: string
  cover: string
  items: MenuItem[]
}

export const MENU: MenuCategory[] = [
  {
    slug: 'platos',
    title: 'Platos',
    cover: '/img/platos/canelones.jpg',
    items: [
      { name: 'Canelones', image: '/img/platos/canelones.jpg' },
      { name: 'Hamburguesa', image: '/img/platos/Hamburguesa.jpg' },
      { name: 'Tallarines', image: '/img/platos/Tallarines.jpg' },
      { name: 'Pechugas con Puré de Papas', image: '/img/platos/Pechugas.jpg' },
    ],
  },
  {
    slug: 'bebidas',
    title: 'Bebidas',
    cover: '/img/bebidas/coca_cola.jpg',
    items: [
      { name: 'Agua', image: '/img/bebidas/agua.jpg' },
      { name: 'Coca Cola', image: '/img/bebidas/coca_cola.jpg' },
      { name: 'Fanta', image: '/img/bebidas/fanta.jpg' },
      { name: 'Sprite', image: '/img/bebidas/sprite.jpg' },
    ],
  },
  {
    slug: 'postres',
    title: 'Postres',
    cover: '/img/postres/flan.jpg',
    items: [
      { name: 'Flan', image: '/img/postres/flan.jpg' },
      { name: 'Helado', image: '/img/postres/helado.jpg' },
      { name: 'Torta', image: '/img/postres/torta.jpg' },
    ],
  },
  {
    slug: 'ensaladas',
    title: 'Ensaladas',
    cover: '/img/ensaladas/ensalada.jpg',
    items: [
      { name: 'Ensalada verde', image: '/img/ensaladas/ensalada.jpg' },
      { name: 'Ensalada Morada', image: '/img/ensaladas/ensalada2.jpg' },
    ],
  },
]
