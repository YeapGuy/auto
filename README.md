# Koľko ťa naozaj stojí auto?

Kalkulačka skutočných nákladov auta na Slovensku — **peňaženka aj ovzdušie**. Ukáže, koľko auto
naozaj stojí (nielen tankovanie), aká je jeho uhlíková stopa, a porovná to s kombináciou MHD,
vlaku, diaľkového autobusu, bicykla a Boltu, ktorú si používateľ poskladá sám.

## Spustenie

```bash
npm install
```

```bash
npm run dev
```

Build do statických súborov (`dist/`, funguje aj z `file://` vďaka `base: './'`):

```bash
npm run build
```

## Štruktúra

| Súbor | Čo obsahuje |
| --- | --- |
| `src/data.js` | Všetky vstupné čísla a zoznam zdrojov (`SOURCES`), profily áut, cenníky MHD, emisné faktory |
| `src/calc.js` | Čistý výpočet — náklady auta, alternatív, budúca hodnota úspory, slovenské formátovanie čísel |
| `src/App.jsx` | Celá stránka: hero, profily, výsledok, emisie, staviteľ alternatívy, zdroje |
| `src/components/ui.jsx` | Vstupné polia, posuvníky a rozbaľovacie bloky pre pokročilé parametre |
| `src/components/icons.jsx` | Linkové SVG ikony dopravných prostriedkov |
| `src/urlState.js` | Zabalenie nastavení do adresy a ich bezpečné načítanie späť (zdieľanie odkazu s výpočtom) |
| `src/styles.css` | Dizajn: IBM Plex (serif nadpisy, sans text, mono čísla), vlasové linky namiesto tieňov, zelená ako farba značky a tehlová ako dátová farba auta |

## Odkiaľ sú čísla

Žiadny predvolený údaj nie je odhad „od oka“. Kompletný zoznam zdrojov je v `src/data.js`
(konštanta `SOURCES`) a zobrazuje sa aj na konci stránky. Kľúčové vstupy (stav september 2026):

- **Palivo** — benzín 95 1,768 €/l, nafta 1,917 €/l (ŠÚ SR, 36. týždeň 2026), LPG ~0,89 €/l
- **Najlacnejšie vlastníctvo** — pojazdná jazdenka od 600–1 500 €, najnižšie PZP ~105 €/rok,
  najlacnejší balík STK + EK 72–79 € na dva roky
- **PZP** — priemer 168 €/rok, **diaľničná známka** 90 € (elektromobil 45 €), **STK + EK** ~85 € / 2 roky
- **Parkovanie** — rezidentská karta PAAS Bratislava 39 €/rok
- **MHD ročné predplatné** — Bratislava 263 €, Košice 240 €, Banská Bystrica ~220 €, Prešov 219 €, Žilina 195 €
- **Vlak** — ZSSK, IC Bratislava–Košice (445 km) 16–21 €, teda 0,043 €/km na diaľkovej trase
- **Emisie** — ZSSK 24,84 g CO₂e/os.km, mestská MHD 80 g, diaľkový autobus 31 g (Umweltbundesamt 2022)
- **Elektrina** — slovenský mix 87 g CO₂/kWh (2025), doma 0,22 €/kWh

## Metodika v skratke

- **Strata hodnoty:** `zostatok = cena × (1 − ročná strata)^roky`, rozdiel delený počtom rokov držby.
- **Emisie auta:** 2,31 kg CO₂/l benzínu, 2,64 kg/l nafty a 1,51 kg/l LPG + ťažba a rafinácia
  paliva (+20 % / +17 % / +12 %). Elektromobil počítaný slovenským mixom 87 g/kWh + ~6 % strát.
  LPG má nižšiu výhrevnosť, preto je predvolená spotreba o ~30 % vyššia než benzínová.
- **Bolt/taxík:** auto so spotrebou 6,8 l/100 km s prirážkou 30 % za jazdy naprázdno.
- **Viac cestujúcich:** auto odvezie celú skupinu za jednu cenu, alternatíva chce lístok za každého.
  Predplatné MHD, vlak, autobus aj bicykel sa preto násobia počtom ľudí, jazda Boltom nie. Deti majú
  polovičné predplatné (IDS BK 131,50 €) a vo vlaku po registrácii cestujú zadarmo. Emisie auta sa
  medzi cestujúcich delia, takže plne obsadené auto vie prekonať aj mestskú MHD — kalkulačka to
  povie nahlas.
- **Nezapočítané:** výroba vozidiel a infraštruktúry, úroky z úveru, pokuty, škody pri nehodách,
  čas v zápche, pri LPG ani prestavba a revízia tlakovej nádrže. Kalkulačka teda skôr podhodnocuje.

## Ako pridať mesto alebo upraviť cenník

Všetko je v `src/data.js` — pridaj položku do `CITIES` (s odkazom na zdroj v `SOURCES`) alebo uprav
`ALT_PRICES`. Používateľ si tie isté hodnoty vie prepísať aj priamo na stránke v rozbaľovacích
blokoch „pokročilé parametre“.
