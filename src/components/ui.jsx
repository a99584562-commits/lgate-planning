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
    primary: 'bg-brand-500 text-white hover:bg-brand-600 disabled:bg-stone-200 disabled:text-stone-400',
    ghost: 'border border-line bg-white text-ink-700 hover:border-ink-300 hover:text-ink-900',
    subtle: 'text-brand-600 hover:bg-brand-50',
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
        ${disabled ? 'cursor-default' : 'hover:border-line focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100'}`}
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

// Палитра статусов заполнения — общая для точек, сводки и бейджей.
export const DIST = {
  review: { dot: 'bg-amber-400', text: 'text-amber-700', ring: 'ring-amber-200', label: 'Ждут согласования' },
  approved: { dot: 'bg-leaf-500', text: 'text-leaf-700', ring: 'ring-leaf-200', label: 'Утверждено' },
  progress: { dot: 'bg-sky-400', text: 'text-sky-700', ring: 'ring-sky-200', label: 'В работе' },
  empty: { dot: 'bg-stone-300', text: 'text-ink-400', ring: 'ring-stone-200', label: 'Не начато' },
}

export function Dot({ kind, className = 'h-2 w-2' }) {
  return <span className={`inline-block shrink-0 rounded-full ${DIST[kind].dot} ${className}`} />
}

// Строка-сводка: «● Ждут согласования 1  ● Утверждено 2 …». Нулевые категории приглушены.
export function DistSummary({ counts }) {
  const order = ['review', 'progress', 'approved', 'empty']
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {order.map((k) => (
        <span
          key={k}
          className={`inline-flex items-center gap-2 text-sm font-semibold ${counts[k] ? DIST[k].text : 'text-ink-300'}`}
        >
          <Dot kind={k} className={`h-2.5 w-2.5 ${counts[k] ? '' : 'opacity-40'}`} />
          {DIST[k].label}
          <span className="num tabular-nums">{counts[k]}</span>
        </span>
      ))}
    </div>
  )
}

// Янтарный бейдж-счётчик для навигации («ждёт согласования»)
export function CountBadge({ n }) {
  if (!n) return null
  return (
    <span className="num ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-amber-950">
      {n}
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
