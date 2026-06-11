import { useStore, hybridById, tpById, farmById, regionById } from '../store.jsx'
import { Card, fmt } from './ui.jsx'

// Шаг 5. Сделки, автосозданные из утверждённых планов по хозяйствам.
// В Б24 это воронка «Выполнение плана»: сделка + связанная продажа.
export default function StepDeals() {
  const { state } = useStore()
  const deals = state.deals
  const total = deals.reduce((s, d) => s + d.plan, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold uppercase tracking-tight">Сделки · воронка «Выполнение плана»</h1>
        <p className="mt-1 text-sm text-ink-500">
          Создаются автоматически при утверждении планов по хозяйствам — по одной на пару «хозяйство × гибрид».
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Сделок создано</div>
          <div className="num mt-1 text-3xl font-extrabold text-ink-900">{deals.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Суммарный план</div>
          <div className="num mt-1 text-3xl font-extrabold text-brand-600">{fmt(total)} <span className="text-sm font-semibold text-ink-400">п.е.</span></div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Стадия</div>
          <div className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
            Выполнение плана
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        {deals.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-500">
            Пока пусто — утвердите планы по хозяйствам на шаге 4, и сделки появятся здесь.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 text-left font-semibold">Сделка</th>
                <th className="px-3 py-3 text-left font-semibold">Хозяйство</th>
                <th className="px-3 py-3 text-left font-semibold">Гибрид</th>
                <th className="px-3 py-3 text-left font-semibold">ТП</th>
                <th className="px-3 py-3 text-left font-semibold">Регион</th>
                <th className="px-5 py-3 text-right font-semibold">План, п.е.</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d, i) => {
                const farm = farmById(d.farm)
                const tp = tpById(d.tp)
                const region = regionById(tp.region)
                const hybrid = hybridById(d.hybrid)
                return (
                  <tr key={d.id} className={i % 2 ? 'bg-paper/60' : ''}>
                    <td className="px-5 py-2.5 font-semibold text-ink-700">
                      {`${hybrid.name} / ${farm.name.replace(/[«»]/g, '')} / ${state.fy}`}
                    </td>
                    <td className="px-3 py-2.5">{farm.name}</td>
                    <td className="px-3 py-2.5 font-bold">{hybrid.name}</td>
                    <td className="px-3 py-2.5 text-ink-500">{tp.name}</td>
                    <td className="px-3 py-2.5 text-ink-500">{region.name}</td>
                    <td className="num px-5 py-2.5 text-right font-extrabold text-ink-900">{fmt(d.plan)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>

      <p className="text-xs leading-relaxed text-ink-400">
        В рабочей версии сделки создаются в реальной воронке Битрикс24 со связанной продажей — как настроено сейчас,
        данные остаются в текущих смарт-процессах.
      </p>
    </div>
  )
}
