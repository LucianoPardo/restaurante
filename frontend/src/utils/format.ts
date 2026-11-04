// Fecha de hoy como "AAAA-MM-DD" en hora local (igual que el backend)
export function today() {
  return new Date().toLocaleDateString('en-CA')
}

// "2026-11-20" → "20/11/2026"
export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

const moneyFormat = new Intl.NumberFormat('es', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// 1500 → "$1500,00"
export function formatMoney(amount: number) {
  return `$${moneyFormat.format(amount)}`
}

// "2026-09" → "septiembre de 2026"
export function formatMonth(yearMonth: string) {
  const [year, month] = yearMonth.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('es', { month: 'long', year: 'numeric' })
}
