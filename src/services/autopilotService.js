import {
  getAvailableVehicles,
  getAvailableDrivers,
} from './tripService'

export async function runAutopilot(tripData) {
  const cargoWeight = Number(tripData.cargo_weight)
  const distance = Number(tripData.planned_distance)
  const revenue = Number(tripData.revenue)

  if (!cargoWeight || !distance || !revenue) {
    throw new Error(
      'Cargo weight, planned distance and revenue are required.'
    )
  }

  const [vehicles, drivers] = await Promise.all([
    getAvailableVehicles(cargoWeight),
    getAvailableDrivers(),
  ])

  if (!vehicles || vehicles.length === 0) {
    throw new Error(
      'No suitable available vehicle found for this cargo.'
    )
  }

  if (!drivers || drivers.length === 0) {
    throw new Error('No available driver found.')
  }

  // Best vehicle:
  // getAvailableVehicles already sorts by smallest suitable capacity.
  const recommendedVehicle = vehicles[0]

  // Best driver:
  // getAvailableDrivers already sorts by highest safety score.
  const recommendedDriver = drivers[0]

  const vehicleCapacity = Number(
    recommendedVehicle.max_load_capacity || 0
  )

  const safetyScore = Number(
    recommendedDriver.safety_score || 0
  )

  // Capacity utilization
  const capacityUtilization =
    vehicleCapacity > 0
      ? Math.round((cargoWeight / vehicleCapacity) * 100)
      : 0

  // Simple fuel estimation assumptions
  const estimatedMileage = 12
  const estimatedFuelPrice = 95

  const estimatedFuelLiters = distance / estimatedMileage

  const estimatedFuelCost = Math.round(
    estimatedFuelLiters * estimatedFuelPrice
  )

  // Other operational costs
  const estimatedOtherCost = Math.round(distance * 2)

  const estimatedTotalCost =
    estimatedFuelCost + estimatedOtherCost

  const expectedProfit = revenue - estimatedTotalCost

  const profitMargin =
    revenue > 0
      ? Math.round((expectedProfit / revenue) * 100)
      : 0

  // Maintenance risk estimation
  let maintenanceRisk = 'Low'
  let maintenanceRiskScore = 5

  if (recommendedVehicle.status !== 'Available') {
    maintenanceRisk = 'High'
    maintenanceRiskScore = 30
  }

  // Trip risk calculation
  let tripRiskScore = 0

  // Driver safety contribution
  if (safetyScore >= 90) {
    tripRiskScore += 5
  } else if (safetyScore >= 75) {
    tripRiskScore += 15
  } else {
    tripRiskScore += 30
  }

  // Capacity contribution
  if (capacityUtilization <= 85) {
    tripRiskScore += 5
  } else if (capacityUtilization <= 95) {
    tripRiskScore += 15
  } else {
    tripRiskScore += 25
  }

  // Distance contribution
  if (distance <= 300) {
    tripRiskScore += 5
  } else if (distance <= 700) {
    tripRiskScore += 15
  } else {
    tripRiskScore += 25
  }

  tripRiskScore += maintenanceRiskScore

  tripRiskScore = Math.min(100, tripRiskScore)

  // Autopilot score
  const autopilotScore = Math.max(
    0,
    100 - tripRiskScore
  )

  // Final decision
  let decision = 'RECOMMENDED'

  if (autopilotScore < 60) {
    decision = 'HIGH RISK'
  } else if (autopilotScore < 80) {
    decision = 'REVIEW REQUIRED'
  }

  const explanation = [
    `${recommendedVehicle.vehicle_name} was selected because it is the smallest suitable available vehicle for the cargo.`,
    `${recommendedDriver.name} was selected based on the highest available driver safety score.`,
    `Vehicle capacity utilization is ${capacityUtilization}%.`,
    `Estimated trip cost is ₹${estimatedTotalCost.toLocaleString(
      'en-IN'
    )} with an expected profit of ₹${expectedProfit.toLocaleString(
      'en-IN'
    )}.`,
    `Overall trip risk is estimated at ${tripRiskScore}%.`,
  ]

  return {
    decision,
    autopilotScore,
    tripRiskScore,

    recommendedVehicle,
    recommendedDriver,

    analysis: {
      capacityUtilization,
      safetyScore,
      estimatedFuelLiters: Number(
        estimatedFuelLiters.toFixed(2)
      ),
      estimatedFuelCost,
      estimatedOtherCost,
      estimatedTotalCost,
      expectedProfit,
      profitMargin,
      maintenanceRisk,
    },

    explanation,

    metadata: {
      suitableVehicles: vehicles.length,
      availableDrivers: drivers.length,
    },
  }
}