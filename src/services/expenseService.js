import { supabase } from '../lib/supabase'

export async function getExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      vehicles (
        vehicle_name,
        registration_number
      ),
      trips (
        source,
        destination
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function addExpense(expenseData) {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expenseData])
    .select()

  if (error) {
    throw error
  }

  return data
}