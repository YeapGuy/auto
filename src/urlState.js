import { ALT_PRICES, CITIES, FUELS, PROFILES } from './data.js'

// Stav kalkulačky vieme zabaliť do adresy, aby sa dal poslať aj s výpočtom.
// Ukladáme len to, čo sa líši od zvoleného profilu, takže bežný odkaz zostane
// krátky. Obsah adresy je cudzí vstup, preto sa pri čítaní všetko kontroluje.

export const DEFAULT_HORIZON = 10
export const DEFAULT_PEOPLE = { adults: 1, children: 0 }
export const STATE_PARAM = 'v'

const BASE = PROFILES[0]

function encode(text) {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decode(token) {
  const padded = token.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function changed(current, base) {
  const out = {}
  for (const k of Object.keys(base)) if (current[k] !== base[k]) out[k] = current[k]
  return out
}

/** Prevezme z náplne len kľúče, ktoré vzor pozná, a v type, ktorý má vzor. */
function sanitize(base, patch) {
  const out = { ...base }
  if (!patch || typeof patch !== 'object') return out
  for (const k of Object.keys(base)) {
    const v = patch[k]
    if (typeof base[k] === 'number') {
      const n = Number(v)
      if (Number.isFinite(n)) out[k] = Math.max(0, Math.min(n, 1e7))
    } else if (typeof base[k] === 'string' && typeof v === 'string') {
      out[k] = v
    }
  }
  return out
}

export function defaultState() {
  return {
    profileId: BASE.id,
    car: { ...BASE.car },
    alloc: { ...BASE.alloc },
    city: BASE.city,
    bikeType: BASE.bikeType,
    prices: { ...ALT_PRICES },
    horizon: DEFAULT_HORIZON,
    people: { ...DEFAULT_PEOPLE },
  }
}

export function encodeState(state) {
  const profile = PROFILES.find((p) => p.id === state.profileId) || BASE
  const payload = { p: profile.id }
  const car = changed(state.car, profile.car)
  const alloc = changed(state.alloc, profile.alloc)
  const prices = changed(state.prices, ALT_PRICES)
  if (Object.keys(car).length) payload.c = car
  if (Object.keys(alloc).length) payload.a = alloc
  if (Object.keys(prices).length) payload.r = prices
  if (state.city !== profile.city) payload.t = state.city
  if (state.bikeType !== profile.bikeType) payload.b = state.bikeType
  if (state.horizon !== DEFAULT_HORIZON) payload.h = state.horizon
  const people = changed(state.people, DEFAULT_PEOPLE)
  if (Object.keys(people).length) payload.n = people
  return encode(JSON.stringify(payload))
}

export function decodeState(token) {
  let payload
  try {
    payload = JSON.parse(decode(token))
  } catch {
    return null
  }
  if (!payload || typeof payload !== 'object') return null

  const profile = PROFILES.find((p) => p.id === payload.p) || BASE
  const car = sanitize(profile.car, payload.c)
  if (!FUELS[car.fuel]) car.fuel = profile.car.fuel
  car.occupancy = Math.max(1, car.occupancy)
  car.years = Math.max(1, Math.round(car.years))

  const bikeType = payload.b === 'ebike' || payload.b === 'bike' ? payload.b : profile.bikeType
  const city = CITIES.some((c) => c.id === payload.t) ? payload.t : profile.city
  const horizon = Number.isFinite(Number(payload.h))
    ? Math.max(1, Math.min(30, Math.round(Number(payload.h))))
    : DEFAULT_HORIZON

  return {
    profileId: profile.id,
    car,
    alloc: sanitize(profile.alloc, payload.a),
    city,
    bikeType,
    prices: sanitize(ALT_PRICES, payload.r),
    horizon,
    people: {
      adults: Math.round(sanitize(DEFAULT_PEOPLE, payload.n).adults),
      children: Math.round(sanitize(DEFAULT_PEOPLE, payload.n).children),
    },
  }
}

/** Stav načítaný z adresy, inak predvolený profil. */
export function bootState() {
  if (typeof window === 'undefined') return defaultState()
  const token = new URLSearchParams(window.location.search).get(STATE_PARAM)
  return (token && decodeState(token)) || defaultState()
}

/** Adresa stránky bez akéhokoľvek zdieľaného výpočtu. */
export function plainUrl() {
  if (typeof window === 'undefined') return ''
  return window.location.origin + window.location.pathname
}

/** Adresa, ktorá otvorí stránku presne s týmto nastavením. */
export function stateUrl(state) {
  return `${plainUrl()}?${STATE_PARAM}=${encodeState(state)}`
}
