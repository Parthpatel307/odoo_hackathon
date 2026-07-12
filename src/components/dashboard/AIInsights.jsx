import { useEffect, useState } from 'react'
import {
  BrainCircuit,
  Activity,
  AlertTriangle,
  CircleCheck,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFleetInsights } from '../../services/insightService'

function AIInsights() {
  const navigate = useNavigate()

  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadInsights()
  }, [])

  async function loadInsights() {
    try {
      setLoading(true)
      setError('')

      const data = await getFleetInsights()

      setInsights(data)
    } catch (err) {
      console.error('Error loading fleet insights:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getScoreStyle(score) {
    if (score >= 80) {
      return 'text-green-400'
    }

    if (score >= 60) {
      return 'text-yellow-400'
    }

    return 'text-red-400'
  }

  function getScoreLabel(score) {
    if (score >= 80) {
      return 'Healthy'
    }

    if (score >= 60) {
      return 'Needs Attention'
    }

    return 'Critical'
  }

  function getAlertIcon(type) {
    if (type === 'success') {
      return CircleCheck
    }

    if (type === 'critical') {
      return ShieldAlert
    }

    return AlertTriangle
  }

  function getAlertStyle(type) {
    if (type === 'success') {
      return 'border-green-900/50 bg-green-950/20'
    }

    if (type === 'critical') {
      return 'border-red-900/50 bg-red-950/20'
    }

    return 'border-yellow-900/50 bg-yellow-950/20'
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex min-h-48 items-center justify-center text-slate-400">
          Analyzing fleet operations...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
        Error loading AI insights: {error}
      </div>
    )
  }

  if (!insights) {
    return null
  }

  return (
    <div className="rounded-xl border border-blue-900/50 bg-slate-900 p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600/20 p-3">
            <BrainCircuit className="h-6 w-6 text-blue-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              AI Fleet Command Center
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Intelligent operational insights and recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3">
          <Activity className="h-5 w-5 text-blue-400" />

          <div>
            <p className="text-xs text-slate-400">
              Fleet Health
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getScoreStyle(
                  insights.fleetHealthScore
                )}`}
              >
                {insights.fleetHealthScore}
              </span>

              <span className="text-sm text-slate-500">
                / 100
              </span>
            </div>

            <p
              className={`text-xs ${getScoreStyle(
                insights.fleetHealthScore
              )}`}
            >
              {getScoreLabel(insights.fleetHealthScore)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />

            <h3 className="font-semibold text-white">
              Smart Alerts
            </h3>
          </div>

          <div className="space-y-3">
            {insights.alerts.map((alert, index) => {
              const Icon = getAlertIcon(alert.type)

              return (
                <div
                  key={`${alert.title}-${index}`}
                  className={`rounded-lg border p-4 ${getAlertStyle(
                    alert.type
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />

                    <div>
                      <h4 className="font-medium text-white">
                        {alert.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-400" />

            <h3 className="font-semibold text-white">
              Smart Recommendations
            </h3>
          </div>

          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div
                key={`${recommendation.title}-${index}`}
                className="rounded-lg border border-slate-800 bg-slate-950/30 p-4"
              >
                <h4 className="font-medium text-white">
                  {recommendation.title}
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {recommendation.message}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(recommendation.path)}
                  className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  {recommendation.action}

                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsights