import { useEffect, useState } from 'react'
import {
  Plus,
  Route,
  CircleCheck,
  ShieldAlert,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  getTrips,
  completeTrip,
} from '../services/tripService'

import CrisisCommander from '../components/CrisisCommander'

function Trips() {
  const navigate = useNavigate()

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [completingTripId, setCompletingTripId] =
    useState(null)

  const [selectedCrisisTrip, setSelectedCrisisTrip] =
    useState(null)

  useEffect(() => {
    loadTrips()
  }, [])

  async function loadTrips() {
    try {
      setLoading(true)
      setError('')

      const data = await getTrips()

      setTrips(data || [])
    } catch (err) {
      console.error('Error loading trips:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCompleteTrip(trip) {
    const confirmed = window.confirm(
      `Are you sure you want to complete the trip from ${trip.source} to ${trip.destination}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setCompletingTripId(trip.id)
      setError('')

      await completeTrip(trip)

      if (selectedCrisisTrip?.id === trip.id) {
        setSelectedCrisisTrip(null)
      }

      await loadTrips()
    } catch (err) {
      console.error('Error completing trip:', err)
      setError(err.message)
    } finally {
      setCompletingTripId(null)
    }
  }

  // FIXED:
  // Refresh trip data without activating the main loading state.
  // This keeps CrisisCommander mounted so its success message remains visible.
  async function handleRecoveryComplete() {
    try {
      setError('')

      const data = await getTrips()

      const updatedTrips = data || []

      setTrips(updatedTrips)

      // Keep CrisisCommander open and update the selected
      // trip with the latest Supabase data.
      setSelectedCrisisTrip((currentTrip) => {
        if (!currentTrip) {
          return null
        }

        const updatedTrip = updatedTrips.find(
          (trip) => trip.id === currentTrip.id
        )

        return updatedTrip || currentTrip
      })
    } catch (err) {
      console.error(
        'Error refreshing trips after AI recovery:',
        err
      )

      setError(err.message)
    }
  }

  function handleOpenCrisisCommander(trip) {
    setError('')

    setSelectedCrisisTrip((currentTrip) =>
      currentTrip?.id === trip.id ? null : trip
    )
  }

  function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-600/20 text-green-400'

      case 'dispatched':
        return 'bg-blue-600/20 text-blue-400'

      case 'draft':
        return 'bg-yellow-600/20 text-yellow-400'

      case 'cancelled':
        return 'bg-red-600/20 text-red-400'

      default:
        return 'bg-slate-600/20 text-slate-400'
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Trips
          </h1>

          <p className="mt-2 text-slate-400">
            Manage, monitor and recover fleet operations
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/trips/create')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Create Trip
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading trips...
        </div>
      )}

      {!loading && error && (
        <div className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && trips.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Route className="mx-auto h-12 w-12 text-slate-500" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No trips found
          </h2>

          <p className="mt-2 text-slate-400">
            Create your first trip to start managing fleet
            operations.
          </p>
        </div>
      )}

      {!loading && trips.length > 0 && (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-800 bg-slate-950/40">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Route
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Driver
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Cargo
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Distance
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {trips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-b border-slate-800 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {trip.source}
                        </div>

                        <div className="mt-1 text-sm text-slate-400">
                          → {trip.destination}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {trip.vehicles?.vehicle_name ||
                          'Not assigned'}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {trip.drivers?.name ||
                          'Not assigned'}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {trip.cargo_weight || 0} kg
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {trip.planned_distance || 0} km
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${getStatusStyle(
                            trip.status
                          )}`}
                        >
                          {trip.status || 'Draft'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {trip.status === 'Dispatched' ? (
                          <div className="flex min-w-max gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenCrisisCommander(
                                  trip
                                )
                              }
                              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              {selectedCrisisTrip?.id ===
                              trip.id ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <ShieldAlert className="h-4 w-4" />
                              )}

                              {selectedCrisisTrip?.id ===
                              trip.id
                                ? 'Close Crisis'
                                : 'Crisis Commander'}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleCompleteTrip(trip)
                              }
                              disabled={
                                completingTripId === trip.id
                              }
                              className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CircleCheck className="h-4 w-4" />

                              {completingTripId === trip.id
                                ? 'Completing...'
                                : 'Complete Trip'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedCrisisTrip && (
            <CrisisCommander
              trip={selectedCrisisTrip}
              onRecoveryComplete={handleRecoveryComplete}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Trips