import { supabase } from '../lib/supabase'

// Get all trips with vehicle and driver details
export async function getTrips() {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      vehicles (
        registration_number,
        vehicle_name
      ),
      drivers (
        name,
        license_number
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Create new trip
export async function addTrip(trip) {
  const { data, error } = await supabase
    .from('trips')
    .insert([trip])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Get available vehicles suitable for cargo
export async function getAvailableVehicles(cargoWeight) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'Available')
    .gte('max_load_capacity', cargoWeight)
    .order('max_load_capacity', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

// Get available drivers
export async function getAvailableDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('status', 'Available')
    .order('safety_score', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Update vehicle status
export async function updateVehicleStatus(vehicleId, status) {
  const { error } = await supabase
    .from('vehicles')
    .update({ status })
    .eq('id', vehicleId)

  if (error) {
    throw error
  }
}

// Update driver status
export async function updateDriverStatus(driverId, status) {
  const { error } = await supabase
    .from('drivers')
    .update({ status })
    .eq('id', driverId)

  if (error) {
    throw error
  }
}

// Complete trip and release assigned vehicle and driver
export async function completeTrip(trip) {
  if (!trip?.id) {
    throw new Error('Trip ID is missing')
  }

  const { error: tripError } = await supabase
    .from('trips')
    .update({
      status: 'Completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', trip.id)

  if (tripError) {
    throw tripError
  }

  if (trip.vehicle_id) {
    const { error: vehicleError } = await supabase
      .from('vehicles')
      .update({
        status: 'Available',
      })
      .eq('id', trip.vehicle_id)

    if (vehicleError) {
      throw vehicleError
    }
  }

  if (trip.driver_id) {
    const { error: driverError } = await supabase
      .from('drivers')
      .update({
        status: 'Available',
      })
      .eq('id', trip.driver_id)

    if (driverError) {
      throw driverError
    }
  }

  return true
}