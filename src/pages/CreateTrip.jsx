import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  User,
  Sparkles,
  ShieldCheck,
  Fuel,
  IndianRupee,
  Gauge,
  BrainCircuit,
  CircleCheck,
  AlertTriangle,
} from 'lucide-react'

import {
  addTrip,
  updateVehicleStatus,
  updateDriverStatus,
} from '../services/tripService'

import { runAutopilot } from '../services/autopilotService'

function CreateTrip() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    cargo_weight: '',
    planned_distance: '',
    revenue: '',
  })

  const [autopilotResult, setAutopilotResult] = useState(null)
  const [runningAutopilot, setRunningAutopilot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setAutopilotResult(null)
  }

  async function handleRunAutopilot() {
    try {
      setError('')
      setAutopilotResult(null)

      if (
        !formData.source ||
        !formData.destination ||
        !formData.cargo_weight ||
        !formData.planned_distance ||
        !formData.revenue
      ) {
        setError(
          'Please fill all trip details before running Autopilot.'
        )
        return
      }

      setRunningAutopilot(true)

      const result = await runAutopilot(formData)

      setAutopilotResult(result)
    } catch (err) {
      console.error('Autopilot Error:', err)
      setError(err.message)
    } finally {
      setRunningAutopilot(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setError('')

      if (!autopilotResult) {
        setError(
          'Please run TransitOps Autopilot before dispatching the trip.'
        )
        return
      }

      if (autopilotResult.decision === 'HIGH RISK') {
        setError(
          'This trip is marked as HIGH RISK and cannot be automatically dispatched.'
        )
        return
      }

      setLoading(true)

      const selectedVehicle =
        autopilotResult.recommendedVehicle

      const selectedDriver =
        autopilotResult.recommendedDriver

      const newTrip = {
        source: formData.source,
        destination: formData.destination,
        vehicle_id: selectedVehicle.id,
        driver_id: selectedDriver.id,
        cargo_weight: Number(formData.cargo_weight),
        planned_distance: Number(formData.planned_distance),
        revenue: Number(formData.revenue),
        status: 'Dispatched',
      }

      await addTrip(newTrip)

      await updateVehicleStatus(
        selectedVehicle.id,
        'On Trip'
      )

      await updateDriverStatus(
        selectedDriver.id,
        'On Trip'
      )

      navigate('/trips')
    } catch (err) {
      console.error('Error dispatching trip:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getDecisionStyle(decision) {
    if (decision === 'RECOMMENDED') {
      return 'border-green-900/50 bg-green-950/20 text-green-400'
    }

    if (decision === 'REVIEW REQUIRED') {
      return 'border-yellow-900/50 bg-yellow-950/20 text-yellow-400'
    }

    return 'border-red-900/50 bg-red-950/20 text-red-400'
  }

  function getDecisionIcon(decision) {
    if (decision === 'RECOMMENDED') {
      return CircleCheck
    }

    return AlertTriangle
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/trips')}
        className="mb-6 flex items-center gap-2 text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Trips
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          TransitOps Autopilot
        </h1>

        <p className="mt-2 text-slate-400">
          Intelligent fleet decision engine for optimized trip dispatch
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Trip Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Enter trip details for intelligent analysis
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Source
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Ahmedabad"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Destination
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Surat"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Cargo Weight (kg)
              </label>

              <div className="relative">
                <Package className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="number"
                  name="cargo_weight"
                  value={formData.cargo_weight}
                  onChange={handleChange}
                  placeholder="1500"
                  min="1"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Planned Distance (km)
              </label>

              <input
                type="number"
                name="planned_distance"
                value={formData.planned_distance}
                onChange={handleChange}
                placeholder="270"
                min="1"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Expected Revenue (₹)
              </label>

              <input
                type="number"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="25000"
                min="1"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-900/50 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <BrainCircuit className="h-6 w-6 text-blue-400" />
                Autopilot Decision Engine
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Analyze safety, capacity, operating cost and profitability
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunAutopilot}
              disabled={runningAutopilot}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />

              {runningAutopilot
                ? 'Analyzing Trip...'
                : 'Run Autopilot'}
            </button>
          </div>

          {autopilotResult && (() => {
            const DecisionIcon = getDecisionIcon(
              autopilotResult.decision
            )

            return (
              <div className="mt-6">
                <div
                  className={`rounded-xl border p-5 ${getDecisionStyle(
                    autopilotResult.decision
                  )}`}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                      <DecisionIcon className="h-7 w-7" />

                      <div>
                        <p className="text-sm opacity-80">
                          AUTOPILOT DECISION
                        </p>

                        <h3 className="text-2xl font-bold">
                          {autopilotResult.decision}
                        </h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm opacity-80">
                        Autopilot Score
                      </p>

                      <p className="text-3xl font-bold">
                        {autopilotResult.autopilotScore}
                        <span className="text-base font-normal">
                          /100
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5">
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-blue-400" />

                      <div>
                        <p className="text-sm text-slate-400">
                          Recommended Vehicle
                        </p>

                        <h3 className="font-semibold text-white">
                          {
                            autopilotResult.recommendedVehicle
                              .vehicle_name
                          }
                        </h3>

                        <p className="text-sm text-slate-400">
                          {
                            autopilotResult.recommendedVehicle
                              .registration_number
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5">
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-blue-400" />

                      <div>
                        <p className="text-sm text-slate-400">
                          Recommended Driver
                        </p>

                        <h3 className="font-semibold text-white">
                          {
                            autopilotResult.recommendedDriver
                              .name
                          }
                        </h3>

                        <p className="text-sm text-slate-400">
                          Safety Score:{' '}
                          {autopilotResult.analysis.safetyScore}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                    <Gauge className="h-5 w-5 text-blue-400" />

                    <p className="mt-3 text-sm text-slate-400">
                      Capacity Usage
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      {autopilotResult.analysis.capacityUtilization}%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                    <Fuel className="h-5 w-5 text-blue-400" />

                    <p className="mt-3 text-sm text-slate-400">
                      Estimated Cost
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      ₹
                      {autopilotResult.analysis.estimatedTotalCost.toLocaleString(
                        'en-IN'
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                    <IndianRupee className="h-5 w-5 text-green-400" />

                    <p className="mt-3 text-sm text-slate-400">
                      Expected Profit
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-400">
                      ₹
                      {autopilotResult.analysis.expectedProfit.toLocaleString(
                        'en-IN'
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />

                    <p className="mt-3 text-sm text-slate-400">
                      Trip Risk
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">
                      {autopilotResult.tripRiskScore}%
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/30 p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <BrainCircuit className="h-5 w-5 text-blue-400" />
                    Explainable Decision Analysis
                  </h3>

                  <div className="mt-4 space-y-3">
                    {autopilotResult.explanation.map(
                      (reason, index) => (
                        <div
                          key={`${reason}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                          <p className="text-sm leading-6 text-slate-400">
                            {reason}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !autopilotResult}
            className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Dispatching Trip...'
              : 'Approve & Dispatch Trip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTrip