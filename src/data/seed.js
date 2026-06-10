// Справочники демо. Гибриды и регионы — как на портале клиента,
// сотрудники и хозяйства — вымышленные.

export const FY = 'FY2026'

export const CULTURES = [
  { id: 'corn', name: 'Кукуруза' },
  { id: 'sunflower', name: 'Подсолнечник' },
  { id: 'osr', name: 'Рапс озимый' },
]

export const HYBRIDS = [
  { id: 'absolut', name: 'АБСОЛЮТ', culture: 'corn' },
  { id: 'avgust', name: 'АВГУСТ', culture: 'corn' },
  { id: 'adevey', name: 'АДЭВЕЙ', culture: 'corn' },
  { id: 'azurit', name: 'АЗУРИТ', culture: 'sunflower' },
  { id: 'akela', name: 'АКЕЛА', culture: 'sunflower' },
  { id: 'megasan', name: 'МЕГАСАН', culture: 'sunflower' },
  { id: 'alexander', name: 'АЛЕКСАНДЕР', culture: 'osr' },
  { id: 'akila', name: 'АКИЛА', culture: 'osr' },
]

export const REGIONS = [
  { id: 'yug', name: 'Юг', rop: 'Корнев Алексей' },
  { id: 'center', name: 'Центр', rop: 'Светлова Мария' },
  { id: 'volga', name: 'Волга', rop: 'Лапин Дмитрий' },
  { id: 'volgadon', name: 'Волга-Дон', rop: 'Зорин Александр' },
  { id: 'ural', name: 'Урал', rop: 'Хабиров Ринат' },
]

export const TPS = [
  { id: 'shahov', name: 'Шахов Аслан', region: 'yug' },
  { id: 'nevzorov', name: 'Невзоров Игорь', region: 'yug' },
  { id: 'kolosov', name: 'Колосов Владислав', region: 'yug' },
  { id: 'yudin', name: 'Юдин Евгений', region: 'yug' },
  { id: 'svetlov', name: 'Светлов Олег', region: 'center' },
  { id: 'ermakov', name: 'Ермаков Пётр', region: 'center' },
  { id: 'vlasov', name: 'Власов Никита', region: 'volga' },
  { id: 'somov', name: 'Сомов Глеб', region: 'volga' },
  { id: 'kuznec', name: 'Кузнецов Михаил', region: 'volgadon' },
  { id: 'shestakov', name: 'Шестаков Семён', region: 'volgadon' },
  { id: 'tremasov', name: 'Тремасов Кирилл', region: 'volgadon' },
  { id: 'muratov', name: 'Муратов Дамир', region: 'ural' },
  { id: 'bragin', name: 'Брагин Артур', region: 'ural' },
  { id: 'yuldashev', name: 'Юлдашев Ильдар', region: 'ural' },
]

// Конечные потребители (хозяйства) — закреплены за ТП
export const FARMS = [
  { id: 'f1', name: 'Агрофирма «Степь»', inn: '2310123456', area: '12 400 га', tp: 'shahov' },
  { id: 'f2', name: 'КФХ «Колос»', inn: '2310234567', area: '3 800 га', tp: 'shahov' },
  { id: 'f3', name: '«Заря Кубани»', inn: '2310345678', area: '8 900 га', tp: 'shahov' },
  { id: 'f4', name: 'Агрохолдинг «Простор»', inn: '6160456789', area: '21 300 га', tp: 'shahov' },
  { id: 'f5', name: '«Нива Черноземья»', inn: '3660567890', area: '15 200 га', tp: 'nevzorov' },
  { id: 'f6', name: 'СПК «Рассвет»', inn: '3660678901', area: '5 600 га', tp: 'nevzorov' },
  { id: 'f7', name: '«АгроДон»', inn: '6140789012', area: '9 700 га', tp: 'kolosov' },
  { id: 'f8', name: 'КФХ «Хутор Весёлый»', inn: '6140890123', area: '2 100 га', tp: 'kolosov' },
  { id: 'f9', name: '«ЭкоПоле»', inn: '6450901234', area: '7 300 га', tp: 'yudin' },
  { id: 'f10', name: '«УралАгро»', inn: '0260112345', area: '11 800 га', tp: 'muratov' },
  { id: 'f11', name: 'СПК «Урожай»', inn: '0260223456', area: '4 500 га', tp: 'muratov' },
  { id: 'f12', name: '«Донские Нивы»', inn: '6160334567', area: '13 600 га', tp: 'kuznec' },
]

