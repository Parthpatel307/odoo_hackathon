import { useState } from 'react'
import {
  AlertTriangle,
  BrainCircuit,
  Truck,
  User,
  Clock,
  IndianRupee,
  ShieldAlert,
  Zap,
  CircleCheck,
  X,
} from 'lucide-react'

import {
  analyzeFleetCrisis,
  executeRecoveryPlan,
} from '../services/crisisService'

function CrisisCommander({ trip, onRecoveryComplete }) {
  const [crisisType, setCrisisType] = useState('vehicle_breakdown')
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleAnalyzeCrisis() {
    try {
      setAnalyzing(true)
      setError('')
      setSuccess('')
      setAnalysis(null)

      const result = await analyzeFleetCrisis(
        trip,
        crisisType
      )

      setAnalysis(result)
    } catch (err) {
      console.error('Crisis Analysis Error:', err)
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

async function handleExecuteRecovery() {
  if (!analysis) {
    return
  }

  const confirmed = window.confirm(
    'Execute this AI recovery plan? This will update fleet resources.'
  )

  if (!confirmed) {
    return
  }

  try {
    setExecuting(true)
    setError('')
    setSuccess('')

    await executeRecoveryPlan(
      trip,
      crisisType,
      analysis
    )

    let successMessage =
      '⚡ AI Recovery Plan Executed Successfully — Fleet operations updated.'

    if (crisisType === 'traffic_delay') {
      successMessage =
        '⚡ AI Recovery Plan Executed Successfully — Traffic recovery strategy activated and fleet operations updated.'
    } else if (crisisType === 'vehicle_breakdown') {
      successMessage =
        '⚡ AI Recovery Plan Executed Successfully — Replacement vehicle assigned and fleet resources updated.'
    } else if (crisisType === 'driver_unavailable') {
      successMessage =
        '⚡ AI Recovery Plan Executed Successfully — Emergency backup driver assigned and fleet operations updated.'
    } else if (crisisType === 'cargo_increase') {
      successMessage =
        '⚡ AI Recovery Plan Executed Successfully — Cargo reassigned to a suitable vehicle and fleet resources updated.'
    }

    setSuccess(successMessage)

  } catch (err) {
    console.error('Recovery Execution Error:', err)

    setError(
      err.message || 'Failed to execute AI recovery plan.'
    )
  } finally {
    setExecuting(false)
  }
}

  function getSeverityStyle(score) {
    if (score >= 75) {
      return 'text-red-400'
    }

    if (score >= 50) {
      return 'text-yellow-400'
    }

    return 'text-green-400'
  }

  function getRecoveryStyle(status) {
    if (status === 'CRITICAL') {
      return 'border-red-900/50 bg-red-950/20 text-red-400'
    }

    return 'border-green-900/50 bg-green-950/20 text-green-400'
  }

  function canExecuteRecovery() {
    if (!analysis) {
      return false
    }

    if (analysis.recoveryStatus === 'CRITICAL') {
      return false
    }

    if (
      crisisType === 'vehicle_breakdown' &&
      !analysis.replacementVehicle
    ) {
      return false
    }

    if (
      crisisType === 'driver_unavailable' &&
      !analysis.replacementDriver
    ) {
      return false
    }

    return true
  }

  return (
    <div className="mt-6 rounded-xl border border-red-900/40 bg-slate-900 p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-red-600/20 p-3">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              AI Fleet Crisis Commander
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Simulate operational disruptions and generate intelligent recovery plans
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Affected Trip: {trip.source} → {trip.destination}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={crisisType}
            onChange={(event) => {
              setCrisisType(event.target.value)
              setAnalysis(null)
              setError('')
              setSuccess('')
            }}
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-red-500"
          >
            <option value="vehicle_breakdown">
              Vehicle Breakdown
            </option>

            <option value="driver_unavailable">
              Driver Unavailable
            </option>

            <option value="traffic_delay">
              Severe Traffic Delay
            </option>

            <option value="cargo_increase">
              Unexpected Cargo Increase
            </option>
          </select>

          <button
            type="button"
            onClick={handleAnalyzeCrisis}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BrainCircuit className="h-5 w-5" />

            {analyzing
              ? 'Analyzing Crisis...'
              : 'Simulate Crisis'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-400">
          <X className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              Recovery Execution Failed
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-700 bg-green-950/40 p-5 text-green-400">
          <div className="rounded-full bg-green-500/20 p-2">
            <Zap className="h-5 w-5 shrink-0" />
          </div>

          <div>
            <p className="font-bold text-green-400">
              AI RECOVERY EXECUTION COMPLETE
            </p>

            <p className="mt-1 text-sm leading-6 text-green-300">
              {success}
            </p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-6">
          <div
            className={`rounded-xl border p-5 ${getRecoveryStyle(
              analysis.recoveryStatus
            )}`}
          >
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm opacity-80">
                  INCIDENT DETECTED
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  {analysis.crisisTitle}
                </h3>
              </div>

              <div className="flex gap-8">
                <div>
                  <p className="text-sm opacity-80">
                    Severity
                  </p>

                  <p
                    className={`text-3xl font-bold ${getSeverityStyle(
                      analysis.severityScore
                    )}`}
                  >
                    {analysis.severityScore}

                    <span className="text-base font-normal">
                      /100
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm opacity-80">
                    Recovery Score
                  </p>

                  <p className="text-3xl font-bold">
                    {analysis.recoveryScore}

                    <span className="text-base font-normal">
                      /100
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <Clock className="h-5 w-5 text-yellow-400" />

              <p className="mt-3 text-sm text-slate-400">
                Estimated Delay
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {analysis.estimatedDelayHours} hrs
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <IndianRupee className="h-5 w-5 text-red-400" />

              <p className="mt-3 text-sm text-slate-400">
                Additional Cost
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                ₹
                {analysis.additionalCost.toLocaleString(
                  'en-IN'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />

              <p className="mt-3 text-sm text-slate-400">
                Estimated Loss
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                ₹
                {analysis.estimatedLoss.toLocaleString(
                  'en-IN'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <Zap className="h-5 w-5 text-green-400" />

              <p className="mt-3 text-sm text-slate-400">
                Recovery Status
              </p>

              <p className="mt-1 text-sm font-bold text-green-400">
                {analysis.recoveryStatus}
              </p>
            </div>
          </div>

          {(analysis.replacementVehicle ||
            analysis.replacementDriver) && (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {analysis.replacementVehicle && (
                <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-5">
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-blue-400" />

                    <div>
                      <p className="text-sm text-slate-400">
                        AI Replacement Vehicle
                      </p>

                      <h3 className="font-semibold text-white">
                        {analysis.replacementVehicle.vehicle_name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {analysis.replacementVehicle.registration_number}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {analysis.replacementDriver && (
                <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-5">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-400" />

                    <div>
                      <p className="text-sm text-slate-400">
                        Emergency Backup Driver
                      </p>

                      <h3 className="font-semibold text-white">
                        {analysis.replacementDriver.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        Safety Score:{' '}
                        {analysis.replacementDriver.safety_score}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/30 p-5">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <BrainCircuit className="h-5 w-5 text-blue-400" />
              AI Recovery Strategy
            </h3>

            <div className="mt-4 space-y-3">
              {analysis.recoveryActions.map(
                (action, index) => (
                  <div
                    key={`${action}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <CircleCheck className="mt-1 h-4 w-4 shrink-0 text-blue-400" />

                    <p className="text-sm leading-6 text-slate-400">
                      {action}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleExecuteRecovery}
              disabled={
                executing ||
                !canExecuteRecovery() ||
                Boolean(success)
              }
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {success ? (
                <CircleCheck className="h-5 w-5" />
              ) : (
                <Zap className="h-5 w-5" />
              )}

              {executing
                ? 'Executing Recovery...'
                : success
                  ? 'Recovery Plan Executed'
                  : 'Execute AI Recovery Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrisisCommander