import { useState } from 'react'
import { useStore, selectedHybrids, farmCheck, tpById, farmById, tpDistStatus, tally } from '../store.jsx'
import { FARMS, TPS, ROLES } from '../data/seed.js'
import { Btn, Card, StatusChip, NumCell, fmt, Balance, ProgressBar, Check, Dot, DistSummary } from './ui.jsx'

// Шаг 4. План ТП → конечные потребители (хозяйства).
// В Б24: фильтр в справочнике компаний + «Умный сценарий» + карточки по хозяйствам.
export default function StepFarms() {
  const { state, dispatch } = useStore()
  const role = ROLES.find((r) => r.id === state.role)
  const isTp = !!role.tp
  const isBoss = state.role === 'cd'
  const tpsWithPlans = TPS.filter((t) =>
    selectedHybrids(state).some((h) => (state.tpPlans.values[t.region]?.[h.id]?.[t.id] || 0) > 0),
  )
  const [picked, setPicked] = useState(role.tp || 'shahov')
  const tpId = isTp ? role.tp : picked
  const tp = tpById(tpId)
  const hybrids = selectedHybrids(state).filter((h) => (state.tpPlans.values[tp.region]?.[h.id]?.[tpId] || 0) > 0)
  const myFarms = FARMS.filter((f) => f.tp === tpId)
  const selection = state.farms.selection[tpId] || []
  const status = state.farms.status[tpId] || 'draft'
  const editable = status === 'draft' && (isTp ? role.tp === tpId : isBoss)

  const checks = hybrids.map((h) => farmCheck(state, tpId, h.id))
  const allMatch = checks.length > 0 && checks.every((c) => c.diff === 0)
  const sumTotal = checks.reduce((s, c) => s + c.total, 0)
  const sumAssigned = checks.reduce((s, c) => s + c.assigned, 0)

  if (hybrids.length === 0)
    return (
      <Card className="p-10 text-center text-sm text-ink-500">
        У этого торгового представителя пока нет утверждённого плана — сначала РОП разносит план региона (шаг 3).
      </Card>
    )

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">План по конечным потребителям</h1>
          <p className="mt-1 text-sm text-ink-500">
            {isTp
              ? 'Выберите свои хозяйства и разнесите личный план по гибридам.'
              : 'Просмотр и согласование планов по хозяйствам каждого ТП.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={status} />
          {editable && (
            <Btn disabled={!allMatch} onClick={() => dispatch({ type: 'setFarmStatus', tp: tpId, status: 'review' })}>
              Отправить на согласование
            </Btn>
          )}
          {status === 'review' && isBoss && (
            <>
              <Btn kind="ghost" onClick={() => dispatch({ type: 'setFarmStatus', tp: tpId, status: 'draft' })}>
                Вернуть в работу
              </Btn>
              <Btn onClick={() => dispatch({ type: 'setFarmStatus', tp: tpId, status: 'approved' })}>
                Утвердить · создать сделки
              </Btn>
            </>
          )}
        </div>
      </div>

      {!isTp && (
        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Торговые представители · статус
            </span>
            <DistSummary counts={tally(tpsWithPlans, (t) => tpDistStatus(state, t.id))} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tpsWithPlans.map((t) => {
              const ds = tpDistStatus(state, t.id)
              const sel = t.id === tpId
              return (
                <button
                  key={t.id}
                  onClick={() => setPicked(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors
                    ${sel ? 'border-leaf-800 bg-leaf-800 text-white' : 'border-line bg-white text-ink-500 hover:border-ink-300'}
                    ${!sel && ds === 'review' ? 'ring-2 ring-amber-200' : ''}`}
                >
                  <Dot kind={ds} className={`h-2 w-2 ${sel ? 'ring-2 ring-white/40' : ''}`} />
                  {t.name}
                  <span className="opacity-60">· {t.region === 'yug' ? 'Юг' : t.region === 'ural' ? 'Урал' : 'Волга-Дон'}</span>
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {isBoss && !isTp && status === 'review' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800">
          <Dot kind="review" />
          {tp.name} отправил планы по хозяйствам на согласование — проверьте и утвердите справа вверху.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px,1fr]">
        <Card className="self-start p-4">
          <h2 className="mb-1 text-sm font-bold">Мои хозяйства</h2>
          <p className="mb-3 text-xs text-ink-400">Справочник компаний, отфильтрован по закреплению за ТП</p>
          <div className="space-y-1.5">
            {myFarms.map((f) => {
              const on = selection.includes(f.id)
              return (
                <button
                  key={f.id}
                  disabled={!editable}
                  onClick={() => dispatch({ type: 'toggleFarm', tp: tpId, farm: f.id })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors
                    ${on ? 'border-leaf-600 bg-leaf-50' : 'border-line bg-white hover:border-ink-300'}
                    ${!editable ? 'cursor-default opacity-90' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold ${on ? 'text-leaf-900' : 'text-ink-700'}`}>{f.name}</span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border
                        ${on ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-line text-transparent'}`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-ink-400">
                    ИНН {f.inn} · {f.area}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-ink-700">
                {tp.name} · разнесено <span className="num">{fmt(sumAssigned)}</span> из{' '}
                <span className="num">{fmt(sumTotal)}</span> п.е.
              </span>
              <Balance total={sumTotal} assigned={sumAssigned} />
            </div>
            <ProgressBar total={sumTotal} assigned={sumAssigned} />
          </Card>

          {selection.length === 0 ? (
            <Card className="p-10 text-center text-sm text-ink-500">
              Отметьте хозяйства слева — для каждого появится колонка в матрице планирования.
            </Card>
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3 text-left font-semibold">Гибрид</th>
                    <th className="px-3 py-3 text-right font-semibold text-ink-700">Мой план</th>
                    {selection.map((fid) => (
                      <th key={fid} className="max-w-[120px] px-2 py-3 text-right font-semibold">
                        {farmById(fid).name.replace(/[«»]/g, '')}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-semibold">Сверка</th>
                  </tr>
                </thead>
                <tbody>
                  {hybrids.map((h, i) => {
                    const c = farmCheck(state, tpId, h.id)
                    return (
                      <tr key={h.id} className={i % 2 ? 'bg-paper/60' : ''}>
                        <td className="px-5 py-2 font-bold">{h.name}</td>
                        <td className="num px-3 py-2 text-right font-extrabold text-leaf-800">{fmt(c.total)}</td>
                        {selection.map((fid) => (
                          <td key={fid} className="px-2 py-2 text-right">
                            <NumCell
                              value={state.farms.values[tpId]?.[fid]?.[h.id]}
                              disabled={!editable}
                              onChange={(v) =>
                                dispatch({ type: 'setFarmPlan', tp: tpId, farm: fid, hybrid: h.id, value: v })
                              }
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-right">
                          <Balance total={c.total} assigned={c.assigned} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}

          {editable && !allMatch && selection.length > 0 && (
            <p className="text-xs text-ink-400">
              Согласование откроется, когда по каждому гибриду сумма по хозяйствам совпадёт с вашим планом.
            </p>
          )}
          {status === 'approved' && (
            <p className="text-xs font-medium text-leaf-700">
              Планы утверждены — сделки созданы в воронке «Выполнение плана» (шаг 5).
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
