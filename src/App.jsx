import React, { useMemo, useState } from 'react'
import {
  AREAS,
  CITIES,
  DEFAULT_CITY,
  CO2_MODES,
  DEFAULT_CONSUMPTION,
  FUELS,
  INVEST_RETURN,
  PROFILES,
  SOURCES,
  TREE_KG_PER_YEAR,
} from './data.js'
import {
  computeAlt,
  computeCar,
  fmtEur,
  fmtKg,
  fmtKm,
  fmtNum,
  futureValue,
  carCo2PerKm,
  marginalPerKm,
  roundMid,
  roundTo,
  TAXI_CONSUMPTION,
} from './calc.js'
import { Advanced, InlineNum, NumField, SelectField, Slider } from './components/ui.jsx'
import {
  IconBike,
  IconBus,
  IconCar,
  IconCoach,
  IconRegBus,
  IconTaxi,
  IconTrain,
} from './components/icons.jsx'
import { bootState, plainUrl, stateUrl } from './urlState.js'

// Doprava, ktorú si používateľ skladá. Mestské predplatné a prímestský autobus
// sa vylučujú — každé patrí do iného prostredia, zvyšok platí v oboch.
const MODES = [
  { key: 'car2', Icon: IconCar, name: 'Iné auto v domácnosti' },
  { key: 'mhd', Icon: IconBus, name: 'MHD, predplatný lístok', area: 'city' },
  { key: 'regbus', Icon: IconRegBus, name: 'Prímestský autobus', area: 'rural' },
  { key: 'train', Icon: IconTrain, name: 'Vlak (ZSSK)' },
  { key: 'coach', Icon: IconCoach, name: 'Diaľkový autobus' },
  { key: 'bike', Icon: IconBike, name: 'Bicykel' },
  { key: 'bolt', Icon: IconTaxi, name: 'Bolt alebo taxík' },
]

// Mimo mesta nesie iné auto v domácnosti väčšinu kilometrov, preto stojí na
// čele zoznamu. V meste je to okrajový scenár pre dvojautové domácnosti, tam
// teda patrí na koniec.
const modesFor = (area) => {
  const car2 = MODES.find((m) => m.key === 'car2')
  const rest = MODES.filter((m) => m.key !== 'car2' && (!m.area || m.area === area))
  return area === 'rural' ? [car2, ...rest] : [...rest, car2]
}

const idx = (i) => String(i + 1).padStart(2, '0')

/** Malé počítadlo so šípkami, na počet cestujúcich sa hodí lepšie než posuvník. */
function Stepper({ label, value, onChange, min = 0, max = 9 }) {
  const step = (d) => onChange(Math.max(min, Math.min(max, value + d)))
  return (
    <div className="stepper">
      <span>{label}</span>
      <div className="steps">
        <button onClick={() => step(-1)} disabled={value <= min} aria-label={`${label}: menej`}>
          −
        </button>
        <b>{value}</b>
        <button onClick={() => step(1)} disabled={value >= max} aria-label={`${label}: viac`}>
          +
        </button>
      </div>
    </div>
  )
}

/** Otáznik, ktorý po najetí alebo zameraní ukáže, z čoho číslo vzniklo. */
function Explain({ children }) {
  return (
    <span className="explain" tabIndex={0} role="note" aria-label="Z akých hodnôt číslo vychádza">
      ?<span className="tip">{children}</span>
    </span>
  )
}

