import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from '../components/layout/MainLayout'

import Dashboard from '../pages/Dashboard'
import Vehicles from '../pages/Vehicles'
import Drivers from '../pages/Drivers'
import Trips from '../pages/Trips'
import CreateTrip from '../pages/CreateTrip'
import Maintenance from '../pages/Maintenance'
import ScheduleMaintenance from '../pages/ScheduleMaintenance'
import Expenses from '../pages/Expenses'
import NotFound from '../pages/NotFound'
import AddExpense from '../pages/AddExpense'


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/maintenance/create" element={<ScheduleMaintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/create" element={<AddExpense />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes