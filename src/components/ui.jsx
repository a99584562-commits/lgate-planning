export const fmt = (n) => (n || 0).toLocaleString('ru-RU')

const STATUS = {
  draft: { label: 'Черновик', cls: 'bg-stone-100 text-stone-600 border-stone-200' },
  review: { label: 'На согласовании', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Утверждено', cls: 'bg-leaf-50 text-leaf-700 border-leaf-100' },
}

export function StatusChip({ status }) {
  const s = STATUS[status] || STATUS.draft
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {status === 'approved' && <Check className="h-3 w-3" />}
      {s.label}
    </span>
  )
}

export function Btn({ children, kind = 'primary', className = '', ...props }) {
  const kinds = {
    primary: 'bg-leaf-800 text-white hover:bg-leaf-700 disabled:bg-stone-200 disabled:text-stone-400',
    ghost: 'border border-line bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900',
    subtle: 'text-leaf-700 hover:bg-leaf-50',
  }
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${kinds[kind]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-line bg-white ${className}`}>{children}</div>
}

export function Check({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Ячейка матрицы. Подсветка: ноль — бледная, значение — обычная.
export function NumCell({ value, onChange, disabled, max }) {
  return (
    <input
      type="number"
      min="0"
      value={value || ''}
      placeholder="0"
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`num h-9 w-24 rounded-lg border border-transparent bg-transparent px-2 text-right text-sm
        ${value ? 'text-ink-900 font-medium' : 'text-ink-300'}
        ${disabled ? 'cursor-default' : 'hover:border-line focus:border-leaf-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-100'}`}
    />
  )
}

// Индикатор сверки: распределено из плана
export function Balance({ total, assigned }) {
  const diff = total - assigned
  if (total === 0 && assigned === 0) return <span className="text-xs text-ink-300">—</span>
  if (diff === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-600">
        <Check className="h-3.5 w-3.5" /> сошлось
      </span>
    )
  if (diff > 0)
    return (
      <span className="num text-xs font-semibold text-amber-600">
        осталось {fmt(diff)}
      </span>
    )
  return (
    <span className="num text-xs font-semibold text-red-500">
      перебор {fmt(-diff)}
    </span>
  )
}

export function ProgressBar({ total, assigned }) {
  const pct = total > 0 ? Math.min(100, Math.round((assigned / total) * 100)) : 0
  const over = assigned > total
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
      <div
        className={`h-full rounded-full transition-all ${over ? 'bg-red-400' : pct === 100 ? 'bg-leaf-500' : 'bg-amber-400'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
