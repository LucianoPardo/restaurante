import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { gql } from '../../api/client'
import type { Supply } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatMoney } from '../../utils/format'

// Una sola consulta trae los insumos (filtrados) y la lista de categorías.
// Con REST eran dos peticiones distintas.
const SUPPLIES_PAGE = /* GraphQL */ `
  query SuppliesPage($category: String) {
    supplies(category: $category) {
      id
      name
      category
      quantity
      price
    }
    supplyCategories
  }
`

const REMOVE_SUPPLY = /* GraphQL */ `
  mutation RemoveSupply($id: Int!) {
    removeSupply(id: $id) {
      message
    }
  }
`

// Antes: templates/supplies/get_supplies.html
export function SuppliesPage() {
  usePageTitle('Listado de Insumos')
  // La categoría elegida vive en la URL (?category=Bebidas), igual que en Flask
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')
  const [categories, setCategories] = useState<string[]>([])
  const [supplies, setSupplies] = useState<Supply[] | null>(null)
  const { flash, showSuccess, showError } = useFlash()

  // Cambia cada vez que cambia la categoría...
  const loadSupplies = useCallback(() => {
    gql<{ supplies: Supply[]; supplyCategories: string[] }>(SUPPLIES_PAGE, { category })
      .then((data) => {
        setSupplies(data.supplies)
        setCategories(data.supplyCategories)
      })
      .catch(showError)
  }, [category, showError])

  // ...y entonces este efecto se vuelve a ejecutar y pide la lista filtrada
  useEffect(() => {
    loadSupplies()
  }, [loadSupplies])

  function selectCategory(value: string | null) {
    setSearchParams(value ? { category: value } : {})
  }

  async function handleDelete(supply: Supply) {
    if (!confirm(`¿Estás seguro de que quieres eliminar ${supply.name}?`)) {
      return
    }
    try {
      await gql(REMOVE_SUPPLY, { id: supply.id })
      showSuccess('Insumo eliminado.')
      loadSupplies()
    } catch (error) {
      showError(error)
    }
  }

  return (
    <div className="supplies-page">
      <div className="container">
        <Link className="btn comeback" to="/admin">
          &larr; Volver
        </Link>
        <h1>Listado de Insumos</h1>

        <FlashMessages flash={flash} />

        <div className="categorias">
          <div className="category-buttons">
            <button type="button" className={category ? '' : 'activo'} onClick={() => selectCategory(null)}>
              Todos
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? 'activo' : ''}
                onClick={() => selectCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <Link className="btn create" to="/admin/insumos/nuevo">
          + Agregar Nuevo Insumo
        </Link>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Precio de Compra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {supplies?.map((supply) => (
              <tr key={supply.id}>
                <td>{supply.id}</td>
                <td>{supply.name}</td>
                <td>{supply.category}</td>
                <td>{supply.quantity}</td>
                <td>{formatMoney(supply.price)}</td>
                <td>
                  <Link className="btn edit" to={`/admin/insumos/${supply.id}/editar`}>
                    Editar
                  </Link>
                  <button type="button" className="btn delete" onClick={() => handleDelete(supply)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {supplies?.length === 0 && (
              <tr className="empty-row">
                <td colSpan={6}>No hay insumos en esta categoría.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
