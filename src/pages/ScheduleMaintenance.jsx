import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getVehicles } from '../services/vehicleService'
import { addMaintenanceRecord } from '../services/maintenanceService'

function ScheduleMaintenance() {
  const navigate = useNavigate()

  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    vehicle_id: '',
    maintenance_type: '',
    description: '',
    cost: '',
    start_date: '',
    end_date: '',
    status: 'Active',
  })

  useEffect(() => {
    loadVehicles()
  }, [])

  async function loadVehicles() {
    try {
      setError('')

      const data = await getVehicles()
      setVehicles(data || [])
    } catch (err) {
      console.error('Error loading vehicles:', err)
      setError(err.message)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const maintenanceData = {
        vehicle_id: formData.vehicle_id,
        maintenance_type: formData.maintenance_type,
        description: formData.description,
        cost: Number(formData.cost),
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        status: formData.status,
      }

      await addMaintenanceRecord(maintenanceData)

      navigate('/maintenance')
    } catch (err) {
      console.error('Error scheduling maintenance:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/maintenance')}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Maintenance
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Schedule Maintenance
        </h1>

        <p className="mt-2 text-slate-400">
          Schedule vehicle maintenance and track service costs
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Vehicle
            </label>

            <select
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="">Select vehicle</option>

              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_name} - {vehicle.registration_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Maintenance Type
            </label>

            <select
              name="maintenance_type"
              value={formData.maintenance_type}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="">Select maintenance type</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Tyre Service">Tyre Service</option>
              <option value="Brake Service">Brake Service</option>
              <option value="Engine Service">Engine Service</option>
              <option value="General Service">General Service</option>
              <option value="Repair">Repair</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Cost (₹)
            </label>

            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              required
              placeholder="Enter maintenance cost"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Start Date
            </label>

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              End Date
            </label>

            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter maintenance details"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/maintenance')}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Maintenance'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ScheduleMaintenance