import { supabase } from '../lib/supabase'

// Get all maintenance records
export async function getMaintenanceRecords() {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .select(`
      *,
      vehicles (
        id,
        vehicle_name,
        registration_number
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Add maintenance record
export async function addMaintenanceRecord(maintenance) {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .insert([maintenance])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Update maintenance record
export async function updateMaintenanceRecord(id, maintenance) {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .update(maintenance)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Delete maintenance record
export async function deleteMaintenanceRecord(id) {
  const { error } = await supabase
    .from('maintenance_logs')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}