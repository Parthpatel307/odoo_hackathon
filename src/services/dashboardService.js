import { supabase } from '../lib/supabase'

export async function getDashboardStats() {
  const [
    vehiclesResult,
    driversResult,
    tripsResult,
    maintenanceResult,
    expensesResult,
  ] = await Promise.all([
    supabase.from('vehicles').select('*'),
    supabase.from('drivers').select('*'),
    supabase.from('trips').select('*'),
    supabase.from('maintenance_logs').select('*'),
    supabase.from('expenses').select('*'),
  ])

  if (vehiclesResult.error) throw vehiclesResult.error
  if (driversResult.error) throw driversResult.error
  if (tripsResult.error) throw tripsResult.error
  if (maintenanceResult.error) throw maintenanceResult.error
  if (expensesResult.error) throw expensesResult.error

  const vehicles = vehiclesResult.data || []
  const drivers = driversResult.data || []
  const trips = tripsResult.data || []
  const maintenance = maintenanceResult.data || []
  const expenses = expensesResult.data || []

  const totalVehicles = vehicles.length

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Available'
  ).length

  const activeDrivers = drivers.filter(
    (driver) => driver.status === 'Available'
  ).length

  const unavailableDrivers = drivers.filter(
    (driver) => driver.status !== 'Available'
  ).length

  const activeTrips = trips.filter(
    (trip) => trip.status === 'Dispatched'
  ).length

  const completedTrips = trips.filter(
    (trip) => trip.status === 'Completed'
  ).length

  const activeMaintenance = maintenance.filter(
    (record) => record.status === 'Active'
  ).length

  const completedMaintenance = maintenance.filter(
    (record) => record.status === 'Completed'
  ).length

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  )

  const totalRevenue = trips.reduce(
    (total, trip) => total + Number(trip.revenue || 0),
    0
  )

  return {
    totalVehicles,
    availableVehicles,
    activeDrivers,
    unavailableDrivers,
    activeTrips,
    completedTrips,
    activeMaintenance,
    completedMaintenance,
    totalExpenses,
    totalRevenue,
  }
}

export async function getWeeklyTripActivity() {
  const { data, error } = await supabase
    .from('trips')
    .select('status, completed_at')

  if (error) {
    throw error
  }

  const weekData = [
    { name: 'Mon', trips: 0 },
    { name: 'Tue', trips: 0 },
    { name: 'Wed', trips: 0 },
    { name: 'Thu', trips: 0 },
    { name: 'Fri', trips: 0 },
    { name: 'Sat', trips: 0 },
    { name: 'Sun', trips: 0 },
  ]

  const today = new Date()
  const currentDay = today.getDay()

  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

  const startOfWeek = new Date(today)

  startOfWeek.setDate(today.getDate() + mondayOffset)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)

  endOfWeek.setDate(startOfWeek.getDate() + 7)

  const completedTrips = (data || []).filter((trip) => {
    if (trip.status !== 'Completed' || !trip.completed_at) {
      return false
    }

    const completedDate = new Date(trip.completed_at)

    return completedDate >= startOfWeek && completedDate < endOfWeek
  })

  completedTrips.forEach((trip) => {
    const completedDate = new Date(trip.completed_at)

    const dayIndex = completedDate.getDay()

    const chartIndex = dayIndex === 0 ? 6 : dayIndex - 1

    weekData[chartIndex].trips += 1
  })

  return weekData
}

export async function getRecentActivities() {
  const [
    tripsResult,
    maintenanceResult,
    vehiclesResult,
  ] = await Promise.all([
    supabase
      .from('trips')
      .select(`
        id,
        source,
        destination,
        status,
        created_at,
        completed_at,
        vehicles (
          vehicle_name,
          registration_number
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('maintenance_logs')
      .select(`
        id,
        maintenance_type,
        status,
        created_at,
        vehicles (
          vehicle_name,
          registration_number
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('vehicles')
      .select(`
        id,
        vehicle_name,
        registration_number,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  if (tripsResult.error) throw tripsResult.error
  if (maintenanceResult.error) throw maintenanceResult.error
  if (vehiclesResult.error) throw vehiclesResult.error

  const tripActivities = (tripsResult.data || []).map((trip) => ({
    id: `trip-${trip.id}`,
    type: 'trip',
    title:
      trip.status === 'Completed'
        ? 'Trip completed'
        : 'Trip dispatched',
    description: `${trip.source} → ${trip.destination}${
      trip.vehicles?.registration_number
        ? ` • ${trip.vehicles.registration_number}`
        : ''
    }`,
    created_at:
      trip.status === 'Completed' && trip.completed_at
        ? trip.completed_at
        : trip.created_at,
  }))

  const maintenanceActivities = (
    maintenanceResult.data || []
  ).map((record) => ({
    id: `maintenance-${record.id}`,
    type: 'maintenance',
    title:
      record.status === 'Completed'
        ? 'Maintenance completed'
        : 'Maintenance scheduled',
    description: `${
      record.vehicles?.vehicle_name || 'Vehicle'
    } • ${record.maintenance_type}`,
    created_at: record.created_at,
  }))

  const vehicleActivities = (vehiclesResult.data || []).map(
    (vehicle) => ({
      id: `vehicle-${vehicle.id}`,
      type: 'vehicle',
      title: 'New vehicle added',
      description: `${vehicle.vehicle_name} • ${vehicle.registration_number}`,
      created_at: vehicle.created_at,
    })
  )

  return [
    ...tripActivities,
    ...maintenanceActivities,
    ...vehicleActivities,
  ]
    .filter((activity) => activity.created_at)
    .sort(
      (firstActivity, secondActivity) =>
        new Date(secondActivity.created_at) -
        new Date(firstActivity.created_at)
    )
    .slice(0, 5)
}