// Демо-роли. management утверждает согласования, кд ведёт шаги 1–2.
export const ROLES = [
  { id: 'cd', label: 'Коммерческий директор', short: 'КД', person: 'Ковалёв Андрей' },
  { id: 'rop-yug', label: 'РОП · Юг', short: 'РОП', person: 'Корнев Алексей', region: 'yug' },
  { id: 'rop-volgadon', label: 'РОП · Волга-Дон', short: 'РОП', person: 'Зорин Александр', region: 'volgadon' },
  { id: 'rop-ural', label: 'РОП · Урал', short: 'РОП', person: 'Хабиров Ринат', region: 'ural' },
  { id: 'tp-shahov', label: 'ТП · Шахов (Юг)', short: 'ТП', person: 'Шахов Аслан', tp: 'shahov' },
]

const SELECTED_HYBRIDS = ['absolut', 'avgust', 'azurit', 'alexander']

// Утверждённый план Гибрид × Регион, в посевных единицах
const REGION_PLANS = {
  absolut: { yug: 6000, center: 2000, volga: 0, volgadon: 1000, ural: 500 },
  avgust: { yug: 4500, center: 500, volga: 0, volgadon: 1000, ural: 2000 },
  azurit: { yug: 5000, center: 1000, volga: 500, volgadon: 500, ural: 1000 },
  alexander: { yug: 3000, center: 0, volga: 1500, volgadon: 2500, ural: 0 },
}

// Юг разнесён полностью и утверждён
const TP_PLANS = {
  yug: {
    absolut: { shahov: 2500, nevzorov: 1500, kolosov: 1200, yudin: 800 },
    avgust: { shahov: 1500, nevzorov: 1200, kolosov: 1000, yudin: 800 },
    azurit: { shahov: 2000, nevzorov: 1300, kolosov: 1000, yudin: 700 },
    alexander: { shahov: 1200, nevzorov: 800, kolosov: 600, yudin: 400 },
  },
  // Волга-Дон в работе: разнесено не всё (демо расхождения)
  volgadon: {
    absolut: { kuznec: 400, shestakov: 300, tremasov: 0 },
    avgust: { kuznec: 500, shestakov: 200, tremasov: 100 },
    azurit: {},
    alexander: { kuznec: 1000, shestakov: 800, tremasov: 400 },
  },
  // Урал разнесён, отправлен на согласование
  ural: {
    absolut: { muratov: 300, bragin: 100, yuldashev: 100 },
    avgust: { muratov: 800, bragin: 700, yuldashev: 500 },
    azurit: { muratov: 400, bragin: 300, yuldashev: 300 },
    alexander: {},
  },
}

// Невзоров уже утверждён (есть сделки), Шахов — на согласовании
const FARM_SELECTION = {
  shahov: ['f1', 'f2', 'f4'],
  nevzorov: ['f5', 'f6'],
}

const FARM_PLANS = {
  shahov: {
    f1: { absolut: 1200, avgust: 700, azurit: 900, alexander: 600 },
    f2: { absolut: 300, avgust: 200, azurit: 300, alexander: 100 },
    f4: { absolut: 1000, avgust: 600, azurit: 800, alexander: 500 },
  },
  nevzorov: {
    f5: { absolut: 1000, avgust: 800, azurit: 900, alexander: 500 },
    f6: { absolut: 500, avgust: 400, azurit: 400, alexander: 300 },
  },
}

const DEALS = [
  { id: 'd1', farm: 'f5', tp: 'nevzorov', hybrid: 'absolut', plan: 1000 },
  { id: 'd2', farm: 'f5', tp: 'nevzorov', hybrid: 'avgust', plan: 800 },
  { id: 'd3', farm: 'f5', tp: 'nevzorov', hybrid: 'azurit', plan: 900 },
  { id: 'd4', farm: 'f5', tp: 'nevzorov', hybrid: 'alexander', plan: 500 },
  { id: 'd5', farm: 'f6', tp: 'nevzorov', hybrid: 'absolut', plan: 500 },
  { id: 'd6', farm: 'f6', tp: 'nevzorov', hybrid: 'avgust', plan: 400 },
  { id: 'd7', farm: 'f6', tp: 'nevzorov', hybrid: 'azurit', plan: 400 },
  { id: 'd8', farm: 'f6', tp: 'nevzorov', hybrid: 'alexander', plan: 300 },
]

export const initialState = {
  role: 'cd',
  step: 'regions',
  hybridSelection: { selected: SELECTED_HYBRIDS, status: 'approved' },
  regionPlans: { values: REGION_PLANS, status: 'approved' },
  tpPlans: {
    values: TP_PLANS,
    status: { yug: 'approved', volgadon: 'draft', ural: 'review', center: 'draft', volga: 'draft' },
  },
  farms: {
    selection: FARM_SELECTION,
    values: FARM_PLANS,
    status: { shahov: 'review', nevzorov: 'approved' },
  },
  deals: DEALS,
}
