import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Mon', trips: 12 },
  { name: 'Tue', trips: 18 },
  { name: 'Wed', trips: 15 },
  { name: 'Thu', trips: 22 },
  { name: 'Fri', trips: 28 },
  { name: 'Sat', trips: 19 },
  { name: 'Sun', trips: 14 },
]

function FleetChart() {
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