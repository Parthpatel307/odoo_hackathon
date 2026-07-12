import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [message, setMessage] = useState('Testing Supabase connection...')

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from('vehicles')
        .select('*')
        .limit(1)

      if (error) {
        console.error(error)
        setMessage('❌ Supabase Connection Failed')
      } else {
        setMessage('✅ Supabase Connected Successfully')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">
        {message}
      </h1>
    </div>
  )
}

export default App