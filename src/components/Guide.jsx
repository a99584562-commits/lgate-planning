import { useEffect } from 'react'
import { Dot } from './ui.jsx'
import BrandMark from './BrandMark.jsx'

// Иллюстрация каскада: план спускается сверху вниз и на каждом уровне дробится.
function CascadeArt() {
  const levels = [
    { y: 16, w: 360, x: 20, label: '1 · ГИБРИДЫ', sub: 'что планируем', tone: '#101813' },
    { y: 64, w: 300, x: 50, label: '2 · РЕГИОНЫ', sub: 'план на 5 регионов', tone: '#15603f' },
    { y: 112, w: 240, x: 80, label: '3 · ТОРГ. ПРЕДСТАВИТЕЛИ', sub: 'РОП дробит план региона', tone: '#1a7a4f' },
    { y: 160, w: 180, x: 110, label: '4 · ХОЗЯЙСТВА', sub: 'ТП дробит на клиентов', tone: '#22995f' },
    { y: 208, w: 120, x: 140, label: '5 · СДЕЛКИ', sub: 'создаются авто', tone: '#e3002d' },
  ]
  return (
    <svg viewBox="0 0 400 248" className="w-full" role="img" aria-label="Схема каскадного планирования">
      {levels.map((l, i) => (
        <g key={i}>
          {i > 0 && (
            <path
              d={`M ${levels[i - 1].x + 16} ${levels[i - 1].y + 34} L ${l.x + 16} ${l.y}`}
              stroke="#d8d6cc"
              strokeWidth="2"
              fill="none"
            />
          )}
          <rect x={l.x} y={l.y} width={l.w} height="34" rx="8" fill={l.tone} opacity={i === 4 ? 1 : 0.92} />
          <text x={l.x + 14} y={l.y + 15} fill="#fff" fontSize="11" fontWeight="700" fontFamily="Inter">
            {l.label}
          </text>
          <text x={l.x + 14} y={l.y + 28} fill="#ffffff" opacity="0.8" fontSize="9" fontFamily="Inter">
            {l.sub}
          </text>
        </g>
      ))}
    </svg>
  )
}

// Мини-иллюстрация: таблица-матрица вместо россыпи карточек.
function MatrixArt() {
  return (
    <svg viewBox="0 0 200 110" className="w-full" role="img" aria-label="Матрица планирования">
      <rect x="0" y="0" width="200" height="110" rx="8" fill="#fff" stroke="#e6e4dc" />
      {/* header row */}
      <rect x="0" y="0" width="200" height="20" fill="#f6f6f4" />
      <text x="8" y="14" fontSize="8" fontWeight="700" fontFamily="Inter" fill="#5b6b60">
        ГИБРИД
      </text>
      {['Юг', 'Центр', 'Волга', 'Урал'].map((r, i) => (
        <text key={r} x={70 + i * 32} y="14" fontSize="8" fontFamily="Inter" fill="#8a978d">
          {r}
        </text>
      ))}
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <text x="8" y={38 + row * 26} fontSize="8" fontWeight="700" fontFamily="Inter" fill="#101813">
            {['АБСОЛЮТ', 'АВГУСТ', 'АЗУРИТ'][row]}
          </text>
          {[0, 1, 2, 3].map((c) => (
            <rect key={c} x={66 + c * 32} y={30 + row * 26} width="26" height="14" rx="3" fill="#f1f8f4" />
          ))}
        </g>
      ))}
    </svg>
  )
}

const STEPS = [
  {
    n: 1,
    title: 'Выбор гибридов',
    who: 'Коммерческий директор',
    text: 'Отмечаете гибриды, по которым в этом году будет план. Галочками, без цифр. В рабочей версии список тянется из каталога товаров Битрикс24.',
  },
  {
    n: 2,
    title: 'План на регионы',
    who: 'Коммерческий директор',
    text: 'Одна таблица: строка — гибрид, колонка — регион. Вписываете план в посевных единицах. Заменяет десятки отдельных карточек в смарт-процессе.',
  },
  {
    n: 3,
    title: 'План на торговых представителей',
    who: 'РОП региона',
    text: 'РОП берёт план своего региона и раскидывает по своей команде. Сумма по ТП сверяется с планом региона прямо в строке — кнопка «поровну» делит остаток автоматически.',
  },
  {
    n: 4,
    title: 'План по хозяйствам',
    who: 'Торговый представитель',
    text: 'ТП отмечает свои хозяйства (клиентов) и распределяет личный план по ним. Снова живая сверка с планом ТП.',
  },
  {
    n: 5,
    title: 'Сделки',
    who: 'Создаются автоматически',
    text: 'После утверждения планов по хозяйствам система сама создаёт сделки в воронке «Выполнение плана» — по одной на пару «хозяйство × гибрид».',
  },
]

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-ink-900">{title}</h3>
      {children}
    </section>
  )
}

export default function Guide({ onClose }) {
  // закрытие по Esc
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 p-4 backdrop-blur-sm sm:p-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
        <div className="h-1.5 bg-brand-500" />
        {/* шапка модалки */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 p-1.5 text-white">
            <BrandMark className="h-full w-full" />
          </div>
          <div className="mr-auto font-display text-lg font-semibold uppercase tracking-tight">Как это работает</div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 hover:bg-stone-100 hover:text-ink-900"
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          {/* интро + схема каскада */}
          <div className="grid gap-5 sm:grid-cols-[1fr,300px] sm:items-center">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold uppercase leading-tight tracking-tight">
                Каскадное планирование на финансовый год
              </h2>
              <p className="text-sm leading-relaxed text-ink-500">
                План спускается сверху вниз и на каждом уровне дробится: компания → регионы → торговые представители →
                хозяйства. На каждом шаге система сама сверяет, что сумма вниз совпадает с планом сверху. Это замена
                ручной работе в смарт-процессах Битрикс24 — наглядными таблицами вместо сотен карточек.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4">
              <CascadeArt />
            </div>
          </div>

          {/* роли */}
          <Section title="Кто что делает">
            <p className="text-sm text-ink-500">
              Роль переключается вверху справа — каждый видит только свой участок:
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { s: 'КД', t: 'Коммерческий директор', d: 'Выбирает гибриды, ставит план на регионы, согласует и утверждает работу РОПов и ТП.' },
                { s: 'РОП', t: 'Руководитель отдела продаж', d: 'Видит план только своего региона. Раскидывает его по своим торговым представителям.' },
                { s: 'ТП', t: 'Торговый представитель', d: 'Видит свой личный план. Распределяет его по своим хозяйствам-клиентам.' },
              ].map((r) => (
                <div key={r.s} className="rounded-2xl border border-line p-4">
                  <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                    {r.s}
                  </span>
                  <div className="mt-2 text-sm font-bold">{r.t}</div>
                  <div className="mt-1 text-xs leading-relaxed text-ink-500">{r.d}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* 5 шагов */}
          <Section title="Пять шагов">
            <div className="space-y-2.5">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-4 rounded-2xl border border-line p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-bold">{s.title}</span>
                      <span className="text-xs font-medium text-ink-400">— {s.who}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* матрица + сверка */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Section title="Таблица вместо карточек">
              <div className="rounded-2xl border border-line bg-paper p-4">
                <MatrixArt />
              </div>
              <p className="text-xs leading-relaxed text-ink-500">
                Везде, где раньше создавали отдельную карточку на каждый гибрид и регион, теперь одна сетка. Кликаете в
                ячейку и вписываете число.
              </p>
            </Section>

            <Section title="Живая сверка">
              <div className="space-y-2 rounded-2xl border border-line p-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-600">осталось 300</span>
                  <span className="text-ink-400">— распределили не весь план</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-500">перебор 200</span>
                  <span className="text-ink-400">— раздали больше, чем есть</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-leaf-600">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    сошлось
                  </span>
                  <span className="text-ink-400">— сумма вниз = план сверху</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-ink-500">
                Отправить план на согласование можно только когда по всем гибридам «сошлось».
              </p>
            </Section>
          </div>

          {/* статусы */}
          <Section title="Цвета статусов">
            <div className="grid gap-2 rounded-2xl border border-line p-4 sm:grid-cols-2">
              {[
                ['review', 'Ждут согласования', 'РОП/ТП прислал — нужно проверить и утвердить'],
                ['progress', 'В работе', 'Начали разносить, но ещё не отправили'],
                ['approved', 'Утверждено', 'Проверено и закрыто'],
                ['empty', 'Не начато', 'К планированию ещё не приступали (по умолчанию скрыто)'],
              ].map(([k, label, d]) => (
                <div key={k} className="flex items-start gap-2.5">
                  <Dot kind={k} className="mt-1.5 h-2.5 w-2.5" />
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-ink-500">{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-ink-500">
              Янтарный кружок с цифрой на шагах «Торговые представители» и «Хозяйства» — это очередь на согласование
              лично для КД.
            </p>
          </Section>

          {/* кнопки */}
          <Section title="Кнопки вверху">
            <div className="space-y-2 rounded-2xl border border-line p-4 text-sm">
              <div>
                <span className="font-semibold">Демо-пример</span>
                <span className="text-ink-500"> — вернуть заполненный сценарий со всеми стадиями (для показа).</span>
              </div>
              <div>
                <span className="font-semibold text-brand-600">Чистый старт</span>
                <span className="text-ink-500"> — обнулить всё и пройти процесс с нуля своими руками.</span>
              </div>
              <div>
                <span className="font-semibold">Роль</span>
                <span className="text-ink-500"> — переключиться между КД, РОП и ТП, чтобы увидеть процесс их глазами.</span>
              </div>
            </div>
          </Section>

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-paper px-5 py-4">
            <p className="text-xs text-ink-500">
              Совет: начните с роли «Коммерческий директор» и кнопки «Чистый старт» — пройдёте все 5 шагов по порядку.
            </p>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
