import { Bell, Search, User } from 'lucide-react'

function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 backdrop-blur">
      
      <div>
        <h2 className="text-xl font-semibold">
          Fleet Operations
        </h2>
        <p className="text-sm text-slate-400">
          Monitor and manage your transport operations
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 md:flex">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="relative rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-slate-400 transition hover:text-white">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
            <User size={20} />
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-medium">
              Fleet Manager
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header