import { useStore } from '../store.jsx'
import { FY, ROLES } from '../data/seed.js'
import { Check } from './ui.jsx'

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
  const allowed = roleSteps(state.role)
  const role = ROLES.find((r) => r.id === state.role)

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-900 text-sm font-extrabold tracking-tight text-white">
            LG
          </div>
          <div className="mr-auto">
            <div className="text-[15px] font-bold leading-tight">Планирование продаж</div>
            <div className="text-xs text-ink-500">
              финансовый год <span className="num font-semibold text-ink-700">{FY}</span> · демо
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: 'reset' })}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink-400 hover:bg-stone-50 hover:text-ink-700"
            title="Вернуть демо-данные к исходным"
          >
            Сбросить демо
          </button>

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
                  ${active ? 'font-bold text-leaf-800' : enabled ? 'font-medium text-ink-500 hover:text-ink-900' : 'font-medium text-ink-300'}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold
                    ${done ? 'bg-leaf-600 text-white' : active ? 'bg-leaf-100 text-leaf-800' : 'bg-stone-100 text-ink-400'}`}
                >
                  {done ? <Check className="h-3 w-3" /> : s.n}
                </span>
                {s.label}
                {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-leaf-700" />}
              </button>
            )
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leaf-100 text-[10px] font-bold text-leaf-800">
            {role.short}
          </span>
          Вы вошли как <span className="font-semibold text-ink-700">{role.person}</span> — {role.label}
        </div>
        {children}
      </div>
    </div>
  )
}
