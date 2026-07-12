import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getVehicles } from '../services/vehicleService'
import { addExpense } from '../services/expenseService'

function AddExpense() {
  const navigate = useNavigate()

  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    vehicle_id: '',
    expense_type: '',
    amount: '',
    fuel_liters: '',
    expense_date: '',
    description: '',
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

      const expenseData = {
        vehicle_id: formData.vehicle_id,
        expense_type: formData.expense_type,
        amount: Number(formData.amount),
        fuel_liters: formData.fuel_liters
          ? Number(formData.fuel_liters)
          : null,
        expense_date: formData.expense_date,
        description: formData.description,
      }

      await addExpense(expenseData)

      navigate('/expenses')
    } catch (err) {
      console.error('Error adding expense:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/expenses')}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Expenses
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Add Expense
        </h1>

        <p className="mt-2 text-slate-400">
          Record and track a new fleet expense
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
              Expense Type
            </label>

            <select
              name="expense_type"
              value={formData.expense_type}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="">Select expense type</option>
              <option value="Fuel">Fuel</option>
              <option value="Toll">Toll</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Repair">Repair</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Amount (₹)
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              required
              placeholder="Enter expense amount"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Fuel Liters
            </label>

            <input
              type="number"
              name="fuel_liters"
              value={formData.fuel_liters}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Optional"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Expense Date
            </label>

            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
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
              placeholder="Enter expense details"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddExpense