import { useStore } from '../store.jsx'
import { CULTURES, HYBRIDS } from '../data/seed.js'
import { Btn, Card, StatusChip, Check } from './ui.jsx'

// Шаг 1. Выбор гибридов на финансовый год.
// В Б24: карточка смарт-процесса + окно выбора товаров из каталога.
export default function StepHybrids() {
  const { state, dispatch } = useStore()
  const { selected, status } = state.hybridSelection
  const approved = status === 'approved'

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold uppercase tracking-tight">Выбор гибридов</h1>
          <p className="mt-1 text-sm text-ink-500">
            Отметьте гибриды, по которым пойдёт планирование. Количества на этом шаге не нужны.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={status} />
          {approved ? (
            <Btn kind="ghost" onClick={() => dispatch({ type: 'reopenHybrids' })}>
              Изменить выбор
            </Btn>
          ) : (
            <Btn disabled={!selected.length} onClick={() => dispatch({ type: 'approveHybrids' })}>
              Утвердить выбор · {selected.length}
            </Btn>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {CULTURES.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">{c.name}</h2>
              <span className="text-xs text-ink-400">
                {HYBRIDS.filter((h) => h.culture === c.id && selected.includes(h.id)).length} выбрано
              </span>
            </div>
            <div className="space-y-1.5">
              {HYBRIDS.filter((h) => h.culture === c.id).map((h) => {
                const on = selected.includes(h.id)
                return (
                  <button
                    key={h.id}
                    disabled={approved}
                    onClick={() => dispatch({ type: 'toggleHybrid', id: h.id })}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors
                      ${on ? 'border-brand-500 bg-brand-50 text-brand-900' : 'border-line bg-white text-ink-500 hover:border-ink-300'}
                      ${approved ? 'cursor-default opacity-90' : ''}`}
                  >
                    {h.name}
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border
                        ${on ? 'border-brand-500 bg-brand-500 text-white' : 'border-line text-transparent'}`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-ink-400">
        В рабочей версии список приходит из каталога товаров Битрикс24 (разделы BY / KZ / RU), а утверждение
        двигает карточку «Выбор гибридов» по стадиям смарт-процесса.
      </p>
    </div>
  )
}