export default function App() {
  // Ak stránku otvoril zdieľaný odkaz s výpočtom, začíname jeho hodnotami.
  const boot = useMemo(() => bootState(), [])
  const [profileId, setProfileId] = useState(boot.profileId)
  const [car, setCar] = useState(boot.car)
  const [alloc, setAlloc] = useState(boot.alloc)
  const [area, setArea] = useState(boot.area)
  const [city, setCity] = useState(boot.city)
  const [bikeType, setBikeType] = useState(boot.bikeType)
  const [prices, setPrices] = useState(boot.prices)
  const [horizon, setHorizon] = useState(boot.horizon)
  const [people, setPeople] = useState(boot.people)

  function pickProfile(p) {
    setProfileId(p.id)
    setCar({ ...p.car })
    // Profily sú poskladané pre mesto. Kto si prepol vidiek, tomu necháme jeho
    // vidiecku alternatívu tak, ako si ju nastavil — výber auta ju nemá prepisovať.
    if (area !== 'rural') setAlloc({ ...p.alloc })
    setBikeType(p.bikeType)
  }

  // Každé prostredie má inú východiskovú alternatívu, nie inak nazvanú tú istú.
  function pickArea(next) {
    if (next === area) return
    const profile = PROFILES.find((p) => p.id === profileId) || PROFILES[0]
    setArea(next)
    setAlloc(next === 'rural' ? { ...AREAS.rural.alloc } : { ...profile.alloc })
  }

  const set = (k) => (v) => setCar((c) => ({ ...c, [k]: v }))
  const setPrice = (k) => (v) => setPrices((p) => ({ ...p, [k]: v }))

  // Auto vezie celú skupinu naraz, preto sa jeho emisie delia počtom ľudí,
  // ktorých alternatíva musí odviezť samostatne.
  const heads = Math.max(1, people.adults + people.children)
  const res = useMemo(() => computeCar({ ...car, occupancy: heads }), [car, heads])
  // Druhé auto v domácnosti počítame ako to isté auto bez fixných nákladov.
  const car2PerKm = marginalPerKm(car)
  const car2Co2PerKm = carCo2PerKm(car)
  const alt = useMemo(
    () =>
      computeAlt(car.kmYear, alloc, {
        city,
        bikeType,
        prices,
        people,
        car2PerKm,
        car2Co2PerKm,
      }),
    [car.kmYear, alloc, city, bikeType, prices, people, car2PerKm, car2Co2PerKm]
  )
  const areaMeta = AREAS[area] || AREAS.city

  const saving = res.total - alt.total
  const co2Saving = res.co2Total - alt.co2Total
  const invested = futureValue(Math.max(0, saving), horizon)
  const fuelMeta = FUELS[car.fuel]
  const maxCost = Math.max(res.total, alt.total, 1)
  const maxCo2 = Math.max(res.co2Total, alt.co2Total, 1)
  const coveragePct = Math.round(alt.coverage * 100)
  // Čas za volantom je jediná položka, ktorú sa nedá ušetriť ani odložiť.
  const hoursDriving = car.kmYear / Math.max(1, prices.avgSpeed)

  // Rozpätie naprieč modelovými profilmi, každý so svojou predvolenou
  // alternatívou. Nezávisí od toho, čo si používateľ nastaví nižšie.
  const span = useMemo(() => {
    const rows = PROFILES.map((p) => {
      const c = computeCar(p.car)
      const a = computeAlt(p.car.kmYear, p.alloc, {
        city: DEFAULT_CITY,
        bikeType: p.bikeType,
        car2PerKm: marginalPerKm(p.car),
        car2Co2PerKm: carCo2PerKm(p.car),
      })
      return {
        profile: p,
        car: c,
        alt: a,
        saving: c.total - a.total,
        co2Cut: c.co2Total > 0 ? (1 - a.co2Total / c.co2Total) * 100 : 0,
      }
    })
    // Najvyššia úspora spomedzi profilov. Nie je to umelý extrém, je to jeden
    // z profilov, ktoré si používateľ o kúsok nižšie vie rozkliknúť a overiť.
    const best = rows.reduce((m, r) => (r.saving > m.saving ? r : m), rows[0])
    // Elektromobil na slovenskej elektrine (16 g/km) je čistejší než mestský
    // autobus (80 g/os.km), takže preň vyjde zníženie stopy záporne. Do stredu
    // berieme len autá, ktorým alternatíva emisie naozaj zníži; výnimku
    // pomenúvame v popiske pod číslami.
    const cuts = rows.map((r) => r.co2Cut).filter((v) => v > 0)
    return {
      best,
      saving: roundTo(best.saving),
      co2Cut: roundMid(cuts.length ? [Math.min(...cuts), Math.max(...cuts)] : [0, 0], 5),
    }
  }, [])

  return (
    <>
      <header className="hero">
        <div className="wrap">
          {/* <span className="label"></span> */}
          <h1>
            Koľko ťa{' '}
            {/* Dopísaná vsuvka: v riadku nezaberá miesto, vtisne sa pod medzeru. */}
            <span className="inkline">
              <span className="inkline-mark" aria-hidden="true">
                <svg viewBox="0 0 48 36" aria-hidden="true">
                  {/* Jeden ťah pera: tenký nábeh, hrubší stred, odtrhnutý koniec. */}
                  <path d="M4.3 33.4C5.2 32.0 8.2 27.9 10.0 25.2C11.8 22.5 13.6 19.7 15.1 17.2C16.5 14.7 17.9 11.8 18.7 10.0C19.6 8.1 19.7 6.0 20.3 6.0C20.9 6.1 21.4 8.3 22.5 10.3C23.5 12.3 25.2 15.6 26.8 18.1C28.5 20.6 30.5 23.2 32.5 25.3C34.5 27.5 36.7 29.6 38.6 30.9C40.5 32.2 42.8 32.7 43.7 33.1L43.9 32.7C43.2 32.2 41.3 31.0 39.8 29.5C38.3 27.9 36.4 25.7 34.7 23.5C33.0 21.3 31.2 18.7 29.6 16.3C27.9 13.8 26.3 11.0 24.7 8.9C23.2 6.8 21.9 3.8 20.5 3.8C19.0 3.7 17.5 6.4 16.1 8.4C14.7 10.4 13.5 13.0 12.1 15.6C10.8 18.2 9.4 21.1 8.0 24.0C6.6 26.9 4.4 31.5 3.7 33.0Z" fill="currentColor" />
                </svg>
              </span>
              <span className="inkline-word">a prírodu</span>
            </span>{' '}
            <em>naozaj</em> stojí auto?
          </h1>
          <p className="lede">
            Väčšina vodičov si počíta tankovanie. Skutočná cena je ale hlavne strata hodnoty, k tomu
            poistky, servis, gumy, parkovanie, diaľničná...
            <br/>
            Spočítaj si to aj s uhlíkovou stopou a porovnaj s dopravou, ktorou by si tie isté kilometre zvládol bez auta.
          </p>
          <div className="herofacts">
            <div>
              <b>
                až {fmtEur(span.saving)} ročne
                <Explain>
                  <b>Profil „{span.best.profile.name}“</b>
                  <span>
                    Auto {fmtEur(span.best.car.total)} ročne: kúpna cena{' '}
                    {fmtEur(span.best.profile.car.price)}, {fmtKm(span.best.profile.car.kmYear)} km
                    ročne, {fmtNum(span.best.profile.car.consumption, 1)}{' '}
                    {FUELS[span.best.profile.car.fuel].unit}, havarijné{' '}
                    {fmtEur(span.best.profile.car.kasko)}, parkovanie{' '}
                    {fmtEur(span.best.profile.car.parking)}.
                  </span>
                  <span>
                    Bez auta {fmtEur(span.best.alt.total)} ročne:{' '}
                    {span.best.alt.items
                      .filter((i) => i.km > 0)
                      .map((i) => `${i.label.replace('Predplatný lístok MHD — ', 'ročný lístok ')} ${fmtEur(i.value)}`)
                      .join(', ')}
                    .
                  </span>
                </Explain>
              </b>
              <span>ušetríš, keby si tie isté kilometre zvládol bez auta</span>
            </div>
            <div>
              <b>~{fmtNum(span.co2Cut, 0)} %</b>
              <span>nižšia uhlíková stopa ak nevlastníš palivové auto</span>
            </div>
          </div>
          {/* <p className="herofacts-note">
            
          </p> */}
        </div>
      </header>

      <main>
      {/* --------------------------------------------------------- 01 */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="idx">01</span>
            <div>
              <h2>Aké auto?</h2>
              <p>
                Vyber si najbližší profil a ak chceš, uprav ho.
              </p>
            </div>
          </div>

          <div className="body-col">
            <div className="profiles">
              {PROFILES.map((p, i) => {
                const r = computeCar(p.car)
                return (
                  <button
                    key={p.id}
                    className="profile"
                    aria-pressed={profileId === p.id}
                    onClick={() => pickProfile(p)}
                  >
                    <span className="idx">{idx(i)}</span>
                    <strong>{p.name}</strong>
                    <span className="tag">{p.tagline}</span>
                    <span className="price">{fmtEur(r.monthly)} / mes.</span>
                  </button>
                )
              })}
            </div>

            <div className="quick">
              <Slider
                label="Ročne najazdím"
                value={car.kmYear}
                min={2000}
                max={45000}
                step={500}
                onChange={set('kmYear')}
                format={(v) => `${fmtNum(v)} km`}
              />
              <Slider
                label="Kúpna cena"
                value={car.price}
                min={1000}
                max={70000}
                step={500}
                onChange={set('price')}
                format={(v) => fmtEur(v)}
              />
              <Slider
                label={car.fuel === 'ev' ? 'Spotreba elektriny' : 'Spotreba paliva'}
                value={car.consumption}
                min={car.fuel === 'ev' ? 10 : 3}
                max={car.fuel === 'ev' ? 30 : car.fuel === 'lpg' ? 20 : 16}
                step={0.1}
                onChange={set('consumption')}
                format={(v) => `${fmtNum(v, 1)} ${fuelMeta.unit}`}
              />
              <p className="hint">
                Priemerný Slovák najazdí 21 230 km ročne a za jazdenku dá 12 400 €. Čím menej
                jazdíš, tým drahší je každý kilometer: poistky, známka ani strata hodnoty sa
                nepýtajú, či si dnes vyšiel z garáže.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- 02 */}
      <section className="section" id="vysledok">
        <div className="wrap">
          <div className="section-head">
            <span className="idx">02</span>
            <div>
              <h2>Skutočný účet</h2>
              <p>
                Všetko prepočítané na jeden rok. Strata hodnoty je rozpočítaná na celé obdobie,
                počas ktorého plánuješ auto mať.
              </p>
            </div>
          </div>

          <div className="body-col">
            <div className="headline">
              <div className="bigcard">
                <span className="label">Auto ťa stojí</span>
                <div className="bignum">
                  {fmtEur(res.monthly)}
                  <small>mesačne</small>
                </div>
                <div className="subnums">
                  <div className="subnum">
                    <b>{fmtEur(res.total)}</b>
                    <span>ročne</span>
                  </div>
                  <div className="subnum">
                    <b>{fmtNum(res.perKm, 2)} €</b>
                    <span>za kilometer</span>
                  </div>
                  <div className="subnum">
                    <b>{fmtEur(res.total / 365, 1)}</b>
                    <span>každý deň</span>
                  </div>
                  <div className="subnum">
                    <b>{fmtEur(res.depreciation)}</b>
                    <span>ročná strata hodnoty</span>
                  </div>
                </div>
              </div>

              <div className="breakdown">
                <h3>Z čoho sa to skladá</h3>
                <div className="stackbar">
                  {res.items.map((i) => (
                    <i
                      key={i.key}
                      style={{ width: `${(i.value / res.total) * 100}%`, background: i.color }}
                      title={`${i.label}: ${fmtEur(i.value)}`}
                    />
                  ))}
                </div>
                <ul className="legend">
                  {res.items
                    .slice()
                    .sort((a, b) => b.value - a.value)
                    .map((i) => (
                      <li key={i.key}>
                        <span className="dot" style={{ background: i.color }} />
                        <span>{i.label}</span>
                        <span className="val">{fmtEur(i.value)}</span>
                        <span className="pct">{Math.round((i.value / res.total) * 100)} %</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="shock">
              <div>
                <b>{fmtNum(res.fuel > 0 ? res.total / res.fuel : 0, 1)}×</b>
                <span>
                  viac, než si väčšina ľudí myslí. Za{' '}
                  {car.fuel === 'ev' ? 'nabíjanie' : 'tankovanie'} dáš {fmtEur(res.fuel / 12)}{' '}
                  mesačne, celé auto ťa stojí {fmtEur(res.monthly)}.
                </span>
              </div>
            </div>

            <div className="advwrap">
              <CarAdvanced car={car} set={set} fuelMeta={fuelMeta} />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- 03 */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="idx">03</span>
            <div>
              <h2>Uhlíková stopa</h2>
              <p>
                Emisie rátame od ťažby paliva po výfuk. Elektromobil počítame reálnou emisnou
                intenzitou slovenskej siete, 87 g CO₂ na kWh, jednou z najnižších v Únii vďaka jadru.
              </p>
            </div>
          </div>

          <div className="body-col">
            <div className="ecocards">
              <div className="ecocard">
                <b>{fmtKg(res.co2Total)}</b>
                <span>CO₂e ročne vyprodukuje tvoje auto</span>
              </div>
              <div className="ecocard">
                <b>{fmtNum(res.co2PerKm, 0)} g</b>
                <span>na jeden osobokilometer</span>
              </div>
              <div className="ecocard">
                <b>{fmtNum(res.co2Total / TREE_KG_PER_YEAR, 0)}</b>
                <span>stromov by to muselo rok pohlcovať</span>
              </div>
              <div className="ecocard">
                <b>{fmtKg(res.co2Total * horizon)}</b>
                <span>za {horizon} rokov jazdenia</span>
              </div>
            </div>

            <div className="modescale">
              <h3>Gramy CO₂e na osobokilometer</h3>
              {[
                { label: 'Tvoje auto', v: res.co2PerKm, color: '#b04a22' },
                {
                  label: 'Bolt alebo taxík',
                  v: (TAXI_CONSUMPTION / 100) * FUELS.petrol.co2 * 1000 * 1.3,
                  color: '#d08641',
                },
                { label: 'Mestská MHD', v: CO2_MODES.mhd, color: '#2d8080' },
                { label: 'Diaľkový autobus', v: CO2_MODES.coach, color: '#5f9139' },
                { label: 'Vlak (ZSSK)', v: CO2_MODES.train, color: '#1f6b47' },
                { label: 'Elektrobicykel', v: CO2_MODES.ebike, color: '#9c8631' },
                { label: 'Bicykel a chôdza', v: CO2_MODES.bike, color: '#2a9460' },
              ].map((m) => {
                const scale = Math.max(res.co2PerKm, 250)
                return (
                  <div className="row" key={m.label}>
                    <span>{m.label}</span>
                    <div className="track">
                      <div
                        className="fill"
                        style={{
                          width: `${Math.max(0.8, (m.v / scale) * 100)}%`,
                          background: m.color,
                        }}
                      />
                    </div>
                    <span className="qty">{fmtNum(m.v, 0)} g</span>
                  </div>
                )
              })}
            </div>

            <p className="hint">
              {heads > 1
                ? `Výfuk auta delíme medzi ${heads} ľudí, ktorých vezie. Emisie MHD, vlaku aj autobusu sú už uvedené na jedného cestujúceho, takže porovnanie ostáva férové.`
                : 'Emisie MHD, vlaku aj autobusu sú uvedené na jedného cestujúceho. Ak autom vozíš aj ďalších ľudí, nastav si to v kroku 04 a výfuk sa medzi nich rozpočíta.'}
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- 04 */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="idx">04</span>
            <div>
              <h2>Život bez auta</h2>
              <p>
                Rozdeľ svojich {fmtKm(car.kmYear)} km medzi dopravu, ktorú by si reálne použil.
              </p>
            </div>
          </div>

          <div className="body-col">
            <div className="areaflip">
              <div className="areaflip-head">
                <span className="label">Kde žiješ</span>
                <div className="areaswitch" role="group" aria-label="Kde bývaš">
                  {Object.values(AREAS).map((a) => (
                    <button
                      key={a.id}
                      aria-pressed={area === a.id}
                      onClick={() => pickArea(a.id)}
                    >
                      {a.label}
                      <small>{a.hint}</small>
                    </button>
                  ))}
                </div>
              </div>
              <p className="areanote">{areaMeta.note}</p>
            </div>

            <div className="altgrid">
              <div className="panel">
                <div className="people">
                  <span className="label">Koľko ľudí primárne využíva toto auto</span>
                  <div className="peoplefields">
                    <Stepper
                      label="Dospelí"
                      value={people.adults}
                      min={0}
                      max={8}
                      onChange={(v) => setPeople((p) => ({ ...p, adults: v }))}
                    />
                    <Stepper
                      label="Deti"
                      value={people.children}
                      min={0}
                      max={8}
                      onChange={(v) => setPeople((p) => ({ ...p, children: v }))}
                    />
                  </div>
                  <p className="hint">
                    
                  </p>
                </div>

                {area === 'city' && (
                  <SelectField
                    label="Mesto, kde by si kupoval predplatný lístok"
                    value={city}
                    onChange={setCity}
                    options={CITIES.map((c) => ({
                      value: c.id,
                      label: `${c.label} — ${fmtEur(c.year)}/rok`,
                    }))}
                  />
                )}
                <div style={{ height: 8 }} />
                {modesFor(area).map(({ key, Icon, name }) => {
                  const pct = Math.round((alloc[key] || 0) * 100)
                  const km = car.kmYear * (alloc[key] || 0)
                  const item = alt.items.find((i) => i.key === key)
                  return (
                    <div className="mode" key={key}>
                      <span className="ico">
                        <Icon />
                      </span>
                      <div>
                        <div className="top">
                          <span className="name">
                            {key === 'bike' && bikeType === 'ebike' ? 'Elektrobicykel' : name}
                          </span>
                          <span className="qty">
                            {fmtKm(km)} km · {pct} % · {fmtEur(item ? item.value : 0)}
                          </span>
                        </div>
                        <input
                          type="range"
                          aria-label={`${key === 'bike' && bikeType === 'ebike' ? 'Elektrobicykel' : name}: podiel kilometrov`}
                          min={0}
                          max={100}
                          step={1}
                          value={pct}
                          onChange={(e) =>
                            setAlloc((a) => ({ ...a, [key]: Number(e.target.value) / 100 }))
                          }
                        />
                        {key === 'car2' && (
                          <div className="checkline">
                            {km > 0
                              ? 'Tie isté kilometre, to isté palivo — emisie sa tu neznížia ani o gram. Ušetríš to, čo sa za auto platí bez ohľadu na jazdenie: druhé PZP, známku, STK, parkovanie a stratu hodnoty.'
                              : 'Máte v domácnosti dve autá? Toto je posuvník pre scenár „zrušíme jedno a budeme sa deliť“.'}
                          </div>
                        )}
                        {key === 'bolt' && km > 0 && (
                          <div className="checkline">
                            {fmtNum(alt.boltTrips / 12, 1)} jazdy mesačne po{' '}
                            {fmtNum(prices.boltTripKm, 1)} km
                          </div>
                        )}
                        {key === 'bolt' && km > 0 && area === 'rural' && (
                          <div className="checkline">
                            Mimo miest a ich okolia Bolt spravidla nejazdí. Rátaj s bežným taxíkom,
                            objednaným dopredu a drahšie.
                          </div>
                        )}
                        {key === 'bike' && (
                          <label className="checkline">
                            <input
                              type="checkbox"
                              checked={bikeType === 'ebike'}
                              onChange={(e) => setBikeType(e.target.checked ? 'ebike' : 'bike')}
                            />
                            mám elektrobicykel
                          </label>
                        )}
                      </div>
                    </div>
                  )
                })}

                <div className={'coverage' + (Math.abs(coveragePct - 100) > 2 ? ' warn' : '')}>
                  <span>
                    Pokryté {coveragePct} % z {fmtKm(car.kmYear)} km
                    {coveragePct < 98 && ', zvyšok by si musel vyriešiť inak'}
                    {coveragePct > 102 && ', počítaš viac kilometrov, než jazdíš autom'}
                  </span>
                  <button
                    onClick={() => {
                      const sum = Object.values(alloc).reduce((s, v) => s + v, 0)
                      if (sum > 0) {
                        const scaled = {}
                        for (const k of Object.keys(alloc)) scaled[k] = alloc[k] / sum
                        setAlloc(scaled)
                      }
                    }}
                  >
                    Dorovnať
                  </button>
                </div>
              </div>

              <div className="versus">
                <div className="vsrow">
                  <h3>Peniaze za rok</h3>
                  <div className="bar">
                    <span className="lbl">Auto</span>
                    <div className="track">
                      <div className="fill car" style={{ width: `${(res.total / maxCost) * 100}%` }}>
                        {fmtEur(res.total)}
                      </div>
                    </div>
                  </div>
                  <div className="bar">
                    <span className="lbl">Bez auta</span>
                    <div className="track">
                      <div className="fill alt" style={{ width: `${(alt.total / maxCost) * 100}%` }}>
                        {fmtEur(alt.total)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vsrow">
                  <h3>Emisie CO₂e za rok</h3>
                  {co2Saving < 0 && heads > 1 && (
                    <p className="hint" style={{ marginTop: -4, marginBottom: 10 }}>
                      Plné auto je na emisie efektívnejšie než autobus. Pri {heads} cestujúcich
                      vyjde na {fmtNum(res.co2PerKm, 0)} g CO₂e na osobokilometer, mestská MHD má{' '}
                      {CO2_MODES.mhd} g. Peniaze aj tak ušetríš, ovzdušiu tým ale nepomôžeš.
                    </p>
                  )}
                  <div className="bar">
                    <span className="lbl">Auto</span>
                    <div className="track">
                      <div
                        className="fill car"
                        style={{ width: `${(res.co2Total / maxCo2) * 100}%` }}
                      >
                        {fmtKg(res.co2Total)}
                      </div>
                    </div>
                  </div>
                  <div className="bar">
                    <span className="lbl">Bez auta</span>
                    <div className="track">
                      <div
                        className="fill alt"
                        style={{ width: `${(alt.co2Total / maxCo2) * 100}%` }}
                      >
                        {fmtKg(alt.co2Total)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vsrow">
                  <h3>Z čoho sa alternatíva skladá</h3>
                  <ul className="legend">
                    {alt.items
                      .filter((i) => i.km > 0)
                      .map((i) => (
                        <li key={i.key}>
                          <span className="dot" style={{ background: i.color }} />
                          <span>
                            {i.label}
                            <br />
                            <small style={{ color: 'var(--ink-3)' }}>{i.detail}</small>
                          </span>
                          <span className="val">{fmtEur(i.value)}</span>
                          <span className="pct">{fmtKg(i.co2)}</span>
                        </li>
                      ))}
                    {alt.items.every((i) => i.km === 0) && (
                      <li>
                        <span />
                        <span style={{ color: 'var(--ink-3)' }}>
                          Posuň niektorý z posuvníkov vľavo a zlož si vlastnú kombináciu.
                        </span>
                        <span />
                        <span />
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="verdict">
              <span className="label">
                {saving >= 0 ? 'Ročne by si ušetril' : 'Ročne by si priplatil'}
              </span>
              <div className="big">{fmtEur(Math.abs(saving))}</div>
              <p>
                {saving >= 0 ? (
                  <>
                    To je {fmtEur(Math.abs(saving) / 12)} mesačne. Keby si tú istú sumu každý rok
                    investoval s priemerným výnosom {Math.round(INVEST_RETURN * 100)} % ročne, o{' '}
                    {horizon} rokov máš <b>{fmtEur(invested)}</b>.
                  </>
                ) : (
                  <>
                    Takto poskladaná alternatíva vyjde drahšie než auto. Skús presunúť kilometre z
                    Boltu na MHD alebo vlak. Taxík je jediná doprava, ktorá vie byť drahšia než
                    vlastné auto.
                  </>
                )}
              </p>
              <div className="split">
                <div>
                  <b>{fmtKg(Math.abs(co2Saving))}</b>
                  <span>{co2Saving >= 0 ? 'menej CO₂e ročne' : 'viac CO₂e ročne'}</span>
                </div>
                <div>
                  <b>
                    {res.co2Total > 0
                      ? fmtNum(Math.abs(1 - alt.co2Total / res.co2Total) * 100, 0)
                      : 0}{' '}
                    %
                  </b>
                  <span>{co2Saving >= 0 ? 'nižšia uhlíková stopa' : 'vyššia uhlíková stopa'}</span>
                </div>
                <div>
                  <b>{fmtEur(Math.max(0, saving) * horizon)}</b>
                  <span>za {horizon} rokov bez investovania</span>
                </div>
              </div>

              <Slider
                label="Horizont porovnania"
                value={horizon}
                min={1}
                max={30}
                step={1}
                onChange={setHorizon}
                format={(v) => `${v} rokov`}
              />
            </div>

            <div className="timecard">
              <h3>Navyše…</h3>
              <b>aj {fmtNum(hoursDriving, 0)} hodín ročne</b>
              <p>
                strávi za volantom šofér tohto auta. To je <b>{fmtNum(hoursDriving / 8, 0)} osemhodinových dní</b>. V aute
                je to čas, ktorý ti z roka jednoducho zmizne: musíš sledovať cestu. Vo vlaku alebo v
                autobuse sa dá tie isté hodiny čítať, pracovať, dospávať alebo len pozerať von
                oknom. Peniaze si zarobíš späť, čas nie.
              </p>
              <span>
                Počítané pri priemernej rýchlosti{' '}
                <InlineNum
                  label="Priemerná rýchlosť auta v km/h"
                  value={prices.avgSpeed}
                  onChange={setPrice('avgSpeed')}
                  suffix="km/h"
                  step={5}
                  min={5}
                  max={130}
                />{' '}
                vrátane zdržaní a hľadania parkovania. Po meste býva reálny priemer aj pod 30 km/h,
                po diaľnici výrazne viac.
              </span>
            </div>

            <div className="advwrap">
              <AltAdvanced prices={prices} setPrice={setPrice} />
            </div>
          </div>
        </div>
      </section>

      <ShareCta
        monthly={res.monthly}
        saving={saving}
        state={{ profileId, car, alloc, area, city, bikeType, prices, horizon, people }}
      />

      <Sources />
      </main>

      <footer className="site">
        <div className="wrap">
          Orientačný prepočet, nie finančné poradenstvo. Ceny sa menia, tak si ich pokojne prepíš.
          {' '}·{' '}
          <a href="https://github.com/YeapGuy/auto" target="_blank" rel="noopener noreferrer">
            zdrojový kód
          </a>
        </div>
      </footer>
    </>
  )
}

/* ---------------------------------------------------------------- pokročilé */

function CarAdvanced({ car, set, fuelMeta }) {
  return (
    <>
      <Advanced title="Kúpa a strata hodnoty" hint="najväčšia a najprehliadanejšia položka">
        <NumField label="Kúpna cena auta" value={car.price} onChange={set('price')} suffix="€" step={500} />
        <NumField
          label="Ako dlho si ho nechám"
          value={car.years}
          onChange={set('years')}
          suffix="rokov"
          min={1}
          max={30}
        />
        <NumField
          label="Ročná strata hodnoty"
          value={Math.round(car.depreciation * 100)}
          onChange={(v) => set('depreciation')(v / 100)}
          suffix="%"
          min={0}
          max={40}
          note="Nové auto stráca 15 až 20 % ročne, staršia jazdenka 8 až 12 %."
        />
      </Advanced>

      <Advanced title="Palivo alebo energia" hint="ceny k októbru 2026">
        <SelectField
          label="Pohon"
          value={car.fuel}
          onChange={(v) => {
            set('fuel')(v)
            set('fuelPrice')(FUELS[v].price)
            set('consumption')(DEFAULT_CONSUMPTION[v] ?? 6.5)
          }}
          options={Object.entries(FUELS).map(([k, f]) => ({ value: k, label: f.label }))}
        />
        <NumField
          label="Spotreba"
          value={car.consumption}
          onChange={set('consumption')}
          suffix={fuelMeta.unit}
          step={0.1}
          note={
            car.fuel === 'lpg'
              ? 'LPG má nižšiu výhrevnosť, na tú istú cestu ho treba o 25 až 30 % viac litrov než benzínu.'
              : undefined
          }
        />
        <NumField
          label="Cena"
          value={car.fuelPrice}
          onChange={set('fuelPrice')}
          suffix={fuelMeta.priceLabel}
          step={0.001}
          note={
            car.fuel === 'ev'
              ? 'Doma 0,22 €/kWh, verejná DC nabíjačka 0,38 až 0,71 €/kWh.'
              : car.fuel === 'lpg'
              ? 'LPG: 0,818 €/l (október 2026).'
              : 'Benzín 95: 1,845 €/l, nafta 1,972 €/l (október 2026).'
          }
        />
      </Advanced>

      <Advanced title="Poistenie, poplatky a parkovanie" hint="platíš aj keď auto stojí">
        <NumField label="PZP ročne" value={car.pzp} onChange={set('pzp')} suffix="€" note="Priemer v SR je okolo 168 €, najnižšie ponuky od 105 €." />
        <NumField label="Havarijné poistenie" value={car.kasko} onChange={set('kasko')} suffix="€" note="0 znamená, že havarijné nemám." />
        <NumField label="Diaľničná známka" value={car.vignette} onChange={set('vignette')} suffix="€" note="Ročná 90 €, elektromobil 45 €, desaťdňová 10,80 €." />
        <NumField label="STK a EK, ročný priemer" value={car.stk} onChange={set('stk')} suffix="€" note="Balík 72 až 110 € raz za dva roky." />
        <NumField label="Parkovanie ročne" value={car.parking} onChange={set('parking')} suffix="€" note="Rezidentská karta PAAS v Bratislave stojí 39 € za prvé auto." />
      </Advanced>

      <Advanced title="Servis a prevádzka" hint="pravidelné aj nepravidelné výdavky">
        <NumField label="Servis a opravy ročne" value={car.service} onChange={set('service')} suffix="€" />
        <NumField label="Pneumatiky, prezúvanie, uskladnenie" value={car.tyres} onChange={set('tyres')} suffix="€" />
        <NumField label="Umývanie, doplnky, drobnosti" value={car.other} onChange={set('other')} suffix="€" />
      </Advanced>
    </>
  )
}

function AltAdvanced({ prices, setPrice }) {
  return (
    <Advanced title="Ceny alternatívnej dopravy" hint="z reálnych cenníkov, pokojne ich uprav">
      <NumField
        label="Vlak, cena za km"
        value={prices.trainPerKm}
        onChange={setPrice('trainPerKm')}
        suffix="€/km"
        step={0.005}
        note="Tarifa ZSSK je degresívna. IC Bratislava–Košice (445 km) vyjde na 0,043 €/km, krátka regionálna cesta na 0,09 €/km."
      />
      <NumField
        label="Diaľkový autobus, cena za km"
        value={prices.coachPerKm}
        onChange={setPrice('coachPerKm')}
        suffix="€/km"
        step={0.005}
        note="RegioJet a FlixBus Bratislava–Košice od 20 € za 445 km."
      />
      <NumField
        label="Priemerná cena jazdy Boltom"
        value={prices.boltTripAvg}
        onChange={setPrice('boltTripAvg')}
        suffix="€"
        step={0.5}
        note="Hlavná stanica do Viva, 4,3 km, stojí 5,50 €."
      />
      <NumField
        label="Priemerná dĺžka jazdy Boltom"
        value={prices.boltTripKm}
        onChange={setPrice('boltTripKm')}
        suffix="km"
        step={0.5}
      />
      <NumField
        label="Bicykel, ročné náklady"
        value={prices.bikeYear}
        onChange={setPrice('bikeYear')}
        suffix="€"
        note="Bicykel za 600 € na osem rokov plus 60 € ročne na servis."
      />
      <NumField
        label="Elektrobicykel, ročné náklady"
        value={prices.ebikeYear}
        onChange={setPrice('ebikeYear')}
        suffix="€"
        note="E-bike za 1 800 € na osem rokov plus 100 € ročne na servis a batériu."
      />
    </Advanced>
  )
}

/* ---------------------------------------------------------------- zdieľanie */

function ShareCta({ monthly, saving, state }) {
  // Nie každý návštevník má auto. Kto si len skúšal, aké by to bolo, pošle
  // radšej čistý odkaz, nech si adresát naklikal vlastné čísla od začiatku.
  const [withCalc, setWithCalc] = useState(true)
  const [copied, setCopied] = useState(false)

  const url = withCalc ? stateUrl(state) : plainUrl()
  const text = withCalc
    ? saving > 0
      ? `Vlastniť auto stojí ${fmtEur(monthly)} mesačne a bez neho sa dá ušetriť ${fmtEur(saving)} ročne.`
      : `Vlastniť auto stojí ${fmtEur(monthly)} mesačne.`
    : 'Koľko naozaj stojí vlastniť auto? Kalkulačka so slovenskými cenami, spočítaj si to svoje.'

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  function native() {
    navigator.share({ title: 'Koľko ťa naozaj stojí auto?', text, url }).catch(() => {})
  }

  function pick(value) {
    setWithCalc(value)
    setCopied(false)
  }

  return (
    <section className="share">
      <div className="wrap">
        <h2>Prekvapilo ťa to?</h2>
        <p>
          Väčšina vodičov si neuvedomuje, že auto stojí omnoho viac než pohonné hmoty.
          Pošli tento prepočet niekomu, kto by mal vidieť skutočné čísla!
        </p>

        <div className="sharemode" role="group" aria-label="Čo má odkaz obsahovať">
          <button aria-pressed={withCalc} onClick={() => pick(true)}>
            S výpočtom
          </button>
          <button aria-pressed={!withCalc} onClick={() => pick(false)}>
            Bez výpočtu
          </button>
        </div>

        <div className="sharebtns">
          <button className="primary" onClick={copy}>
            {copied ? 'Odkaz skopírovaný' : 'Skopírovať odkaz'}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button onClick={native}>Zdieľať…</button>
          )}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent('Koľko ťa naozaj stojí auto?')}&body=${encodeURIComponent(`${text}

${url}`)}`}
          >
            E-mailom
          </a>
        </div>

        <p className="sharenote">
          {withCalc
            ? 'Odkaz nesie tvoje nastavenia priamo v adrese, takže sa adresátovi otvorí rovnaký výpočet, aký vidíš ty. Nič sa nikam neukladá a stránka o tebe nič nezbiera.'
            : 'Odkaz vedie na prázdnu kalkulačku s predvolenými profilmi. Tvoje čísla sa v ňom neprenášajú.'}
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- zdroje */

function Sources() {
  return (
    <section className="sources">
      <div className="wrap">
        <h2>Odkiaľ sú čísla</h2>
        <p>Predvolené hodnoty vychádzajú z týchto cenníkov a štatistík.</p>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
              <p>{s.note}</p>
            </li>
          ))}
        </ul>

        <div className="method">
          <h3>Ako to počítame</h3>
          <p>
            <b>Strata hodnoty.</b> Zostatková cena je kúpna cena × (1 − ročná strata) na počet rokov.
            Rozdiel delíme počtom rokov držby. Pri leasingu alebo úvere treba pripočítať úroky, tie
            kalkulačka nezahŕňa.
          </p>
          <p>
            <b>Emisie auta.</b> Spaľovanie 2,31 kg CO₂ na liter benzínu, 2,64 kg na liter nafty a
            1,51 kg na liter LPG, navýšené o ťažbu, rafináciu a dopravu paliva (o 20, 17 a 12 %).
            Elektromobil počítame slovenským emisným mixom 87 g CO₂/kWh plus asi 6 % strát pri
            prenose a nabíjaní.
          </p>
          <p>
            <b>Emisie alternatív.</b> Vlak 24,84 g CO₂e/os.km podľa vlastného vykazovania ZSSK,
            mestská MHD 80 g (mix autobusu 93 g a električky či trolejbusu 63 g podľa
            Umweltbundesamt), diaľkový autobus 31 g, prímestský autobus 69,6 g, elektrobicykel 3 g,
            bicykel a chôdza 0 g. Bolt počítame ako auto so 6,8 l/100 km a prirážkou 30 % za jazdy
            naprázdno.
          </p>
          <p>
            <b>Iné auto v domácnosti.</b> Kilometre, ktoré by po zrušení auta odjazdilo druhé auto
            v domácnosti (alebo ťa odvezie niekto, kto ide rovnako), rátame hraničnou cenou: palivo
            plus opotrebenie, teda servis a pneumatiky rozpočítané na kilometer. Stratu hodnoty,
            PZP, diaľničnú známku, STK ani parkovanie sem nepočítame — tie sa pri druhom aute platia
            tak či tak a práve tým, že sa neplatia druhý raz, vzniká úspora. Emisie sú rovnaké ako
            pri tvojom aute, na uhlíkovej stope teda tento presun nešetrí nič a kalkulačka to
            nepredstiera. Vychádzame z parametrov auta z kroku 01; ak je druhé auto v domácnosti
            menšie alebo väčšie, uprav si spotrebu.
          </p>
          <p>
            <b>Mesto a vidiek.</b> Predplatný lístok MHD sa dá kúpiť len v mestách, ktoré ju majú.
            Mimo nich preto rátame prímestský autobus za jednotlivé cestovné, a to cenou z čipovej
            karty: kto ním dochádza, kartu má, a v hotovosti je každý lístok o 0,50 € drahší. Podľa
            tarify Košického samosprávneho kraja stojí cesta na 18 až 20 km 1,60 €, teda 0,084 €/km,
            na 26 až 30 km 2,00 €, teda 0,071 €/km. Ako východisko berieme 0,08 €/km, deti a
            študenti do 26 rokov platia presne polovicu. Prímestský autobus má vyššiu stopu na osobokilometer než
            mestský, lebo jazdí menej obsadený — Umweltbundesamt mu pri 20 % obsadenosti a vrátane
            výroby vozidla ráta 69,6 g CO₂e.
          </p>
          <p>
            <b>Čo mimo mesta nahradiť nejde.</b> Kalkulačka neráta s tým, že spoj musí ísť vtedy,
            keď potrebuješ. Ak ti prímestský autobus alebo vlak nepokryjú všetky kilometre, nechaj
            pokrytie pod 100 % — porovnanie potom hovorí o tej časti ciest, ktorú nahradiť vieš, a
            zvyšok ostáva autu.
          </p>
          <p>
            <b>Čo nezapočítavame.</b> Výrobu vozidiel a infraštruktúry (na strane auta by to pridalo
            zhruba 25 až 50 g CO₂/km), úroky z úveru, pokuty, škody pri nehode, čas strávený v
            zápche a hľadaním parkovania. Pri LPG ani prestavbu a revíziu tlakovej nádrže. Výsledok
            teda skôr podhodnocuje.
          </p>
          <p>
            <b>Porovnanie nákladov</b> je vedené pre jedného človeka. Ak autom pravidelne vozíš
            ďalších ľudí, ich cestovné do alternatívy pripočítaj zvlášť.
          </p>
        </div>
      </div>
    </section>
  )
}
