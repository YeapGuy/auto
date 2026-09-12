// ---------------------------------------------------------------------------
// Vstupné dáta. Všetky čísla sú z reálnych zdrojov uvedených v SOURCES nižšie.
// Stav: september 2026.
// ---------------------------------------------------------------------------

export const SOURCES = [
  {
    id: 'finax',
    label: 'Finax — Skutočné náklady auta, najväčší zbytočný výdavok',
    url: 'https://www.finax.eu/sk/blog/skutocne-naklady-auta-najvacsi-zbytocny-vydavok',
    note: 'Modelový rozpočet auta na 8 rokov: 0,44 €/km, 625 €/mesiac.',
  },
  {
    id: 'palivo',
    label: 'Ceny pohonných látok, 36. týždeň 2026 (ŠÚ SR via TASR)',
    url: 'https://www.teraz.sk/ekonomika/ceny-pohonnych-latok-v-36-tyzdni-op/991476-clanok.html',
    note: 'Benzín 95: 1,768 €/l · Nafta: 1,917 €/l.',
  },
  {
    id: 'lpg',
    label: 'Ceny LPG na Slovensku 2026 (Natankuj.sk / GlobalPetrolPrices)',
    url: 'https://www.globalpetrolprices.com/Slovakia/lpg_prices/',
    note: 'Autoplyn sa v roku 2026 pohybuje okolo 0,85–0,91 €/l.',
  },
  {
    id: 'pzp',
    label: 'Ceny PZP 2026 (Netfinancie)',
    url: 'https://www.netfinancie.sk/a/ako-sa-zmenia-ceny-pzp/',
    note: 'Priemerné PZP 168 €/rok (2025), v roku 2026 ďalší rast; havarijné 280–400 € pre bežné auto.',
  },
  {
    id: 'znamka',
    label: 'Diaľničná známka 2026 (NDS / Finsider)',
    url: 'https://www.finsider.sk/servis/dialnicne-znamky-2026-ceny-platnost/',
    note: 'Ročná známka 90 €, elektromobil 45 €.',
  },
  {
    id: 'stk',
    label: 'Ceny STK a emisnej kontroly 2026',
    url: 'https://www.stkonline.sk/informacny-servis/ceny-technickej-a-emisnej-kontroly',
    note: 'STK + EK spolu zhruba 65–110 € podľa stanice, platnosť 2 roky.',
  },
  {
    id: 'paas',
    label: 'PAAS Bratislava — rezidentská parkovacia karta',
    url: 'https://paas.sk/parkovaci-asistent/',
    note: '39 €/rok za prvé auto v byte, 150 € za druhé, 500 € za tretie.',
  },
  {
    id: 'najazd',
    label: 'Priemerný ročný nájazd na Slovensku (Pravda, dáta z odometrov)',
    url: 'https://auto.pravda.sk/magazin/clanok/718437-pozrite-sa-v-ktorych-krajinach-najazdia-rocne-najviac-km-ako-je-na-tom-slovensko/',
    note: 'Slovensko ≈ 21 230 km/rok, 12. miesto z 27 krajín EÚ.',
  },
  {
    id: 'lacnejazdenky',
    label: 'Najlacnejšie jazdenky na slovenskom trhu (TopSpeed)',
    url: 'https://www.topspeed.sk/poradna/najlacnejsie-jazdenky-na-slovenskom-trhu-10-aut-ktore-kupite-za-menej-nez-jednu-vyplatu/28211',
    note: 'Pojazdné auto sa dá kúpiť za 600–1 500 € — Hyundai Getz od 600 €, Atos od 700 €, Peugeot 206 od 900 €, Fiat Punto od 1 000 €.',
  },
  {
    id: 'pzplacne',
    label: 'Modelové ceny PZP 2026 (Superpoistenie)',
    url: 'https://www.superpoistenie.sk/pzp/cennik',
    note: 'Najnižšie poistné pre malé auto: Škoda Fabia 1.2 (44 kW) 105,20 €, Ford Focus 1.6 101,64 € ročne.',
  },
  {
    id: 'stklacne',
    label: 'Najlacnejšia STK na Slovensku (Autoviny)',
    url: 'https://www.autoviny.sk/novinky/2803836/najlacnejsia-stk',
    note: 'Samotná STK od 40 €, najlacnejšie balíky STK + EK od 72–79 € (platnosť 2 roky).',
  },
  {
    id: 'jazdenky',
    label: 'Priemerná cena jazdeného auta v SR (1. polrok 2026)',
    url: 'https://magazin.autobazar.eu/vysli-najnovsie-statistiky-o-jazdenych-autach-v-sr-priemerna-cena-jazdenky-je-uz-12400-clanok10079.html',
    note: 'Priemerná jazdenka 12 400 €, priemerný vek 9,45 roka.',
  },
  {
    id: 'idsbk',
    label: 'Cenník IDS BK / DPB Bratislava (od 1. 7. 2026)',
    url: 'https://imhd.sk/ba/doc/sk/21814/21814',
    note: 'Zóny 100+101: 365 dní 263 €, zľavnené 131,50 €. Zľava platí pre deti 6–17 rokov, študentov do 25 a seniorov od 63.',
  },
  {
    id: 'dpmk',
    label: 'Cenník DPMK Košice (od 1. 8. 2025)',
    url: 'https://imhd.sk/ke/doc/sk/22442/Ceny-a-typy-cestovn%C3%BDch-l%C3%ADstkov-od-1-6-2023',
    note: '365 dní 240 €, 90 dní 80 €, 30 dní 30 €.',
  },
  {
    id: 'dpmp',
    label: 'Cenník MHD Prešov',
    url: 'https://imhd.sk/po/doc/sk/23883/23883',
    note: '365 dní 219 € (I. zóna), 30 dní 32 €.',
  },
  {
    id: 'dpmbb',
    label: 'Cenník MHD Banská Bystrica (od 15. 7. 2026)',
    url: 'https://imhd.sk/bb/doc/sk/20251/Ceny-a-typy-cestovnych-listkov',
    note: '90 dní 55 € (ročne ≈ 220 €), 30 dní 20 €.',
  },
  {
    id: 'dpmz',
    label: 'MHD Žilina — ročný predplatný lístok pre rezidentov',
    url: 'https://www.zilinak.sk/clanky/23883/dpmz-chce-zvysit-ceny-listkov-a-zrusit-bezplatne-cestovne-pre-ziakov-a-seniorov-o-zmenach-rozhodnu-poslanci',
    note: 'Ročný predplatný lístok pre obyvateľa Žiliny 195 €, pre žiakov 6–15 rokov a seniorov 62–69 len 30 €.',
  },
  {
    id: 'ksktarifa',
    label: 'Tarifa prímestskej autobusovej dopravy — Košický samosprávny kraj (eurobus, ARRIVA Michalovce)',
    url: 'https://www.eurobus.sk/public/media/1065/tarifa-pravidelnej-primestskej-dopravy-od-1-2.pdf',
    note: 'Jednosmerné základné cestovné z čipovej karty podľa tarifnej vzdialenosti: 8–10 km 1,00 €, 18–20 km 1,60 €, 26–30 km 2,00 €, 41–45 km 2,60 €. V hotovosti je lístok o 0,50 € drahší. Deti a študenti do 26 rokov platia presne polovicu (18–20 km 0,80 €).',
  },
  {
    id: 'ubaregio',
    label: 'Umweltbundesamt Rakúsko (REP-0801, 2022) — Ökobilanz autobusov',
    url: 'https://www.umweltbundesamt.at/fileadmin/site/publikationen/rep0801.pdf',
    note: 'Prímestský dieselový autobus 69,6 g CO₂e na osobokilometer pri 20 % priemernej obsadenosti, vrátane výroby vozidla.',
  },
  {
    id: 'zsskcena',
    label: 'ZSSK — cestovné lístky',
    url: 'https://www.zssk.sk/cestovny-listok/',
    note: 'IC Bratislava–Košice (445 km) v 2. triede zhruba 16–21 € podľa dňa, minimálne cestovné 1 €.',
  },
  {
    id: 'zsskdeti',
    label: 'ZSSK — 100 % zľava z cestovného',
    url: 'https://www.zssk.sk/bezplatna-preprava/',
    note: 'Deti do 6 rokov cestujú zadarmo bez registrácie, deti 6–15 a študenti denného štúdia do 26 rokov majú 100 % zľavu po registrácii.',
  },
  {
    id: 'zsskco2',
    label: 'ZSSK — environmentálna stopa (ISO 14001)',
    url: 'https://www.zssk.sk/aktuality/zssk-po-prvy-raz-ziskala-environmentalnu-certifikaciu-iso-14001-externy-audit-nezistil-ani-jednu-nezhodu/',
    note: 'Emisná intenzita ZSSK 24,84 g CO₂e na osobokilometer.',
  },
  {
    id: 'uba',
    label: 'Umweltbundesamt (2022) — emisie podľa druhu dopravy',
    url: 'https://www.navit.com/resources/bus-train-car-or-e-scooter-carbon-emissions-of-transport-modes-ranked',
    note: 'Mestský autobus 93, električka/metro 63, diaľkový autobus 31, e-bike 3, bicykel 0 g CO₂e/os.km.',
  },
  {
    id: 'elektrina',
    label: 'Emisná intenzita slovenskej elektriny (2025)',
    url: 'https://www.techbox.sk/slovenska-elektrina-prekvapila-na-celej-ciare-co2-ma-najnizsie-v-historii',
    note: '87,04 g CO₂/kWh — najnižšia v histórii, vďaka jadru a odstaveniu uhlia.',
  },
  {
    id: 'nabijanie',
    label: 'Ceny elektriny a nabíjania elektromobilu 2026',
    url: 'https://www.autovinky.sk/2026/06/24/naklady-na-nabijanie-elektromobilu/',
    note: 'Doma ≈ 0,22 €/kWh, verejné DC nabíjanie 0,38–0,71 €/kWh.',
  },
  {
    id: 'bolt',
    label: 'Bolt Bratislava — modelové ceny jázd',
    url: 'https://www.medium.sk/bolt-taxi-ako-funguje/',
    note: 'Hlavná stanica → Vivo (4,3 km): Bolt 5,50 €, Green 5,30 €, Comfort 6,80 €.',
  },
  {
    id: 'flix',
    label: 'FlixBus / RegioJet — diaľkové autobusy',
    url: 'https://www.flixbus.com/bus-routes/bus-bratislava-kosice',
    note: 'Bratislava–Košice od ~20 €, dynamické ceny.',
  },
]

// --- Palivá a energia ------------------------------------------------------
// CO₂ faktory: spaľovanie 2,31 kg/l benzín, 2,64 kg/l nafta a 1,51 kg/l LPG,
// navýšené o ťažbu, rafináciu a dopravu paliva (well-to-wheel, +20 %, +17 %, +12 %).
// LPG má nižšiu výhrevnosť, na rovnakú cestu ho treba o ~25–30 % viac litrov.
export const FUELS = {
  petrol: { label: 'Benzín', unit: 'l/100 km', price: 1.768, co2: 2.77, priceLabel: '€/l' },
  diesel: { label: 'Nafta', unit: 'l/100 km', price: 1.917, co2: 3.09, priceLabel: '€/l' },
  lpg: { label: 'LPG (autoplyn)', unit: 'l/100 km', price: 0.89, co2: 1.69, priceLabel: '€/l' },
  hybrid: { label: 'Hybrid (benzín)', unit: 'l/100 km', price: 1.768, co2: 2.77, priceLabel: '€/l' },
  ev: { label: 'Elektromobil', unit: 'kWh/100 km', price: 0.28, co2: 0.092, priceLabel: '€/kWh' },
}

// Predvolená spotreba pri prepnutí pohonu.
export const DEFAULT_CONSUMPTION = { petrol: 6.5, diesel: 6.0, lpg: 8.4, hybrid: 5.0, ev: 17.5 }

