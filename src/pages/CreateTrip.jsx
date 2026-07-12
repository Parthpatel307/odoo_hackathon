import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  User,
  Sparkles,
} from 'lucide-react'

import {
  addTrip,
  getAvailableVehicles,
  getAvailableDrivers,
  updateVehicleStatus,
  updateDriverStatus,
} from '../services/tripService'

function CreateTrip() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    cargo_weight: '',
    planned_distance: '',
    revenue: '',
  })

  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])

  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [selectedDriver, setSelectedDriver] = useState('')

  const [loading, setLoading] = useState(false)
  const [findingMatch, setFindingMatch] = useState(false)
  const [error, setError] = useState('')
  const [recommendationFound, setRecommendationFound] = useState(false)

  useEffect(() => {
    loadDrivers()
  }, [])

  async function loadDrivers() {
    try {
      const data = await getAvailableDrivers()
      setDrivers(data || [])
    } catch (err) {
      console.error('Error loading drivers:', err)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    if (name === 'cargo_weight') {
      setRecommendationFound(false)
      setSelectedVehicle('')
      setSelectedDriver('')
    }
  }

  async function handleSmartDispatch() {
    try {
      setError('')

      if (!formData.cargo_weight) {
        setError('Please enter cargo weight first.')
        return
      }

      setFindingMatch(true)

      const vehicleData = await getAvailableVehicles(
        Number(formData.cargo_weight)
      )

      const driverData = await getAvailableDrivers()

      setVehicles(vehicleData || [])
      setDrivers(driverData || [])

      if (!vehicleData || vehicleData.length === 0) {
        setError(
          'No available vehicle can carry this cargo weight.'
        )
        setRecommendationFound(false)
        return
      }

      if (!driverData || driverData.length === 0) {
        setError('No available driver found.')
        setRecommendationFound(false)
        return
      }

      setSelectedVehicle(vehicleData[0].id)
      setSelectedDriver(driverData[0].id)
      setRecommendationFound(true)
    } catch (err) {
      console.error('Smart Dispatch Error:', err)
      setError(err.message)
    } finally {
      setFindingMatch(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setError('')

      if (
        !formData.source ||
        !formData.destination ||
        !formData.cargo_weight ||
        !formData.planned_distance ||
        !formData.revenue
      ) {
        setError('Please fill all trip details.')
        return
      }

      if (!selectedVehicle || !selectedDriver) {
        setError(
          'Please use Smart Dispatch to select a vehicle and driver.'
        )
        return
      }

      setLoading(true)

      const newTrip = {
        source: formData.source,
        destination: formData.destination,
        vehicle_id: selectedVehicle,
        driver_id: selectedDriver,
        cargo_weight: Number(formData.cargo_weight),
        planned_distance: Number(formData.planned_distance),
        revenue: Number(formData.revenue),
        status: 'Dispatched',
      }

      await addTrip(newTrip)

      await updateVehicleStatus(
        selectedVehicle,
        'On Trip'
      )

      await updateDriverStatus(
        selectedDriver,
        'On Trip'
      )

      navigate('/trips')
    } catch (err) {
      console.error('Error creating trip:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const recommendedVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicle
  )

  const recommendedDriver = drivers.find(
    (driver) => driver.id === selectedDriver
  )

  return (
    <div>
      <button
        onClick={() => navigate('/trips')}
        className="mb-6 flex items-center gap-2 text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Trips
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Create New Trip
        </h1>

        <p className="mt-2 text-slate-400">
          Create a trip and use Smart Dispatch to assign the best vehicle and driver
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
            Enter the delivery and cargo details
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
                min="0"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Smart Dispatch
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Automatically find the best available vehicle and driver
              </p>
            </div>

            <button
              type="button"
              onClick={handleSmartDispatch}
              disabled={findingMatch}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {findingMatch
                ? 'Finding Best Match...'
                : 'Find Best Match'}
            </button>
          </div>

          {recommendationFound && (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-blue-900 bg-blue-950/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-600/20 p-3">
                    <Truck className="h-6 w-6 text-blue-400" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Recommended Vehicle
                    </p>

                    <h3 className="font-semibold text-white">
                      {recommendedVehicle?.vehicle_name}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {recommendedVehicle?.registration_number}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-300">
                  Capacity: {recommendedVehicle?.max_load_capacity} kg
                </p>
              </div>

              <div className="rounded-xl border border-blue-900 bg-blue-950/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-600/20 p-3">
                    <User className="h-6 w-6 text-blue-400" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Recommended Driver
                    </p>

                    <h3 className="font-semibold text-white">
                      {recommendedDriver?.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {recommendedDriver?.license_number}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-300">
                  Safety Score: {recommendedDriver?.safety_score}
                </p>
              </div>
            </div>
          )}
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
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTrip