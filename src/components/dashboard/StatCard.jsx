function StatCard({ title, value, icon: Icon, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="rounded-lg bg-blue-600/20 p-3">
            <Icon className="h-6 w-6 text-blue-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard