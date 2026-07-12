import { useEffect, useState } from 'react'
import { Plus, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMaintenanceRecords } from '../services/maintenanceService'

function Maintenance() {
  const navigate = useNavigate()

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMaintenanceRecords()
  }, [])

  async function loadMaintenanceRecords() {
    try {
      setLoading(true)
      setError('')

      const data = await getMaintenanceRecords()
      setRecords(data || [])
    } catch (err) {
      console.error('Error loading maintenance records:', err)
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
            Maintenance
          </h1>

          <p className="mt-2 text-slate-400">
            Track and manage vehicle maintenance
          </p>
        </div>

        <button
          onClick={() => navigate('/maintenance/create')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Schedule Maintenance
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading maintenance records...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Wrench className="mx-auto h-12 w-12 text-slate-500" />

          <h2 className="mt-4 text-xl font-semibold text-white">
            No maintenance records found
          </h2>

          <p className="mt-2 text-slate-400">
            Schedule your first vehicle maintenance.
          </p>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Maintenance Type
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Cost
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Start Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    End Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-800 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-white">
                      <div>
                        {record.vehicles?.vehicle_name || 'Unknown Vehicle'}
                      </div>

                      <div className="text-sm text-slate-400">
                        {record.vehicles?.registration_number || ''}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {record.maintenance_type}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      ₹{record.cost || 0}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {record.start_date || '-'}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {record.end_date || '-'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                        {record.status}
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

export default Maintenance