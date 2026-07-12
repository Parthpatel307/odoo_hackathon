import { supabase } from '../lib/supabase'

// Get all drivers
export async function getDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Add new driver
export async function addDriver(driver) {
  const { data, error } = await supabase
    .from('drivers')
    .insert([driver])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Update driver
export async function updateDriver(id, driver) {
  const { data, error } = await supabase
    .from('drivers')
    .update(driver)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Delete driver
export async function deleteDriver(id) {
  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}