# Shared Hypotheekcijfer

Een monitoringtool voor hypotheken die geldverstrekker, adviseur en klant in één keten verbindt. Het concept is Blinqx: Hypotheekcijfer, Procesversneller/Ockto en woningwaarde via PandWise/Calcasa. Aanleiding is de verplichting om kredietkwaliteit en onderpand gedurende de hele looptijd te volgen (EBA/GL/2020/06, SREP, ECB-prioriteiten). Het AFM-gedragstoezicht stelt daarbij eisen aan zorgplicht en handelingsperspectief.

**Gebruik:** de homepage (`index.html`) is de Hypotheekcijfer-tool voor consument en adviseur; `geldverstrekker.html` is de portefeuillemonitoring. Open ze in een browser. Het is één bestand, zonder build-step en zonder externe API's. Er wordt niets opgeslagen, ook niet in localStorage; dat maakt embedden in Google Sites mogelijk. Printen gaat via `window.open()`.

## Onderdelen

| Tabblad | Voor wie | Inhoud |
|---|---|---|
| Geldverstrekker | Risk / kredietbeheer | KPI's (dekking, ouderdom van waarderingen, gewogen LTV, samenloop, funderingsrisico), uitvraagplanning, verdeling van cijfers, portefeuilletabel met early-warning-signalen, CSV-import/-export, printbare toezichtrapportage |
| Adviseur | Hypotheekadviseur | Werklijst op prioriteit, uitnodigen, brondata ophalen (simulatie Ockto, 90 dagen geldig), schakelaar voor de cursus onderhoudssignalering |
| Hypotheekcijfer | Klant + adviseur | Cijfer 1–10 per moment (einde rentevaste periode, einde renteaftrek, pensioen, samenloop, einde looptijd) en per life event (WW, AO, overlijden, scheiding, inkomensdaling), met handelingsperspectief; onderpand met LTV, funderingscijfer, onderhoud en stress-LTV; klantrapport; terugmelden aan de geldverstrekker |
| Kader & compliance | Iedereen | Processtappen, koppeling regelgeving → tool, compliance-aandachtspunten, rekenparameters |

## Hypotheekcijfer voor consument en adviseur (homepage, `index.html`)

"Scoor je hypotheekcijfer, en zie hoe jij ervoor staat." Een stappenplan in je-vorm (over jou, hypotheek, woning, als het tegenzit, je cijfer) met dezelfde rekenkern als `geldverstrekker.html`; `tests/consument.js` bewaakt dat beide identiek rekenen.

- **Consument:** logt in met een uitnodigingscode en het geboortejaar, ziet een vooraf ingevuld dossier, vult aan en deelt de uitkomst met de adviseur. De check kan ook anoniem.
- **Adviseur:** logt in, ziet de eigen klanten (status, voorlopig of vastgesteld cijfer), maakt uitnodigingen, vult samen met de klant in, legt een adviesnotitie en een bericht aan de klant vast, en markeert het dossier als besproken.
- **Demo-inlog ⚠️:** gesimuleerd (demo-codes HC-4821/1964 en HC-7350/1979; adviseur jdevries@demo.nl / demo). Geen echte beveiliging en geen opslag: gegevens staan alleen in de geopende browsertab. Niet gebruiken met echte klantdata. Voor productie zijn echte authenticatie (bijv. via de Blinqx-omgeving), een server met opslag en een AVG-/DPIA-toets nodig.

## Early-warning-signalen

- `EWI-BET`: betaalbaarheid (moment < 4 = hoog, < 5,5 = middel; life event < 4 = middel)
- `EWI-SAM`: samenloop van renteschok, aftrekverval en pensioen binnen 5 jaar
- `EWI-LTV`: LTV > 100% of stress-LTV > 100%
- `EWI-FUN`: funderingscijfer ≤ 4 (hoog) of ≤ 6,5 (middel)
- `EWI-VAL`: laatste waardebepaling is 3 jaar of ouder

