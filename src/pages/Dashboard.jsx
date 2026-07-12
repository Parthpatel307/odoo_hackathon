import RecentActivity from '../components/dashboard/RecentActivity'
import FleetChart from '../components/dashboard/FleetChart'
import {
  Truck,
  Users,
  Route,
  Wrench,
} from 'lucide-react'

import StatCard from '../components/dashboard/StatCard'

function Dashboard() {
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value="24"
          subtitle="18 currently available"
          icon={Truck}
        />

        <StatCard
          title="Active Drivers"
          value="16"
          subtitle="4 drivers off duty"
          icon={Users}
        />

        <StatCard
          title="Active Trips"
          value="8"
          subtitle="3 trips completed today"
          icon={Route}
        />

        <StatCard
          title="Maintenance Due"
          value="5"
          subtitle="2 require urgent attention"
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