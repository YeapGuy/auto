import {
  ALT_PRICES,
  BOLT_DEADHEAD,
  CITIES,
  CO2_MODES,
  FUELS,
  INVEST_RETURN,
  TREE_KG_PER_YEAR,
} from './data.js'

// Typické auto taxislužby/Boltu — z neho počítame emisie jazdy autom navyše.
export const TAXI_CONSUMPTION = 6.8 // l/100 km, benzín

/** Ročné náklady auta rozpísané po položkách. */
export function computeCar(car) {
  const years = Math.max(1, car.years)
  const residual = car.price * Math.pow(1 - car.depreciation, years)
  const depreciation = (car.price - residual) / years

  const fuelUnits = (car.kmYear / 100) * car.consumption
  const fuel = fuelUnits * car.fuelPrice

  const items = [
    { key: 'depreciation', label: 'Strata hodnoty auta', value: depreciation, color: '#c2562f' },
    { key: 'fuel', label: car.fuel === 'ev' ? 'Elektrina' : 'Palivo / energia', value: fuel, color: '#d9873a' },
    { key: 'insurance', label: 'PZP a havarijné', value: car.pzp + car.kasko, color: '#b59a35' },
    { key: 'service', label: 'Servis a opravy', value: car.service, color: '#6d9a49' },
    { key: 'tyres', label: 'Pneumatiky', value: car.tyres, color: '#2f8f6b' },
    { key: 'parking', label: 'Parkovanie', value: car.parking, color: '#2d7f88' },
    { key: 'fees', label: 'Diaľničná známka, STK a EK', value: car.vignette + car.stk, color: '#3f6b7d' },
    { key: 'other', label: 'Umývanie, doplnky, drobnosti', value: car.other, color: '#8b9683' },
  ].filter((i) => i.value > 0)

  const total = items.reduce((s, i) => s + i.value, 0)
  const co2Total = fuelUnits * FUELS[car.fuel].co2 // kg CO₂e za rok
  const occupancy = Math.max(1, car.occupancy || 1)

  return {
    items,
    total,
    monthly: total / 12,
    perKm: car.kmYear > 0 ? total / car.kmYear : 0,
    residual,
    depreciation,
    fuel,
    fuelUnits,
    co2Total,
    co2PerKm: car.kmYear > 0 ? (co2Total * 1000) / (car.kmYear * occupancy) : 0, // g/os.km
    co2Compare: co2Total / occupancy, // kg/rok prepočítané na jedného cestujúceho
  }
}

/**
 * Koľko stojí jeden kilometer navyše v aute, ktoré v domácnosti aj tak ostáva.
 * Fixné položky (PZP, známka, STK, parkovanie, strata hodnoty) sú zaplatené
 * bez ohľadu na to, či ním niekto pôjde, preto do hraničnej ceny nepatria.
 * Ostáva palivo a opotrebenie, ktoré s kilometrami naozaj rastie.
 */
export function marginalPerKm(car) {
  const fuelPerKm = (car.consumption / 100) * car.fuelPrice
  const wearPerKm = car.kmYear > 0 ? (car.service + car.tyres) / car.kmYear : 0
  return fuelPerKm + wearPerKm
}

/** Emisie auta na kilometer v gramoch CO₂e, bez ohľadu na počet cestujúcich. */
export function carCo2PerKm(car) {
  return (car.consumption / 100) * FUELS[car.fuel].co2 * 1000
}

/** Rozdelenie ročných kilometrov medzi alternatívne spôsoby dopravy. */
export function splitKm(kmYear, alloc) {
  return {
    car2: kmYear * (alloc.car2 || 0),
    mhd: kmYear * (alloc.mhd || 0),
    regbus: kmYear * (alloc.regbus || 0),
    train: kmYear * (alloc.train || 0),
    coach: kmYear * (alloc.coach || 0),
    bike: kmYear * (alloc.bike || 0),
    bolt: kmYear * (alloc.bolt || 0),
  }
}

/**
 * Ročné náklady a emisie zvolenej kombinácie alternatív.
 *
 * Auto vezie celú skupinu za jednu cenu, alternatíva si pýta lístok za každého.
 * Preto tu na počte ľudí záleží: predplatné, vlak, autobus aj bicykel sa násobia
 * hlavami, kým jazda Boltom stojí to isté, či v nej sedí jeden alebo štyria.
 */