export const EV_GRID_CO2 = 0.092 // 87 g/kWh slovenský mix + ~6 % strát
export const EV_PRICE_HOME = 0.22
export const EV_PRICE_PUBLIC = 0.49

// --- Emisné faktory alternatív (g CO₂e / osobokilometer) -------------------
export const CO2_MODES = {
  train: 24.84, // ZSSK, vlastný vykazovaný údaj
  mhd: 80, // mix mestského autobusu (93) a električky/trolejbusu (63), UBA 2022
  // Prímestský autobus jazdí menej obsadený než mestský, preto má na
  // osobokilometer vyššiu stopu než diaľkový aj mestský autobus.
  regbus: 69.6, // Umweltbundesamt Rakúsko, REP-0801 (2022), 20 % obsadenosť
  coach: 31, // diaľkový autobus, UBA 2022
  bike: 0,
  ebike: 3,
}

// Taxi/Bolt najazdí navyše cestu k zákazníkovi a často aj späť naprázdno.
export const BOLT_DEADHEAD = 1.3

// --- Mestá a predplatné lístky MHD ----------------------------------------
// yearChild je zľavnený ročný lístok pre deti a študentov. Kde ho dopravca
// nezverejňuje na celý rok, odvodzujeme ho z pomeru kratších lístkov.
export const CITIES = [
  { id: 'ba', label: 'Bratislava — IDS BK, zóny 100+101', year: 263, yearChild: 131.5, src: 'idsbk' },
  { id: 'ke', label: 'Košice — DPMK', year: 240, yearChild: 120, src: 'dpmk' },
  { id: 'bb', label: 'Banská Bystrica — 4× 90-dňový', year: 220, yearChild: 132, src: 'dpmbb' },
  { id: 'po', label: 'Prešov — I. zóna', year: 219, yearChild: 143, src: 'dpmp' },
  { id: 'za', label: 'Žilina — rezident', year: 195, yearChild: 30, src: 'dpmz' },
]

// --- Kde človek býva -------------------------------------------------------
// Kalkulačka pôvodne rátala mestskú alternatívu, lenže predplatný lístok MHD
// existuje len v pár slovenských mestách. Mimo nich nastupuje prímestský
// autobus a vlak za jednotlivé cestovné — a hlavne iná miera toho, čo sa vôbec
// dá nahradiť. Preto sú to dva režimy, nie jedna priemerná pravda.
export const AREAS = {
  city: {
    id: 'city',
    label: 'V meste',
    hint: 'Bratislava, Košice, Žilina a spol.',
    note:
      'V meste je alternatíva najsilnejšia: predplatný lístok platí celý rok bez ohľadu na to, ' +
      'koľko ním najazdíš, zastávka býva do desiatich minút chôdze a krátke cesty pokryje bicykel.',
  },
  rural: {
    id: 'rural',
    label: 'Mimo mesta',
    hint: 'dedina alebo malé mesto bez MHD',
    note:
      'Mimo miest MHD spravidla nie je, preto tu namiesto predplatného rátame prímestský autobus ' +
      '(SAD, Arriva) a vlak za jednotlivé cestovné. A povedzme rovno aj to druhé: pri pár spojoch ' +
      'denne auto nahradiť úplne nejde.',
  },
}

// --- Ceny alternatív -------------------------------------------------------
// Vlak: tarifa ZSSK je degresívna — krátke regionálne cesty vychádzajú na km
// drahšie než diaľkové. IC Bratislava–Košice (445 km) za ~19 € je 0,043 €/km,
// bežná regionálna cesta vyjde okolo 0,09 €/km. Ako východisko berieme stred.
export const ALT_PRICES = {
  trainPerKm: 0.065,
  // Prímestský autobus: tarifa je pásmová a degresívna. Rátame cenu z čipovej
  // karty, lebo kto autobusom dochádza, kartu má — v hotovosti je každý lístok
  // o 0,50 € drahší. Dochádzanie na 18–20 km stojí 1,60 € (0,084 €/km),
  // na 26–30 km 2,00 € (0,071 €/km). Ako východisko berieme stred.
  regbusPerKm: 0.08,
  coachPerKm: 0.05, // FlixBus/RegioJet BA–KE ≈ 22 € / 445 km
  boltTripAvg: 7.0, // priemerná mestská jazda (4–5 km) podľa cenníkových príkladov
  boltTripKm: 5,
  bikeYear: 135, // bicykel 600 € / 8 rokov + 60 €/rok servis a diely
  ebikeYear: 325, // e-bike 1 800 € / 8 rokov + 100 €/rok servis a batéria
  // Priemerná rýchlosť auta vrátane zdržaní a hľadania parkovania. Nie je to
  // prevzatá štatistika, je to predpoklad, ktorý si používateľ vie prepísať.
  avgSpeed: 40, // km/h
  // Podiel z ceny dospelého, ktorý za dieťa zaplatíš navyše.
  trainChildRate: 0, // ZSSK: deti do 15 a študenti do 26 majú 100 % zľavu
  regbusChildRate: 0.5, // zľavnené cestovné je v tarife presne polovičné
  coachChildRate: 0.5, // odhad, dopravcovia detské zľavy nezverejňujú jednotne
}

