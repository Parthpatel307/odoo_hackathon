import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { getWeeklyTripActivity } from '../../services/dashboardService'

function FleetChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadWeeklyTripActivity()
  }, [])

  async function loadWeeklyTripActivity() {
    try {
      setLoading(true)
      setError('')

      const weeklyData = await getWeeklyTripActivity()

      setData(weeklyData || [])
    } catch (err) {
      console.error('Error loading weekly trip activity:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex h-72 items-center justify-center text-slate-400">
          Loading weekly trip activity...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/30 p-5">
        <p className="text-red-400">
          Error loading chart: {error}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Weekly Trip Activity
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Number of trips completed this week
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />

            <Bar
              dataKey="trips"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default FleetChart