export function computeAlt(kmYear, alloc, opts) {
  const km = splitKm(kmYear, alloc)
  const city = CITIES.find((c) => c.id === opts.city) || CITIES[0]
  const prices = { ...ALT_PRICES, ...(opts.prices || {}) }
  const bikeFactor = opts.bikeType === 'ebike' ? CO2_MODES.ebike : CO2_MODES.bike
  const bikeCost = opts.bikeType === 'ebike' ? prices.ebikeYear : prices.bikeYear

  const adults = Math.max(0, Math.round(opts.people?.adults ?? 1))
  const children = Math.max(0, Math.round(opts.people?.children ?? 0))
  const heads = Math.max(1, adults + children)
  // Koľko platiacich dospelých stojí skupina na jednotlivých lístkoch.
  const regbusFares = adults + children * prices.regbusChildRate
  const trainFares = adults + children * prices.trainChildRate
  const coachFares = adults + children * prices.coachChildRate
  const per = (n) => (heads > 1 ? ` × ${fmtNum(n, n % 1 ? 2 : 0)}` : '')

  const boltTrips = prices.boltTripKm > 0 ? km.bolt / prices.boltTripKm : 0
  const taxiCo2PerKm = (TAXI_CONSUMPTION / 100) * FUELS.petrol.co2 * 1000 * BOLT_DEADHEAD // g/km

  const car2PerKm = opts.car2PerKm ?? prices.car2PerKm
  const car2Co2PerKm = opts.car2Co2PerKm ?? prices.car2Co2PerKm

  const items = [
    {
      key: 'car2',
      label: 'Iné auto v domácnosti',
      // Auto odvezie celú skupinu za jednu cenu, preto sa tu — rovnako ako pri
      // Bolte — nenásobí počtom ľudí.
      detail: `${fmtKm(km.car2)} km ročne × ${fmtNum(car2PerKm, 3)} €/km, len palivo a opotrebenie`,
      value: km.car2 * car2PerKm,
      co2: (km.car2 * car2Co2PerKm) / 1000,
      km: km.car2,
      color: '#9a6b3f',
    },
    {
      key: 'mhd',
      label: `Predplatný lístok MHD — ${city.label.split(' — ')[0]}`,
      detail:
        `${fmtKm(km.mhd)} km ročne, ročný lístok ${fmtEur(city.year)}` +
        (children > 0 ? `, detský ${fmtEur(city.yearChild)}` : '') +
        (heads > 1 ? ` × ${adults} dosp.${children ? ` + ${children} det.` : ''}` : ''),
      value:
        km.mhd > 0 && opts.hasPass !== false ? adults * city.year + children * city.yearChild : 0,
      co2: (km.mhd * heads * CO2_MODES.mhd) / 1000,
      km: km.mhd,
      color: '#2d8f8f',
    },
    {
      key: 'regbus',
      label: 'Prímestský autobus',
      detail: `${fmtKm(km.regbus)} km ročne × ${fmtNum(prices.regbusPerKm, 3)} €/km${per(regbusFares)}`,
      value: km.regbus * prices.regbusPerKm * regbusFares,
      co2: (km.regbus * heads * CO2_MODES.regbus) / 1000,
      km: km.regbus,
      color: '#4e9b6b',
    },
    {
      key: 'train',
      label: 'Vlak (ZSSK)',
      detail: `${fmtKm(km.train)} km ročne × ${fmtNum(prices.trainPerKm, 3)} €/km${per(trainFares)}`,
      value: km.train * prices.trainPerKm * trainFares,
      co2: (km.train * heads * CO2_MODES.train) / 1000,
      km: km.train,
      color: '#1d7a4c',
    },
    {
      key: 'coach',
      label: 'Diaľkový autobus',
      detail: `${fmtKm(km.coach)} km ročne × ${fmtNum(prices.coachPerKm, 3)} €/km${per(coachFares)}`,
      value: km.coach * prices.coachPerKm * coachFares,
      co2: (km.coach * heads * CO2_MODES.coach) / 1000,
      km: km.coach,
      color: '#6da13f',
    },
    {
      key: 'bike',
      label: opts.bikeType === 'ebike' ? 'Elektrobicykel' : 'Bicykel',
      detail:
        `${fmtKm(km.bike)} km ročne, amortizácia a servis` +
        (heads > 1 ? `, ${heads}× bicykel` : ''),
      value: km.bike > 0 ? bikeCost * heads : 0,
      co2: (km.bike * heads * bikeFactor) / 1000,
      km: km.bike,
      color: '#b59a35',
    },
    {
      key: 'bolt',
      label: 'Bolt / taxík',
      detail:
        `${Math.round(boltTrips)} jázd ročne po ${fmtEur(prices.boltTripAvg, 2)}` +
        (heads > 1 ? ', jedna jazda za celú skupinu' : ''),
      value: boltTrips * prices.boltTripAvg,
      co2: (km.bolt * taxiCo2PerKm) / 1000,
      km: km.bolt,
      color: '#c2562f',
    },
  ]

  const total = items.reduce((s, i) => s + i.value, 0)
  const co2Total = items.reduce((s, i) => s + i.co2, 0)
  const covered = Object.values(km).reduce((s, v) => s + v, 0)

  return {
    items,
    km,
    total,
    monthly: total / 12,
    co2Total,
    covered,
    coverage: kmYear > 0 ? covered / kmYear : 0,
    boltTrips,
    heads,
  }
}

