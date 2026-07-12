import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Receipt,
} from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Vehicles',
    path: '/vehicles',
    icon: Truck,
  },
  {
    name: 'Drivers',
    path: '/drivers',
    icon: Users,
  },
  {
    name: 'Trips',
    path: '/trips',
    icon: Route,
  },
  {
    name: 'Maintenance',
    path: '/maintenance',
    icon: Wrench,
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: Receipt,
  },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-900">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <Truck size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold">TransitOps</h1>
          <p className="text-xs text-slate-400">
            Smart Fleet Platform
          </p>
        </div>
      </div>

      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Operations
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar