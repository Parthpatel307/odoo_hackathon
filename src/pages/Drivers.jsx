import { useEffect, useState } from 'react'
import { Plus, Users, X } from 'lucide-react'
import { getDrivers, addDriver } from '../services/driverService'

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_category: '',
    license_expiry_date: '',
    contact_number: '',
    safety_score: 100,
    status: 'Available',
  })

  useEffect(() => {
    loadDrivers()
  }, [])

  async function loadDrivers() {
    try {
      setLoading(true)
      setError('')

      const data = await getDrivers()
      setDrivers(data || [])
    } catch (err) {
      console.error('Error loading drivers:', err)
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

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')

      await addDriver({
        ...formData,
        safety_score: Number(formData.safety_score),
      })

      setFormData({
        name: '',
        license_number: '',
        license_category: '',
        license_expiry_date: '',
        contact_number: '',
        safety_score: 100,
        status: 'Available',
      })

      setShowForm(false)
      await loadDrivers()
    } catch (err) {
      console.error('Error adding driver:', err)
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
            Drivers
          </h1>

          <p className="mt-2 text-slate-400">
            Manage and monitor your fleet drivers
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Driver
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Add New Driver
              </h2>

              <p className="mt-1 text-slate-400">
                Enter the driver information below
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <input
              type="text"
              name="name"
              placeholder="Driver Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            />

            <input
              type="text"
              name="license_number"
              placeholder="License Number"
              value={formData.license_number}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            />

            <input
              type="text"
              name="license_category"
              placeholder="License Category"
              value={formData.license_category}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            />

            <input
              type="date"
              name="license_expiry_date"
              value={formData.license_expiry_date}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            />

            <input
              type="text"
              name="contact_number"
              placeholder="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            />

            <input
              type="number"
              name="safety_score"
              placeholder="Safety Score"
              min="0"
              max="100"
              value={formData.safety_score}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            >
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Driver'}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading drivers...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && drivers.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-500" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No drivers found
          </h2>

          <p className="mt-2 text-slate-400">
            Add your first driver to start managing your team.
          </p>
        </div>
      )}

      {!loading && !error && drivers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-400">Name</th>
                  <th className="px-6 py-4 text-left text-slate-400">License</th>
                  <th className="px-6 py-4 text-left text-slate-400">Category</th>
                  <th className="px-6 py-4 text-left text-slate-400">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-slate-400">Safety Score</th>
                  <th className="px-6 py-4 text-left text-slate-400">Status</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-b border-slate-800 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-white">
                      {driver.name}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {driver.license_number}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {driver.license_category}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {driver.license_expiry_date}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {driver.safety_score}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                        {driver.status}
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

export default Drivers