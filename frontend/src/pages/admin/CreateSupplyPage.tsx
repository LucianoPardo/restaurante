import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { gql } from '../../api/client'
import { FlashMessages } from '../../components/FlashMessages'
import { flashState, useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'

const SUPPLY_CATEGORIES = /* GraphQL */ `
  query SupplyCategories {
    supplyCategories
  }
`

const CREATE_SUPPLY = /* GraphQL */ `
  mutation CreateSupply($input: CreateSupplyInput!) {
    createSupply(input: $input) {
      id
    }
  }
`

// Antes: templates/supplies/create_supplies.html
export function CreateSupplyPage() {
  usePageTitle('Crear Insumo')
  const navigate = useNavigate()
  const { flash, showError } = useFlash()
  const [categories, setCategories] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', category: '', quantity: '', price: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    gql<{ supplyCategories: string[] }>(SUPPLY_CATEGORIES)
      .then(({ supplyCategories }) => {
        setCategories(supplyCategories)
        setForm((current) => ({ ...current, category: current.category || supplyCategories[0] }))
      })
      .catch(showError)
  }, [showError])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      // Los <input> devuelven texto: la API espera números
      await gql(CREATE_SUPPLY, {
        input: {
          name: form.name,
          category: form.category,
          quantity: Number(form.quantity),
          price: Number(form.price),
        },
      })
      navigate('/admin/insumos', { state: flashState('success', 'Insumo añadido.') })
    } catch (error) {
      showError(error)
      setSaving(false)
    }
  }

  return (
    <div className="create-supplies-page">
      <div className="form-wrapper">
        <FlashMessages flash={flash} className="flash-container" />

        <form onSubmit={handleSubmit}>
          <h2>Crear Insumo</h2>

          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            required
          />

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

          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            min="0"
            step="1"
            value={form.quantity}
            onChange={(event) => update('quantity', event.target.value)}
            required
          />

          <label htmlFor="price">Precio:</label>
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
              {saving ? 'Creando...' : 'Crear'}
            </button>
            <Link to="/admin/insumos">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
