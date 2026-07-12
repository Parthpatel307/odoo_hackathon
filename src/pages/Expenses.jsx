import { useEffect, useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getExpenses } from '../services/expenseService'

function Expenses() {
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    try {
      setLoading(true)
      setError('')

      const data = await getExpenses()
      setExpenses(data || [])
    } catch (err) {
      console.error('Error loading expenses:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Expenses
          </h1>

          <p className="mt-2 text-slate-400">
            Track and manage fleet expenses
          </p>
        </div>

        <button
          onClick={() => navigate('/expenses/create')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading expenses...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Receipt className="mx-auto h-12 w-12 text-slate-500" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No expenses found
          </h2>

          <p className="mt-2 text-slate-400">
            Add your first fleet expense.
          </p>
        </div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Trip
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Expense Type
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Fuel
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-slate-800 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-white">
                      <div>
                        {expense.vehicles?.vehicle_name || 'No Vehicle'}
                      </div>

                      <div className="text-sm text-slate-400">
                        {expense.vehicles?.registration_number || ''}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {expense.trips
                        ? `${expense.trips.source} → ${expense.trips.destination}`
                        : 'No Trip'}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {expense.expense_type}
                    </td>

                    <td className="px-6 py-4 font-medium text-white">
                      ₹{expense.amount || 0}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {expense.fuel_liters
                        ? `${expense.fuel_liters} L`
                        : '-'}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {expense.expense_date || '-'}
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

export default Expenses