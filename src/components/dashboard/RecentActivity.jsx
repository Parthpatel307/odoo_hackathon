import {
  Truck,
  UserCheck,
  Wrench,
  CircleCheck,
} from 'lucide-react'

const activities = [
  {
    id: 1,
    title: 'Trip completed',
    description: 'Vehicle GJ-01-AB-1234 completed Ahmedabad delivery',
    time: '10 minutes ago',
    icon: CircleCheck,
  },
  {
    id: 2,
    title: 'Driver assigned',
    description: 'Rahul Patel assigned to Trip #TRP-1024',
    time: '25 minutes ago',
    icon: UserCheck,
  },
  {
    id: 3,
    title: 'Maintenance scheduled',
    description: 'Vehicle GJ-05-CD-5678 scheduled for service',
    time: '1 hour ago',
    icon: Wrench,
  },
  {
    id: 4,
    title: 'New vehicle added',
    description: 'Tata Ace added to the fleet',
    time: '2 hours ago',
    icon: Truck,
  },
]

function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Latest updates from your fleet
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border border-slate-800 p-4"
            >
              <div className="rounded-lg bg-blue-600/20 p-2">
                <Icon className="h-5 w-5 text-blue-500" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-white">
                  {activity.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {activity.description}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {activity.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity