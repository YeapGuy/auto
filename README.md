# Koľko ťa naozaj stojí auto?

Kalkulačka skutočných nákladov auta na Slovensku — **peňaženka aj ovzdušie**. Ukáže, koľko auto
naozaj stojí (nielen tankovanie), aká je jeho uhlíková stopa, a porovná to s kombináciou MHD alebo
prímestského autobusu, vlaku, diaľkového autobusu, bicykla a Boltu, ktorú si používateľ poskladá
sám — zvlášť pre mesto a zvlášť pre život mimo neho.

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

## Ako pridať mesto alebo upraviť cenník

Všetko je v `src/data.js` — pridaj položku do `CITIES` (s odkazom na zdroj v `SOURCES`) alebo uprav
`ALT_PRICES`. Používateľ si tie isté hodnoty vie prepísať aj priamo na stránke v rozbaľovacích
blokoch „pokročilé parametre“.
