export type User = {
  id: string
  displayName: string
  email: string
  teamCode: string
  role: 'OPERATOR'
}

export type LoginResponse = {
  token: string
  expiresAt: string
  user: User
}

export type DashboardSummary = {
  totalTropels: number
  criticalTropels: number
  openSignals: number
  sectorStabilityAvg: number
  signalsBySeverity: {
    LEVE: number
    MODERADO: number
    GRAVE: number
    CRITICO: number
  }
  generatedAt: string
}

export type ApiErrorResponse = {
  error: string
  message: string
  timestamp: string
  path: string
  details: Record<string, unknown>
}

export type LoginForm = {
  teamCode: string
  email: string
  password: string
}
