import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessages, gql } from '../../api/client'
import type { Supply } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { flashState, useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

// El insumo y las categorías en una sola consulta (antes eran dos peticiones con Promise.all)
const EDIT_SUPPLY = /* GraphQL */ `
  query EditSupply($id: Int!) {
    supply(id: $id) {
      name
      category
      quantity
      price
    }
    supplyCategories
  }
`

const UPDATE_SUPPLY = /* GraphQL */ `
  mutation UpdateSupply($id: Int!, $input: UpdateSupplyInput!) {
    updateSupply(id: $id, input: $input) {
      id
    }
  }
`

interface SupplyForm {
  name: string
  category: string
  quantity: string
  price: string
}

// Antes: templates/supplies/update_supplies.html
export function EditSupplyPage() {
  usePageTitle('Editar Insumo')
  const { id } = useParams()
  const navigate = useNavigate()
  const { flash, showError } = useFlash()
  const [categories, setCategories] = useState<string[]>([])
  const [form, setForm] = useState<SupplyForm | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    gql<{ supply: Omit<Supply, 'id'>; supplyCategories: string[] }>(EDIT_SUPPLY, { id: Number(id) })
      .then(({ supply, supplyCategories }) => {
        setCategories(supplyCategories)
        setForm({
          name: supply.name,
          category: supply.category,
          quantity: String(supply.quantity),
          price: String(supply.price),
        })
      })
      .catch((error) => navigate('/admin/insumos', { state: flashState('error', errorMessages(error)[0]) }))
  }, [id, navigate])

  function update(field: keyof SupplyForm, value: string) {
    setForm((current) => current && { ...current, [field]: value })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form) {
      return
    }
    setSaving(true)
    try {
      await gql(UPDATE_SUPPLY, {
        id: Number(id),
        input: {
          name: form.name,
          category: form.category,
          quantity: Number(form.quantity),
          price: Number(form.price),
        },
      })
      navigate('/admin/insumos', { state: flashState('success', 'Insumo actualizado.') })
    } catch (error) {
      showError(error)
      setSaving(false)
    }
  }

  if (!form) {
    return <p className="page-loading">Cargando...</p>
  }

  return (
    <div className="edit-supply-page">
      <form onSubmit={handleSubmit}>
        <h2>Editar Insumo</h2>
        <FlashMessages flash={flash} className="flash-container" />

        <label htmlFor="name">Nombre del Insumo</label>
        <input
          type="text"
          id="name"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          required
        />

        {/* En Flask la categoría no venía marcada y al guardar volvía a "Bebidas" */}
        <label htmlFor="category">Categoría:</label>
        <select
          id="category"
          value={form.category}
          onChange={(event) => update('category', event.target.value)}
          required
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label htmlFor="quantity">Cantidad</label>
        <input
          type="number"
          id="quantity"
          min="0"
          step="1"
          value={form.quantity}
          onChange={(event) => update('quantity', event.target.value)}
          required
        />

        <label htmlFor="price">Precio</label>
        <input
          type="number"
          id="price"
          step="any"
          min="0"
          value={form.price}
          onChange={(event) => update('price', event.target.value)}
          required
        />

        <div className="button-group">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <Link to="/admin/insumos">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