## CSV-import

Download het sjabloon in de tool. Het scheidingsteken is `;`, decimalen met komma. Elke regel is één leningdeel; regels met hetzelfde `lening`-nummer worden samengevoegd.

## Beperkingen ⚠️

- Het cijfer toetst per scenario aan de **leennormen 2027**: de financieringslastpercentages uit Bijlage 1 van de Tijdelijke regeling hypothecair krediet (Stcrt. 2026, 38415), gecontroleerd tegen de Nibud-bijlage. Benutting = schuld / maximale hypotheek; die benutting wordt vertaald naar een cijfer van 1–10. Vereenvoudigingen: geen studieschuld of andere verplichtingen, geen verhoging van € 18.000 voor alleenstaanden, een pensioenaanname van 70%, en de AOW-tabel volgt de partner met het hoogste inkomen. Het cijfer is geen hypotheekadvies en geen kredietbeslissing.
- NHG (Voorwaarden & normen 2027): NHG-kenmerk per lening; grens € 500.000 (€ 530.000 met EBV), borgtochtprovisie 0,4%.
- De koppelingen met Ockto, PandWise, Calcasa en Funderingscijfer zijn **gesimuleerd** of gaan via handmatige invoer.
- De demo-portefeuille is fictief.
- Fiscale parameters 2027 (Belastingplan 2027, **wetsvoorstel**; definitief na stemming in de Eerste Kamer): aftrektarief 38,16%, eigenwoningforfait 0,35% tot € 1.360.000 en 2,35% daarboven, Wet Hillen 67,067%. AOW-leeftijd 67 jaar (geboren t/m 1960), daarna 67 jaar en 3 maanden. Maximumdagloon € 309,91 per 1-7-2026; het bedrag per 1-1-2027 is nog niet gepubliceerd.
- De parameters staan in `PARAMS` in `geldverstrekker.html` en identiek in `index.html`; werk ze jaarlijks bij.
- Huisstijl: die van Hypotheekcijfer (geel #FFD31C / zwart, zeshoeken, afgeschuinde hoeken). Lettertypefamilie Montserrat als die lokaal aanwezig is, anders systeemfont (geen externe fonts geladen).

## Rapport

De homepage maakt het rapport "Je hypotheekcijfer nu en later": een brief, een voorblad, een inhoudsopgave en zeven hoofdstukken (samenvatting, belangrijke momenten, hypotheek in de tijd, life events, gegevens, wat je kunt doen, goed om te weten). Het opent via `window.open()` en is als PDF op te slaan.

De rekenkern volgt de methode van Hypotheekcijfer.nl:
- maximale hypotheek volgens de leennormen 2027 minus (schuld − eigen geld);
- verplichtingen: studieschuld 0,75%/0,45% × bruteringsfactor, krediet 2%, private lease 100%;
- € 18.000 extra voor een alleenstaande met een toetsinkomen boven € 31.000;
- momenten per leningdeel en per AOW-datum;
- rekenen per maand vanaf de peildatum; AOW binnen 10 jaar via de contante waarde van de toegestane last vóór en na de AOW-datum; AOW-tabel als iedereen in het huishouden de AOW-leeftijd heeft bereikt;
- cijfer per moment: ruimte < 10% van de schuld → 7, anders 8; overschrijding tot 5% → 5, tot 10% → 4, daarboven 3;
- totaalcijfer volgens de 'Hypotheekcijfer rekenmethode': 5 situaties; basis 6, −1 per tekort, +1 bij min. overschot > 10% en > 20%; minimaal 3; plafonds bij tekort > 25%/50% en LTV > 100/115/130%.

`tests/kelder.js` controleert alle 17 situaties en het totaalcijfer (5) tegen het voorbeeldrapport.

## Test

```bash
node tests/smoke.js
node tests/consument.js
node tests/kelder.js   # rekenkern tegen het voorbeeldrapport (Hans en Petra Kelder)
```