// --- Profily ---------------------------------------------------------------
export const PROFILES = [
  {
    id: 'city',
    name: 'Malé mestské auto',
    tagline: 'Ojazdená Fabia, jazda hlavne po meste',
    city: 'ba',
    bikeType: 'bike',
    alloc: { mhd: 0.62, regbus: 0, train: 0.15, coach: 0.03, bike: 0.19, bolt: 0.01 },
    car: {
      price: 9000,
      years: 6,
      depreciation: 0.12,
      kmYear: 10000,
      fuel: 'petrol',
      consumption: 6.5,
      fuelPrice: 1.768,
      pzp: 160,
      kasko: 0,
      vignette: 90,
      stk: 43,
      service: 450,
      tyres: 120,
      parking: 39,
      other: 150,
    },
  },
  {
    id: 'family',
    name: 'Rodinné kombi',
    tagline: 'Dieselová Octavia, denné dochádzanie do práce',
    city: 'ke',
    bikeType: 'bike',
    alloc: { mhd: 0.4, regbus: 0, train: 0.37, coach: 0.1, bike: 0.12, bolt: 0.01 },
    car: {
      price: 15000,
      years: 7,
      depreciation: 0.13,
      kmYear: 20000,
      fuel: 'diesel',
      consumption: 6.0,
      fuelPrice: 1.917,
      pzp: 190,
      kasko: 280,
      vignette: 90,
      stk: 43,
      service: 700,
      tyres: 180,
      parking: 120,
      other: 200,
    },
  },
  {
    id: 'suv',
    name: 'Nové SUV',
    tagline: 'Nové auto z autosalónu, jazda po meste aj diaľnici',
    city: 'ba',
    bikeType: 'bike',
    alloc: { mhd: 0.47, regbus: 0, train: 0.32, coach: 0.06, bike: 0.14, bolt: 0.01 },
    car: {
      price: 35000,
      years: 8,
      depreciation: 0.15,
      kmYear: 15000,
      fuel: 'petrol',
      consumption: 7.8,
      fuelPrice: 1.768,
      pzp: 210,
      kasko: 550,
      vignette: 90,
      stk: 43,
      service: 500,
      tyres: 220,
      parking: 300,
      other: 250,
    },
  },
  {
    id: 'ev',
    name: 'Elektromobil',
    tagline: 'Nový elektromobil, 80 % nabíjania doma',
    city: 'ba',
    bikeType: 'ebike',
    alloc: { mhd: 0.47, regbus: 0, train: 0.32, coach: 0.06, bike: 0.14, bolt: 0.01 },
    car: {
      price: 38000,
      years: 8,
      depreciation: 0.18,
      kmYear: 15000,
      fuel: 'ev',
      consumption: 17.5,
      fuelPrice: 0.28,
      pzp: 190,
      kasko: 600,
      vignette: 45,
      stk: 43,
      service: 260,
      tyres: 250,
      parking: 300,
      other: 200,
    },
  },
  {
    id: 'cheapest',
    name: 'Najlacnejšie možné auto',
    tagline: 'Dvadsaťročná jazdenka, jazdí sa len keď treba',
    city: 'po',
    bikeType: 'bike',
    alloc: { mhd: 0.57, regbus: 0, train: 0.2, coach: 0.05, bike: 0.17, bolt: 0.01 },
    car: {
      price: 1200,
      years: 5,
      depreciation: 0.08,
      kmYear: 5000,
      fuel: 'petrol',
      consumption: 7,
      fuelPrice: 1.768,
      pzp: 105,
      kasko: 0,
      vignette: 11,
      stk: 36,
      service: 350,
      tyres: 80,
      parking: 0,
      other: 80,
    },
  },
]

// Orientačné porovnania pre emisie
export const TREE_KG_PER_YEAR = 21 // vzrastlý listnatý strom pohltí ~21 kg CO₂ ročne
export const INVEST_RETURN = 0.07 // dlhodobý priemerný výnos akciového portfólia
