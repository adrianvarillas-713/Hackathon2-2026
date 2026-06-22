import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [teamCode, setTeamCode] = useState('')
  const [email, setEmail] = useState('operator@tuckersoft.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ teamCode, email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          TropelCare
        </p>
        <h1 className="mt-2 text-2xl font-bold">Ingreso de operador</h1>
        <p className="mt-2 text-sm text-stone-600">
          Usa las credenciales asignadas por el equipo docente.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium">Team code</span>
            <input
              value={teamCode}
              onChange={(event) => setTeamCode(event.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700"
              placeholder="TEAM-001"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700"
              required
            />
          </label>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}
