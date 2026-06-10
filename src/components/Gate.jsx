import { useState } from 'react'
import { Btn } from './ui.jsx'

const PASSWORD = 'lgate2026'
const KEY = 'lgate_unlocked'

export const isUnlocked = () => sessionStorage.getItem(KEY) === '1'

export default function Gate({ onUnlock }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (val.trim().toLowerCase() === PASSWORD) {
      sessionStorage.setItem(KEY, '1')
      onUnlock()
    } else {
      setErr(true)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-900 text-sm font-extrabold tracking-tight text-white">
            LG
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">Планирование продаж</div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">демо · Битрикс24</div>
          </div>
        </div>

        <h1 className="mt-7 text-2xl font-extrabold tracking-tight">
          Каскадное планирование на финансовый год
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Закрытый показ: гибриды → регионы → торговые представители → хозяйства. Введите пароль доступа.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            value={val}
            autoFocus
            onChange={(e) => {
              setVal(e.target.value)
              setErr(false)
            }}
            placeholder="Пароль"
            className={`h-12 w-full rounded-xl border bg-paper px-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2
              ${err ? 'border-red-300 ring-red-100 focus:ring-red-100' : 'border-line focus:border-leaf-600 focus:ring-leaf-100'}`}
          />
          {err && <p className="text-xs font-medium text-red-500">Неверный пароль — проверьте и попробуйте ещё раз.</p>}
          <Btn type="submit" className="w-full justify-center py-3">
            Открыть демо
          </Btn>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-400">
          Все данные вымышленные и приведены для демонстрации интерфейса.
        </p>
      </div>
    </div>
  )
}
