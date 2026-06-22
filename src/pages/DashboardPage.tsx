import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../api'
import { StatusMessage } from '../components/StatusMessage'
import { useAuth } from '../context/AuthContext'
import type { DashboardSummary } from '../types'

export function DashboardPage() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadSummary() {
      if (!token) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await getDashboardSummary(token)
        if (active) {
          setSummary(data)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar el dashboard')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadSummary()

    return () => {
      active = false
    }
  }, [token])

  if (loading) {
    return <StatusMessage title="Cargando dashboard" text="Consultando indicadores reales." />
  }

  if (error) {
    return <StatusMessage title="No se pudo cargar" text={error} />
  }

  if (!summary) {
    return <StatusMessage title="Sin datos" text="Todavia no hay indicadores disponibles." />
  }

  const cards = [
    { label: 'Tropeles', value: summary.totalTropels },
    { label: 'Criticos', value: summary.criticalTropels },
    { label: 'Senales abiertas', value: summary.openSignals },
    { label: 'Estabilidad promedio', value: `${summary.sectorStabilityAvg}%` },
  ]

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-stone-600">Generado: {summary.generatedAt}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-md border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-600">{card.label}</p>
            <strong className="mt-2 block text-3xl">{card.value}</strong>
          </article>
        ))}
      </div>

      <article className="rounded-md border border-stone-200 bg-white p-5">
        <h3 className="font-semibold">Senales por severidad</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {Object.entries(summary.signalsBySeverity).map(([label, value]) => (
            <div key={label} className="rounded-md bg-stone-100 p-3">
              <p className="text-xs font-semibold text-stone-500">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
