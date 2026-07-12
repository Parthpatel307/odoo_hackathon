import { useEffect, useState } from 'react'
import { Plus, Truck, X } from 'lucide-react'
import {
  getVehicles,
  addVehicle,
} from '../services/vehicleService'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    registration_number: '',
    vehicle_name: '',
    vehicle_type: '',
    max_load_capacity: '',
    odometer: '',
    acquisition_cost: '',
    status: 'Available',
  })

  useEffect(() => {
    loadVehicles()
  }, [])

  async function loadVehicles() {
    try {
      setLoading(true)
      setError('')

      const data = await getVehicles()
      setVehicles(data || [])
    } catch (err) {
      console.error('Error loading vehicles:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  function resetForm() {
    setFormData({
      registration_number: '',
      vehicle_name: '',
      vehicle_type: '',
      max_load_capacity: '',
      odometer: '',
      acquisition_cost: '',
      status: 'Available',
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      const newVehicle = await addVehicle({
        registration_number: formData.registration_number,
        vehicle_name: formData.vehicle_name,
        vehicle_type: formData.vehicle_type,
        max_load_capacity: Number(formData.max_load_capacity),
        odometer: Number(formData.odometer || 0),
        acquisition_cost: Number(formData.acquisition_cost || 0),
        status: formData.status,
      })

      setVehicles((previousVehicles) => [
        newVehicle,
        ...previousVehicles,
      ])

      resetForm()
      setShowForm(false)
    } catch (err) {
      console.error('Error adding vehicle:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Vehicles
          </h1>

          <p className="mt-2 text-slate-400">
            Manage and monitor your fleet vehicles
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Vehicle
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Add New Vehicle
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Enter the vehicle information below
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  required
                  placeholder="GJ-01-AB-1234"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Vehicle Name
                </label>

                <input
                  type="text"
                  name="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={handleChange}
                  required
                  placeholder="Tata Ace"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Vehicle Type
                </label>

                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Trailer">Trailer</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Maximum Load Capacity
                </label>

                <input
                  type="number"
                  name="max_load_capacity"
                  value={formData.max_load_capacity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="2500"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Odometer
                </label>

                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  min="0"
                  placeholder="50000"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Acquisition Cost
                </label>

                <input
                  type="number"
                  name="acquisition_cost"
                  value={formData.acquisition_cost}
                  onChange={handleChange}
                  min="0"
                  placeholder="800000"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Adding Vehicle...' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading vehicles...
        </div>
      )}

      {!loading && error && (
        <div className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Truck className="mx-auto h-12 w-12 text-slate-500" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No vehicles found
          </h2>

          <p className="mt-2 text-slate-400">
            Add your first vehicle to start managing your fleet.
          </p>
        </div>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Registration
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Capacity
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-slate-800 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-white">
                      {vehicle.registration_number}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {vehicle.vehicle_name}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {vehicle.vehicle_type}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {vehicle.max_load_capacity}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vehicles