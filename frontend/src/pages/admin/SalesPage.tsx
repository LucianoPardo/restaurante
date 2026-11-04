import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { gql } from '../../api/client'
import type { MonthlySales, Sale } from '../../api/types'
import { FlashMessages } from '../../components/FlashMessages'
import { useFlash } from '../../hooks/useFlash'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatDate, formatMoney, formatMonth, today } from '../../utils/format'

// Chart.js solo incluye las piezas que se registran
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// Los datos del gráfico y la lista de ventas, en una sola consulta
const SALES_PAGE = /* GraphQL */ `
  query SalesPage {
    monthlySales {
      labels
      data
    }
    sales {
      id
      fecha
      monto
    }
  }
`

const CREATE_SALE = /* GraphQL */ `
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      id
    }
  }
`

const REMOVE_SALE = /* GraphQL */ `
  mutation RemoveSale($id: Int!) {
    removeSale(id: $id) {
      message
    }
  }
`

// Antes: templates/charts/charts.html. Ahora además se pueden cargar y borrar ventas.
export function SalesPage() {
  usePageTitle('Gráfico de Ventas')
  const [summary, setSummary] = useState<MonthlySales>({ labels: [], data: [] })
  const [sales, setSales] = useState<Sale[]>([])
  const [fecha, setFecha] = useState(today())
  const [monto, setMonto] = useState('')
  const [saving, setSaving] = useState(false)
  const { flash, showSuccess, showError } = useFlash()

  const loadData = useCallback(() => {
    gql<{ monthlySales: MonthlySales; sales: Sale[] }>(SALES_PAGE)
      .then((data) => {
        setSummary(data.monthlySales)
        setSales(data.sales)
      })
      .catch(showError)
  }, [showError])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      await gql(CREATE_SALE, { input: { fecha, monto: Number(monto) } })
      showSuccess('Venta registrada.')
      setMonto('')
      loadData()
    } catch (error) {
      showError(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(sale: Sale) {
    if (!confirm(`¿Eliminar la venta del ${formatDate(sale.fecha)} por ${formatMoney(sale.monto)}?`)) {
      return
    }
    try {
      await gql(REMOVE_SALE, { id: sale.id })
      showSuccess('Venta eliminada.')
      loadData()
    } catch (error) {
      showError(error)
    }
  }

  const chartData = {
    labels: summary.labels.map(formatMonth),
    datasets: [
      {
        label: 'Monto de Ventas',
        data: summary.data,
        borderWidth: 2,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  }

  return (
    <div className="charts-page">
      <Link className="btn comeback" to="/admin">
        &larr; Volver
      </Link>

      <h2>Gráfico de Ventas por Mes</h2>
      <FlashMessages flash={flash} />

      <div className="chart-box">
        <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
        {summary.labels.length === 0 && <p className="empty">Todavía no hay ventas registradas.</p>}
      </div>

      <div className="sales-panel">
        <form className="sale-form" onSubmit={handleSubmit}>
          <h3>Registrar venta</h3>
          <label>
            Fecha
            <input
              type="date"
              max={today()}
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              required
            />
          </label>
          <label>
            Monto
            <input
              type="number"
              step="any"
              min="0"
              value={monto}
              onChange={(event) => setMonto(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        <table className="sales-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{formatDate(sale.fecha)}</td>
                <td>{formatMoney(sale.monto)}</td>
                <td>
                  <button type="button" className="delete" onClick={() => handleDelete(sale)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
