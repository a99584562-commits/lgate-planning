import { useStore, selectedHybrids, regionTotal, tpCheck } from '../store.jsx'
import { REGIONS } from '../data/seed.js'
import { Btn, Card, StatusChip, NumCell, fmt, Balance } from './ui.jsx'

// Шаг 2. Матрица Гибрид × Регион.
// В Б24 это карточки «Регион <Гибрид>» и массовое редактирование в списке.
export default function StepRegions() {
  const { state, dispatch } = useStore()
  const hybrids = selectedHybrids(state)
  const approved = state.regionPlans.status === 'approved'
  const grand = hybrids.reduce((s, h) => s + regionTotal(state, h.id), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold uppercase tracking-tight">План на регионы</h1>
          <p className="mt-1 text-sm text-ink-500">
            Одна таблица вместо {hybrids.length * REGIONS.length} карточек: строка — гибрид, колонка — регион, в посевных единицах.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={state.regionPlans.status} />
          {approved ? (
            <Btn kind="ghost" onClick={() => dispatch({ type: 'setRegionsStatus', status: 'draft' })}>
              Открыть для правок
            </Btn>
          ) : (
            <Btn disabled={grand === 0} onClick={() => dispatch({ type: 'setRegionsStatus', status: 'approved' })}>
              Утвердить планы регионов
            </Btn>
          )}
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3 text-left font-semibold">Гибрид</th>
              {REGIONS.map((r) => (
                <th key={r.id} className="px-2 py-3 text-right font-semibold">
                  {r.name}
                </th>
              ))}
              <th className="px-5 py-3 text-right font-semibold text-ink-700">План (гибрид)</th>
            </tr>
          </thead>
          <tbody>
            {hybrids.map((h, i) => (
              <tr key={h.id} className={i % 2 ? 'bg-paper/60' : ''}>
                <td className="px-5 py-2 font-bold">{h.name}</td>
                {REGIONS.map((r) => (
                  <td key={r.id} className="px-2 py-2 text-right">
                    <NumCell
                      value={state.regionPlans.values[h.id]?.[r.id]}
                      disabled={approved}
                      onChange={(v) => dispatch({ type: 'setRegionPlan', hybrid: h.id, region: r.id, value: v })}
                    />
                  </td>
                ))}
                <td className="num px-5 py-2 text-right font-extrabold text-ink-900">{fmt(regionTotal(state, h.id))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Итого по регионам</td>
              {REGIONS.map((r) => {
                const sum = hybrids.reduce((s, h) => s + (state.regionPlans.values[h.id]?.[r.id] || 0), 0)
                return (
                  <td key={r.id} className="num px-2 py-3 pr-4 text-right font-bold text-ink-700">
                    {fmt(sum)}
                  </td>
                )
              })}
              <td className="num px-5 py-3 text-right text-base font-extrabold text-brand-600">{fmt(grand)}</td>
            </tr>
          </tfoot>
        </table>
      </Card>

      {approved && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {REGIONS.map((r) => {
            const checks = hybrids.map((h) => tpCheck(state, r.id, h.id))
            const total = checks.reduce((s, c) => s + c.total, 0)
            const assigned = checks.reduce((s, c) => s + c.assigned, 0)
            return (
              <Card key={r.id} className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-bold">{r.name}</div>
                  <StatusChip status={state.tpPlans.status[r.id]} />
                </div>
                <div className="mb-2 text-xs text-ink-400">РОП · {r.rop}</div>
                <div className="num mb-1 text-lg font-extrabold text-ink-900">
                  {fmt(assigned)} <span className="text-xs font-medium text-ink-400">из {fmt(total)} п.е. разнесено</span>
                </div>
                <Balance total={total} assigned={assigned} />
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