/**
 * Preklopenie alternatívy medzi mestom a vidiekom. Podiel kilometrov si
 * používateľ nastavil sám, preto ho pri prepnutí neresetujeme — len ho
 * presunieme na dopravu, ktorá v danom prostredí vôbec existuje: mestské
 * predplatné mimo miest nekúpiš, prímestský autobus v meste nepotrebuješ.
 */
export function toArea(alloc, area) {
  const out = { ...alloc }
  if (area === 'rural') {
    out.regbus = (out.regbus || 0) + (out.mhd || 0)
    out.mhd = 0
  } else {
    out.mhd = (out.mhd || 0) + (out.regbus || 0)
    out.regbus = 0
  }
  return out
}

/**
 * Zaokrúhli hodnotu na „pekný“ krok, aby hlavička nepredstierala presnosť na
 * euro. Bez zadaného kroku ho odvodí z rádu čísla (dve platné číslice).
 * Zaokrúhľuje na najbližší násobok, nie von: hodnota tesne nad hranicou kroku
 * (napr. 75,2 %) by inak vyskočila o celý krok vyššie (80 %), čo klame viac
 * než tá pôvodná nepresnosť.
 */
export function roundTo(v, step) {
  const mag = Math.max(Math.abs(v), 1)
  const s = step || Math.max(1, Math.pow(10, Math.floor(Math.log10(mag)) - 1))
  return Math.round(v / s) * s
}

/** Stred rozpätia, zaokrúhlený na „pekný“ krok. */
export function roundMid([lo, hi], step = 5) {
  return roundTo((lo + hi) / 2, step)
}

/** Budúca hodnota pravidelne investovanej úspory. */
export function futureValue(annual, years, rate = INVEST_RETURN) {
  if (annual <= 0) return 0
  return annual * ((Math.pow(1 + rate, years) - 1) / rate)
}

export function treesEquivalent(kg) {
  return kg / TREE_KG_PER_YEAR
}

// --- formátovanie ----------------------------------------------------------
const nbsp = ' '

export function fmtNum(v, decimals = 0) {
  const n = Number.isFinite(Number(v)) ? Number(v) : 0
  const [int, dec] = Math.abs(n).toFixed(decimals).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, nbsp)
  return (n < 0 ? '−' : '') + (dec ? grouped + ',' + dec : grouped)
}

export function fmtEur(v, decimals = 0) {
  return fmtNum(v, decimals) + nbsp + '€'
}

export function fmtKm(v) {
  return fmtNum(Math.round(v))
}

export function fmtKg(v) {
  if (Math.abs(v) >= 1000) return fmtNum(v / 1000, 2) + nbsp + 't'
  return fmtNum(v, 0) + nbsp + 'kg'
}
