import { useState } from 'react'
import { useStore, regionsAwaiting, tpsAwaiting } from '../store.jsx'
import { FY, ROLES } from '../data/seed.js'
import { Check, CountBadge } from './ui.jsx'
import BrandMark from './BrandMark.jsx'
import Guide from './Guide.jsx'

const STEPS = [
  { id: 'hybrids', n: 1, label: 'Гибриды' },
  { id: 'regions', n: 2, label: 'Регионы' },
  { id: 'tp', n: 3, label: 'Торговые представители' },
  { id: 'farms', n: 4, label: 'Хозяйства' },
  { id: 'deals', n: 5, label: 'Сделки' },
]

function stepDone(state, id) {
  if (id === 'hybrids') return state.hybridSelection.status === 'approved'
  if (id === 'regions') return state.regionPlans.status === 'approved'
  if (id === 'tp') return Object.values(state.tpPlans.status).every((s) => s === 'approved')
  if (id === 'farms')
    return Object.keys(state.farms.status).length > 0 && Object.values(state.farms.status).every((s) => s === 'approved')
  return false
}

// какие шаги доступны роли
export function roleSteps(roleId) {
  if (roleId.startsWith('rop')) return ['tp', 'deals']
  if (roleId.startsWith('tp')) return ['farms', 'deals']
  return STEPS.map((s) => s.id)
}

export default function Shell({ children }) {
  const { state, dispatch } = useStore()
  const [guide, setGuide] = useState(false)
  const allowed = roleSteps(state.role)
  const role = ROLES.find((r) => r.id === state.role)
  // КД — согласующий: показываем, сколько регионов/ТП ждёт его прямо на навигации
  const isBoss = state.role === 'cd'
  const awaiting = { tp: isBoss ? regionsAwaiting(state) : 0, farms: isBoss ? tpsAwaiting(state) : 0 }

  return (
    <div className="min-h-screen pb-20">
      {guide && <Guide onClose={() => setGuide(false)} />}
      <div className="h-1 bg-brand-500" />
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 p-2 text-white">
            <BrandMark className="h-full w-full" />
          </div>
          <div className="mr-auto">
            <div className="font-display text-[17px] font-semibold uppercase leading-tight tracking-tight">
              Планирование продаж
            </div>
            <div className="text-xs text-ink-500">
              финансовый год <span className="num font-semibold text-ink-700">{FY}</span> · демо
            </div>
          </div>

          <button
            onClick={() => setGuide(true)}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            title="Как устроено и как пользоваться"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
              <path d="M7.6 7.6a2.4 2.4 0 1 1 3.2 2.26c-.5.2-.8.66-.8 1.19v.45" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="10" cy="14.4" r="0.9" fill="currentColor" />
            </svg>
            Инструкция
          </button>

          <div className="flex items-center overflow-hidden rounded-lg border border-line">
            <button
              onClick={() => dispatch({ type: 'reset' })}
              className="px-3 py-1.5 text-xs font-medium text-ink-500 hover:bg-stone-50 hover:text-ink-700"
              title="Вернуть заполненный демо-пример (все стадии)"
            >
              Демо-пример
            </button>
            <button
              onClick={() => {
                if (confirm('Очистить все планы и пройти процесс с нуля? Демо-пример можно вернуть кнопкой рядом.'))
                  dispatch({ type: 'clear' })
              }}
              className="border-l border-line px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
              title="Пустое состояние — прогнать каскад с шага 1"
            >
              Чистый старт
            </button>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2">
            <span className="text-xs text-ink-500">Роль</span>
            <select
              value={state.role}
              onChange={(e) => dispatch({ type: 'role', id: e.target.value })}
              className="bg-transparent text-sm font-semibold text-ink-900 focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav className="mx-auto flex max-w-6xl items-center gap-1 px-6">
          {STEPS.map((s) => {
            const active = state.step === s.id
            const done = stepDone(state, s.id)
            const enabled = allowed.includes(s.id)
            return (
              <button
                key={s.id}
                disabled={!enabled}
                onClick={() => dispatch({ type: 'step', id: s.id })}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm transition-colors
                  ${active ? 'font-bold text-brand-600' : enabled ? 'font-medium text-ink-500 hover:text-ink-900' : 'font-medium text-ink-300'}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold
                    ${done ? 'bg-leaf-600 text-white' : active ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-ink-400'}`}
                >
                  {done ? <Check className="h-3 w-3" /> : s.n}
                </span>
                {s.label}
                <CountBadge n={awaiting[s.id]} />
                {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />}
              </button>
            )
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
            {role.short}
          </span>
          Вы вошли как <span className="font-semibold text-ink-700">{role.person}</span> — {role.label}
        </div>
        {children}
      </div>
    </div>
  )
}
