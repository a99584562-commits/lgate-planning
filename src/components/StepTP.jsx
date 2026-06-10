import { useState } from 'react'
import { useStore, selectedHybrids, tpCheck, regionDistStatus, tally } from '../store.jsx'
import { REGIONS, TPS, ROLES } from '../data/seed.js'
import { Btn, Card, StatusChip, NumCell, fmt, Balance, ProgressBar, Dot, DistSummary, DIST } from './ui.jsx'

// Шаг 3. Разнесение плана региона по торговым представителям (зона РОП).
// Сверка сумм — живая, прямо в таблице, без второй вкладки с канбаном.
export default function StepTP() {
  const { state, dispatch } = useStore()
  const role = ROLES.find((r) => r.id === state.role)
  const isRop = !!role.region
  const isBoss = state.role === 'cd'
  const [picked, setPicked] = useState(role.region || 'yug')
  const regionId = isRop ? role.region : picked
  const region = REGIONS.find((r) => r.id === regionId)
  const hybrids = selectedHybrids(state).filter((h) => (state.regionPlans.values[h.id]?.[regionId] || 0) > 0)
  const tps = TPS.filter((t) => t.region === regionId)
  const status = state.tpPlans.status[regionId]
  const editable = status === 'draft' && (isRop ? role.region === regionId : isBoss)

  const totals = hybrids.map((h) => tpCheck(state, regionId, h.id))
  const allMatch = totals.length > 0 && totals.every((c) => c.diff === 0)
  const sumTotal = totals.reduce((s, c) => s + c.total, 0)
  const sumAssigned = totals.reduce((s, c) => s + c.assigned, 0)

  if (state.regionPlans.status !== 'approved')
    return (
      <Card className="p-10 text-center text-sm text-ink-500">
        Планы на регионы ещё не утверждены — разнесение по торговым представителям станет доступно после шага 2.
      </Card>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">План на торговых представителей</h1>
          <p className="mt-1 text-sm text-ink-500">
            {isRop
              ? `Ваш регион — ${region.name}. Разнесите план региона по своей команде.`
              : 'Выберите регион, чтобы посмотреть или согласовать разнесение.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={status} />
          {editable && (
            <Btn disabled={!allMatch} onClick={() => dispatch({ type: 'setTpStatus', region: regionId, status: 'review' })}>
              Отправить на согласование
            </Btn>
          )}
          {status === 'review' && isBoss && (
            <>
              <Btn kind="ghost" onClick={() => dispatch({ type: 'setTpStatus', region: regionId, status: 'draft' })}>
                Вернуть в работу
              </Btn>
              <Btn onClick={() => dispatch({ type: 'setTpStatus', region: regionId, status: 'approved' })}>
                Утвердить регион
              </Btn>
            </>
          )}
          {status === 'approved' && isBoss && (
            <Btn kind="ghost" onClick={() => dispatch({ type: 'setTpStatus', region: regionId, status: 'draft' })}>
              Открыть для правок
            </Btn>
          )}
        </div>
      </div>

      {!isRop && (
        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Регионы · статус разнесения</span>
            <DistSummary counts={tally(REGIONS, (r) => regionDistStatus(state, r.id))} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((r) => {
              const ds = regionDistStatus(state, r.id)
              const sel = r.id === regionId
              return (
                <button
                  key={r.id}
                  onClick={() => setPicked(r.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors
                    ${sel ? 'border-leaf-800 bg-leaf-800 text-white' : 'border-line bg-white text-ink-500 hover:border-ink-300'}
                    ${!sel && ds === 'review' ? 'ring-2 ring-amber-200' : ''}`}
                >
                  <Dot kind={ds} className={`h-2 w-2 ${sel ? 'ring-2 ring-white/40' : ''}`} />
                  {r.name}
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {isBoss && !isRop && status === 'review' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800">
          <Dot kind="review" />
          Регион «{region.name}» ждёт вашего согласования — проверьте цифры и утвердите справа вверху.
        </div>
      )}

      <Card className="p-4">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-ink-700">
            Разнесено <span className="num">{fmt(sumAssigned)}</span> из <span className="num">{fmt(sumTotal)}</span> п.е.
          </span>
          <Balance total={sumTotal} assigned={sumAssigned} />
        </div>
        <ProgressBar total={sumTotal} assigned={sumAssigned} />
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3 text-left font-semibold">Гибрид</th>
              <th className="px-3 py-3 text-right font-semibold text-ink-700">План региона</th>
              {tps.map((t) => (
                <th key={t.id} className="px-2 py-3 text-right font-semibold">
                  {t.name.split(' ')[0]}
                </th>
              ))}
              <th className="px-3 py-3 text-right font-semibold">Сверка</th>
              {editable && <th className="px-3 py-3" />}
            </tr>
          </thead>
          <tbody>
            {hybrids.map((h, i) => {
              const c = tpCheck(state, regionId, h.id)
              return (
                <tr key={h.id} className={i % 2 ? 'bg-paper/60' : ''}>
                  <td className="px-5 py-2 font-bold">{h.name}</td>
                  <td className="num px-3 py-2 text-right font-extrabold text-leaf-800">{fmt(c.total)}</td>
                  {tps.map((t) => (
                    <td key={t.id} className="px-2 py-2 text-right">
                      <NumCell
                        value={state.tpPlans.values[regionId]?.[h.id]?.[t.id]}
                        disabled={!editable}
                        onChange={(v) =>
                          dispatch({ type: 'setTpPlan', region: regionId, hybrid: h.id, tp: t.id, value: v })
                        }
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <Balance total={c.total} assigned={c.assigned} />
                  </td>
                  {editable && (
                    <td className="px-3 py-2 text-right">
                      {c.diff > 0 && (
                        <button
                          onClick={() => dispatch({ type: 'distributeTp', region: regionId, hybrid: h.id })}
                          className="rounded-md px-2 py-1 text-xs font-semibold text-leaf-700 hover:bg-leaf-50"
                          title="Распределить остаток поровну по пустым ячейкам"
                        >
                          поровну
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Итого на ТП</td>
              <td className="num px-3 py-3 text-right font-bold text-ink-700">{fmt(sumTotal)}</td>
              {tps.map((t) => {
                const sum = hybrids.reduce(
                  (s, h) => s + (state.tpPlans.values[regionId]?.[h.id]?.[t.id] || 0),
                  0,
                )
                return (
                  <td key={t.id} className="num px-2 py-3 pr-4 text-right font-bold text-ink-700">
                    {fmt(sum)}
                  </td>
                )
              })}
              <td className="px-3 py-3 text-right">
                <Balance total={sumTotal} assigned={sumAssigned} />
              </td>
              {editable && <td />}
            </tr>
          </tfoot>
        </table>
      </Card>

      {editable && !allMatch && (
        <p className="text-xs text-ink-400">
          Отправить на согласование можно, когда по каждому гибриду сумма по ТП совпадает с планом региона.
        </p>
      )}
    </div>
  )
}
