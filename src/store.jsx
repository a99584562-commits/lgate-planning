import { createContext, useContext, useEffect, useReducer } from 'react'
import { initialState, HYBRIDS, REGIONS, TPS, FARMS } from './data/seed.js'

const KEY = 'lgate-planning-v1'

const Ctx = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    /* повреждённое состояние — начинаем с seed */
  }
  return initialState
}

const num = (v) => (Number.isFinite(+v) && +v >= 0 ? Math.round(+v) : 0)

function reducer(state, a) {
  switch (a.type) {
    case 'role': {
      // роль определяет стартовый экран
      const step = a.id.startsWith('rop') ? 'tp' : a.id.startsWith('tp') ? 'farms' : state.step
      return { ...state, role: a.id, step }
    }
    case 'step':
      return { ...state, step: a.id }

    case 'toggleHybrid': {
      if (state.hybridSelection.status === 'approved') return state
      const sel = new Set(state.hybridSelection.selected)
      sel.has(a.id) ? sel.delete(a.id) : sel.add(a.id)
      return { ...state, hybridSelection: { ...state.hybridSelection, selected: [...sel] } }
    }
    case 'approveHybrids':
      return { ...state, hybridSelection: { ...state.hybridSelection, status: 'approved' } }
    case 'reopenHybrids':
      return { ...state, hybridSelection: { ...state.hybridSelection, status: 'draft' } }

    case 'setRegionPlan': {
      const values = { ...state.regionPlans.values }
      values[a.hybrid] = { ...(values[a.hybrid] || {}), [a.region]: num(a.value) }
      return { ...state, regionPlans: { ...state.regionPlans, values } }
    }
    case 'setRegionsStatus':
      return { ...state, regionPlans: { ...state.regionPlans, status: a.status } }

    case 'setTpPlan': {
      const values = { ...state.tpPlans.values }
      const region = { ...(values[a.region] || {}) }
      region[a.hybrid] = { ...(region[a.hybrid] || {}), [a.tp]: num(a.value) }
      values[a.region] = region
      return { ...state, tpPlans: { ...state.tpPlans, values } }
    }
    case 'distributeTp': {
      // остаток по гибриду — поровну на пустых ТП, а если пустых нет, докидываем поверх
      const regionTps = TPS.filter((t) => t.region === a.region)
      const row = state.tpPlans.values[a.region]?.[a.hybrid] || {}
      const total = state.regionPlans.values[a.hybrid]?.[a.region] || 0
      const assigned = regionTps.reduce((s, t) => s + (row[t.id] || 0), 0)
      if (assigned >= total) return state
      const empty = regionTps.filter((t) => !row[t.id])
      const targets = empty.length ? empty : regionTps
      const diff = total - assigned
      const share = Math.floor(diff / targets.length)
      const rest = diff - share * targets.length
      const next = { ...row }
      targets.forEach((t, i) => {
        next[t.id] = (next[t.id] || 0) + share + (i === 0 ? rest : 0)
      })
      const values = { ...state.tpPlans.values }
      values[a.region] = { ...(values[a.region] || {}), [a.hybrid]: next }
      return { ...state, tpPlans: { ...state.tpPlans, values } }
    }
    case 'setTpStatus': {
      const status = { ...state.tpPlans.status, [a.region]: a.status }
      return { ...state, tpPlans: { ...state.tpPlans, status } }
    }

    case 'toggleFarm': {
      const cur = new Set(state.farms.selection[a.tp] || [])
      cur.has(a.farm) ? cur.delete(a.farm) : cur.add(a.farm)
      const selection = { ...state.farms.selection, [a.tp]: [...cur] }
      return { ...state, farms: { ...state.farms, selection } }
    }
    case 'setFarmPlan': {
      const values = { ...state.farms.values }
      const tp = { ...(values[a.tp] || {}) }
      tp[a.farm] = { ...(tp[a.farm] || {}), [a.hybrid]: num(a.value) }
      values[a.tp] = tp
      return { ...state, farms: { ...state.farms, values } }
    }
    case 'setFarmStatus': {
      const status = { ...state.farms.status, [a.tp]: a.status }
      let deals = state.deals
      if (a.status === 'approved') {
        // утверждение создаёт сделки в воронке «Выполнение плана»
        const made = []
        const sel = state.farms.selection[a.tp] || []
        sel.forEach((farmId) => {
          const plans = state.farms.values[a.tp]?.[farmId] || {}
          Object.entries(plans).forEach(([hybrid, plan]) => {
            if (plan > 0 && !state.deals.some((d) => d.tp === a.tp && d.farm === farmId && d.hybrid === hybrid))
              made.push({ id: `d${Date.now()}-${farmId}-${hybrid}`, farm: farmId, tp: a.tp, hybrid, plan })
          })
        })
        deals = [...state.deals, ...made]
      }
      return { ...state, farms: { ...state.farms, status }, deals }
    }

    case 'reset':
      return initialState
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch (e) {
      /* квота/приватный режим — демо живёт в памяти */
    }
  }, [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

// ---- селекторы ----

export const hybridById = (id) => HYBRIDS.find((h) => h.id === id)
export const regionById = (id) => REGIONS.find((r) => r.id === id)
export const tpById = (id) => TPS.find((t) => t.id === id)
export const farmById = (id) => FARMS.find((f) => f.id === id)

export const selectedHybrids = (state) =>
  HYBRIDS.filter((h) => state.hybridSelection.selected.includes(h.id))

export const regionTotal = (state, hybridId) =>
  REGIONS.reduce((s, r) => s + (state.regionPlans.values[hybridId]?.[r.id] || 0), 0)

// сверка по региону: план региона vs сумма по ТП
export function tpCheck(state, regionId, hybridId) {
  const total = state.regionPlans.values[hybridId]?.[regionId] || 0
  const row = state.tpPlans.values[regionId]?.[hybridId] || {}
  const assigned = TPS.filter((t) => t.region === regionId).reduce((s, t) => s + (row[t.id] || 0), 0)
  return { total, assigned, diff: total - assigned }
}

// сверка по ТП: план ТП по гибриду vs сумма по хозяйствам
export function farmCheck(state, tpId, hybridId) {
  const tp = tpById(tpId)
  const total = state.tpPlans.values[tp.region]?.[hybridId]?.[tpId] || 0
  const sel = state.farms.selection[tpId] || []
  const assigned = sel.reduce((s, f) => s + (state.farms.values[tpId]?.[f]?.[hybridId] || 0), 0)
  return { total, assigned, diff: total - assigned }
}
