import { useEffect, useState } from 'react'
import {
  Truck,
  Users,
  Route,
  Wrench,
} from 'lucide-react'

import RecentActivity from '../components/dashboard/RecentActivity'
import FleetChart from '../components/dashboard/FleetChart'
import StatCard from '../components/dashboard/StatCard'
import { getDashboardStats } from '../services/dashboardService'

function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeDrivers: 0,
    unavailableDrivers: 0,
    activeTrips: 0,
    completedTrips: 0,
    activeMaintenance: 0,
    completedMaintenance: 0,
    totalExpenses: 0,
    totalRevenue: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardStats()
  }, [])

  async function loadDashboardStats() {
    try {
      setLoading(true)
      setError('')

      const data = await getDashboardStats()

      setStats(data)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Overview of your fleet operations
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={loading ? '...' : stats.totalVehicles}
          subtitle={
            loading
              ? 'Loading vehicle data...'
              : `${stats.availableVehicles} currently available`
          }
          icon={Truck}
        />

        <StatCard
          title="Active Drivers"
          value={loading ? '...' : stats.activeDrivers}
          subtitle={
            loading
              ? 'Loading driver data...'
              : `${stats.unavailableDrivers} drivers unavailable`
          }
          icon={Users}
        />

        <StatCard
          title="Active Trips"
          value={loading ? '...' : stats.activeTrips}
          subtitle={
            loading
              ? 'Loading trip data...'
              : `${stats.completedTrips} trips completed`
          }
          icon={Route}
        />

        <StatCard
          title="Active Maintenance"
          value={loading ? '...' : stats.activeMaintenance}
          subtitle={
            loading
              ? 'Loading maintenance data...'
              : `${stats.completedMaintenance} maintenance completed`
          }
          icon={Wrench}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FleetChart />
        </div>

        <RecentActivity />
      </div>
    </div>
  )
}

export default Dashboard