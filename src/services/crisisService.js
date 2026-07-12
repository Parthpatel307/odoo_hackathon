import { supabase } from '../lib/supabase'

export async function analyzeFleetCrisis(trip, crisisType) {
  if (!trip?.id) {
    throw new Error('Valid trip is required for crisis analysis.')
  }

  const cargoWeight = Number(trip.cargo_weight || 0)
  const distance = Number(trip.planned_distance || 0)
  const revenue = Number(trip.revenue || 0)

  const [vehiclesResult, driversResult] = await Promise.all([
    supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'Available')
      .gte('max_load_capacity', cargoWeight)
      .order('max_load_capacity', { ascending: true }),

    supabase
      .from('drivers')
      .select('*')
      .eq('status', 'Available')
      .order('safety_score', { ascending: false }),
  ])

  if (vehiclesResult.error) {
    throw vehiclesResult.error
  }

  if (driversResult.error) {
    throw driversResult.error
  }

  const availableVehicles = vehiclesResult.data || []
  const availableDrivers = driversResult.data || []

  const replacementVehicle = availableVehicles[0] || null
  const replacementDriver = availableDrivers[0] || null

  let severityScore = 50
  let estimatedDelayHours = 2
  let additionalCost = Math.round(distance * 3)
  let crisisTitle = 'Operational Disruption'

  switch (crisisType) {
    case 'vehicle_breakdown':
      severityScore = 85
      estimatedDelayHours = 5
      additionalCost = Math.round(distance * 5)
      crisisTitle = 'Vehicle Breakdown'
      break

    case 'driver_unavailable':
      severityScore = 70
      estimatedDelayHours = 3
      additionalCost = Math.round(distance * 2)
      crisisTitle = 'Driver Unavailable'
      break

    case 'traffic_delay':
      severityScore = 45
      estimatedDelayHours = 4
      additionalCost = Math.round(distance * 1.5)
      crisisTitle = 'Severe Traffic Delay'
      break

    case 'cargo_increase':
      severityScore = 65
      estimatedDelayHours = 2
      additionalCost = Math.round(distance * 2.5)
      crisisTitle = 'Unexpected Cargo Increase'
      break

    default:
      throw new Error('Unknown crisis type.')
  }

  const estimatedLoss = Math.round(
    additionalCost + revenue * (severityScore / 100) * 0.1
  )

  let recoveryStatus = 'RECOVERY AVAILABLE'
  let recoveryScore = 90

  if (
    crisisType === 'vehicle_breakdown' &&
    !replacementVehicle
  ) {
    recoveryStatus = 'CRITICAL'
    recoveryScore = 25
  }

  if (
    crisisType === 'driver_unavailable' &&
    !replacementDriver
  ) {
    recoveryStatus = 'CRITICAL'
    recoveryScore = 25
  }

  if (
    crisisType === 'cargo_increase' &&
    !replacementVehicle
  ) {
    recoveryStatus = 'CRITICAL'
    recoveryScore = 25
  }

  if (
    replacementVehicle &&
    replacementDriver &&
    recoveryStatus !== 'CRITICAL'
  ) {
    recoveryScore = Math.max(
      0,
      100 - Math.round(severityScore * 0.25)
    )
  }

  const recoveryActions = []

  if (
    crisisType === 'vehicle_breakdown' &&
    replacementVehicle
  ) {
    recoveryActions.push(
      `Replace the affected vehicle with ${replacementVehicle.vehicle_name} (${replacementVehicle.registration_number}).`
    )
  }

  if (
    crisisType === 'driver_unavailable' &&
    replacementDriver
  ) {
    recoveryActions.push(
      `Assign ${replacementDriver.name} as the replacement driver.`
    )
  }

  if (crisisType === 'traffic_delay') {
    recoveryActions.push(
      'Notify fleet operations about the estimated delay.'
    )

    recoveryActions.push(
      'Activate the AI traffic recovery strategy.'
    )

    recoveryActions.push(
      'Continue monitoring the trip and prepare an alternate dispatch plan.'
    )
  }

  if (crisisType === 'cargo_increase') {
    if (replacementVehicle) {
      recoveryActions.push(
        `Reassign cargo to ${replacementVehicle.vehicle_name}, which has sufficient available capacity.`
      )
    } else {
      recoveryActions.push(
        'No suitable replacement vehicle is currently available.'
      )
    }
  }

  if (
    replacementDriver &&
    crisisType !== 'driver_unavailable'
  ) {
    recoveryActions.push(
      `${replacementDriver.name} is available as an emergency backup driver.`
    )
  }

  recoveryActions.push(
    `Estimated recovery delay: ${estimatedDelayHours} hours.`
  )

  recoveryActions.push(
    `Estimated additional operational cost: ₹${additionalCost.toLocaleString(
      'en-IN'
    )}.`
  )

  return {
    crisisType,
    crisisTitle,
    severityScore,
    estimatedDelayHours,
    additionalCost,
    estimatedLoss,
    recoveryStatus,
    recoveryScore,
    replacementVehicle,
    replacementDriver,
    recoveryActions,

    impact: {
      affectedRoute: `${trip.source} → ${trip.destination}`,
      cargoWeight,
      distance,
      revenue,
    },
  }
}

export async function executeRecoveryPlan(
  trip,
  crisisType,
  recoveryPlan
) {
  if (!trip?.id) {
    throw new Error('Trip ID is missing.')
  }

  if (!recoveryPlan) {
    throw new Error('Recovery plan is missing.')
  }

  // VEHICLE BREAKDOWN
  if (crisisType === 'vehicle_breakdown') {
    if (!recoveryPlan.replacementVehicle) {
      throw new Error(
        'No replacement vehicle is available.'
      )
    }

    const newVehicleId =
      recoveryPlan.replacementVehicle.id

    // First assign replacement vehicle to trip
    const { error: tripError } = await supabase
      .from('trips')
      .update({
        vehicle_id: newVehicleId,
      })
      .eq('id', trip.id)

    if (tripError) {
      throw tripError
    }

    return {
      success: true,
      message:
        'AI recovery completed. Replacement vehicle assigned successfully.',
    }
  }

  // DRIVER UNAVAILABLE
  if (crisisType === 'driver_unavailable') {
    if (!recoveryPlan.replacementDriver) {
      throw new Error(
        'No replacement driver is available.'
      )
    }

    const newDriverId =
      recoveryPlan.replacementDriver.id

    // Assign replacement driver to trip
    const { error: tripError } = await supabase
      .from('trips')
      .update({
        driver_id: newDriverId,
      })
      .eq('id', trip.id)

    if (tripError) {
      throw tripError
    }

    return {
      success: true,
      message:
        'AI recovery completed. Replacement driver assigned successfully.',
    }
  }

  // TRAFFIC DELAY
  if (crisisType === 'traffic_delay') {
    return {
      success: true,
      message:
        'AI traffic recovery strategy activated successfully.',
    }
  }

  // CARGO INCREASE
  if (crisisType === 'cargo_increase') {
    if (!recoveryPlan.replacementVehicle) {
      throw new Error(
        'No suitable replacement vehicle is available.'
      )
    }

    const newVehicleId =
      recoveryPlan.replacementVehicle.id

    // Assign suitable replacement vehicle
    const { error: tripError } = await supabase
      .from('trips')
      .update({
        vehicle_id: newVehicleId,
      })
      .eq('id', trip.id)

    if (tripError) {
      throw tripError
    }

    return {
      success: true,
      message:
        'AI recovery completed. Cargo reassigned successfully.',
    }
  }

  throw new Error('Unknown crisis type.')
}