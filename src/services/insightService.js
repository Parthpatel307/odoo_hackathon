import { supabase } from '../lib/supabase'

export async function getFleetInsights() {
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

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'Available'
  )

  const availableDrivers = drivers.filter(
    (driver) => driver.status === 'Available'
  )

  const activeTrips = trips.filter(
    (trip) => trip.status === 'Dispatched'
  )

  const completedTrips = trips.filter(
    (trip) => trip.status === 'Completed'
  )

  const activeMaintenance = maintenance.filter(
    (record) => record.status === 'Active'
  )

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  )

  const alerts = []
  const recommendations = []

  // Fleet Health Score
  let fleetHealthScore = 100

  if (vehicles.length === 0) {
    fleetHealthScore -= 30
  }

  fleetHealthScore -= activeMaintenance.length * 10

  if (vehicles.length > 0 && availableVehicles.length === 0) {
    fleetHealthScore -= 15
  }

  if (drivers.length > 0 && availableDrivers.length === 0) {
    fleetHealthScore -= 15
  }

  if (totalExpenses > 50000) {
    fleetHealthScore -= 10
  }

  fleetHealthScore = Math.max(
    0,
    Math.min(100, fleetHealthScore)
  )

  // Smart Alerts
  if (activeMaintenance.length > 0) {
    alerts.push({
      type: 'warning',
      title: 'Maintenance Attention Required',
      message: `${activeMaintenance.length} vehicle maintenance record${
        activeMaintenance.length === 1 ? '' : 's'
      } currently active.`,
    })
  }

  if (availableVehicles.length === 0 && vehicles.length > 0) {
    alerts.push({
      type: 'critical',
      title: 'No Vehicles Available',
      message:
        'All fleet vehicles are currently occupied or unavailable.',
    })
  }

  if (availableDrivers.length === 0 && drivers.length > 0) {
    alerts.push({
      type: 'critical',
      title: 'No Drivers Available',
      message:
        'There are currently no available drivers for dispatch.',
    })
  }

  if (totalExpenses > 10000) {
    alerts.push({
      type: 'warning',
      title: 'Expense Monitoring',
      message: `Fleet expenses have reached ₹${totalExpenses.toLocaleString(
        'en-IN'
      )}.`,
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      title: 'Fleet Operations Healthy',
      message:
        'No critical operational issues have been detected.',
    })
  }

  // Smart Recommendations
  if (
    availableVehicles.length > 0 &&
    availableDrivers.length > 0
  ) {
    recommendations.push({
      title: 'Ready for Smart Dispatch',
      message: `${availableVehicles.length} vehicle${
        availableVehicles.length === 1 ? '' : 's'
      } and ${availableDrivers.length} driver${
        availableDrivers.length === 1 ? '' : 's'
      } are ready for a new trip.`,
      action: 'Create Trip',
      path: '/trips/create',
    })
  }

  if (activeMaintenance.length > 0) {
    recommendations.push({
      title: 'Review Active Maintenance',
      message:
        'Review active maintenance records to reduce vehicle downtime.',
      action: 'View Maintenance',
      path: '/maintenance',
    })
  }

  if (totalExpenses > 0) {
    recommendations.push({
      title: 'Monitor Fleet Costs',
      message: `Current recorded fleet expenses are ₹${totalExpenses.toLocaleString(
        'en-IN'
      )}. Review expenses for cost optimization opportunities.`,
      action: 'View Expenses',
      path: '/expenses',
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Add Fleet Resources',
      message:
        'Add vehicles and drivers to start receiving operational recommendations.',
      action: 'View Vehicles',
      path: '/vehicles',
    })
  }

  return {
    fleetHealthScore,
    alerts,
    recommendations,

    summary: {
      totalVehicles: vehicles.length,
      availableVehicles: availableVehicles.length,
      totalDrivers: drivers.length,
      availableDrivers: availableDrivers.length,
      activeTrips: activeTrips.length,
      completedTrips: completedTrips.length,
      activeMaintenance: activeMaintenance.length,
      totalExpenses,
    },
  }
}