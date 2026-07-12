import { useEffect, useState } from 'react'
import {
  Truck,
  Wrench,
  CircleCheck,
  Route,
} from 'lucide-react'

import { getRecentActivities } from '../../services/dashboardService'

function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecentActivities()
  }, [])

  async function loadRecentActivities() {
    try {
      setLoading(true)
      setError('')

      const data = await getRecentActivities()

      setActivities(data || [])
    } catch (err) {
      console.error('Error loading recent activities:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getActivityIcon(activity) {
    if (activity.type === 'maintenance') {
      return Wrench
    }

    if (activity.type === 'vehicle') {
      return Truck
    }

    if (
      activity.type === 'trip' &&
      activity.title === 'Trip completed'
    ) {
      return CircleCheck
    }

    return Route
  }

  function formatTime(dateString) {
    if (!dateString) {
      return ''
    }

    const activityDate = new Date(dateString)
    const currentDate = new Date()

    const difference =
      currentDate.getTime() - activityDate.getTime()

    const minutes = Math.floor(difference / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) {
      return 'Just now'
    }

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    }

    return `${days} day${days === 1 ? '' : 's'} ago`
  }

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

      {loading && (
        <div className="py-10 text-center text-slate-400">
          Loading recent activities...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <div className="py-10 text-center text-slate-400">
          No recent activity found.
        </div>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity)

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
                    {formatTime(activity.created_at)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentActivity