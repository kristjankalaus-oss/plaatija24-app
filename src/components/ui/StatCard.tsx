interface StatCardProps {
  title: string
  value: string | number
  icon: string
  trend?: string
  trendUp?: boolean
}

export default function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </p>
        )}
      </div>
    </div>
  )
}
