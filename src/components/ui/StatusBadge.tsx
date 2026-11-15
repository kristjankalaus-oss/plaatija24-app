interface BadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  uus:          'bg-blue-100 text-blue-700',
  kinnitatud:   'bg-indigo-100 text-indigo-700',
  töös:         'bg-yellow-100 text-yellow-700',
  valmis:       'bg-green-100 text-green-700',
  tarnitud:     'bg-teal-100 text-teal-700',
  tühistatud:   'bg-red-100 text-red-600',
  planeeritud:  'bg-gray-100 text-gray-700',
  käimas:       'bg-orange-100 text-orange-700',
}

export default function StatusBadge({ status }: BadgeProps) {
  const style = statusStyles[status] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${style}`}>
      {status}
    </span>
  )
}
