// Controle rekenkern tegen het voorbeeldrapport "Je hypotheekcijfer nu en later" (Hans en Petra Kelder, 27-11-2026): node tests/kelder.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const s = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8'), a = s.indexOf('/* Rekenkern Shared');
const ctx = {}; vm.createContext(ctx); vm.runInContext(s.slice(a, s.indexOf('</script>', a)) + ';this.berekenDossier=berekenDossier;', ctx);
const k = { peil: '2026-11-27', naam1: 'Hans Kelder', naam2: 'Petra Kelder', partner: true, geboortedatum1: '1980-01-01', geboortedatum2: '1982-06-15', geboortejaar1: 1980, geboortejaar2: 1982,
  inkomen1: 54432, inkomen2: 18000, pensioen1: 22500, pensioen2: 14000, eigenGeld: 5000, studieBedrag: 15000, studieStelsel: 'oud', studieEind: 2045, kredietBedrag: 2000, kredietEind: 2045,
  leaseMaand: 300, leaseEind: 2029, orv1: 50000, orv2: 0, nabestaanden2: 9000, nabestaanden: 0, waarde: 350000, woz: 350000, bouwjaar: 1990, grond: 'zand', energielabel: 'geen',
  delen: [{ vorm: 'aflossingsvrij', saldo: 100000, rente: 2.0, eindDatum: '2040-01-01', rvpDatum: '2030-01-01', aftrekDatum: '2031-01-01', box: 1 },
          { vorm: 'annuitair', saldo: 100000, rente: 3.5, eindDatum: '2050-01-01', rvpDatum: '2034-01-01', aftrekDatum: '2050-01-01', box: 1 }] };
const r = ctx.berekenDossier(k);
// [max. hypotheek, ruimte] uit het voorbeeldrapport
const verwacht = { 'Huidige situatie': [202888, 7888], 'Einde rentevaste periode 2030': [258772, 72943], 'Einde hypotheekrenteaftrek 2031': [224236, 41601],
  'Einde rentevaste periode 2034': [224236, 51878], 'Einde looptijd 2040': [147822, -448], 'Hans Kelder bereikt de AOW-leeftijd 2047': [133804, 22254],
  'Petra Kelder bereikt de AOW-leeftijd 2049': [136333, 39241], 'Einde hypotheekrenteaftrek 2050': [136333, 41333], 'Einde looptijd 2050': [136333, 41333],
  'Arbeidsongeschiktheid Hans Kelder': [127147, -67853], 'Werkloosheid Hans Kelder': [127147, -67853], 'Arbeidsongeschiktheid Petra Kelder': [170603, -24397],
  'Werkloosheid Petra Kelder': [170603, -24397], 'Overlijden Hans Kelder': [5402, -139598], 'Overlijden Petra Kelder': [138664, -56336],
  'Scheiding – Hans Kelder houdt het huis': [138664, -56336], 'Scheiding – Petra Kelder houdt het huis': [0, -195000] };
let fout = 0, getest = 0;
r.scen.forEach(x => {
  const key = x.groep === 'moment' ? `${x.titel} ${x.jaar}` : x.titel, v = verwacht[key];
  let ok = '';
  if (v) { getest++; ok = Math.abs(x.maxH - v[0]) <= 2 && Math.abs(x.ruimte - v[1]) <= 3 ? 'OK ' : (fout++, 'AFW'); }
  console.log(`${ok.padEnd(4)}${key.padEnd(46)} max ${Math.round(x.maxH).toString().padStart(7)} ruimte ${Math.round(x.ruimte).toString().padStart(8)} cijfer ${x.cijfer}${v ? `  (rapport ${v[0]} / ${v[1]})` : ''}`);
});
console.log('totaalcijfer', r.totaal, '(rapport 5)'); if (r.totaal !== 5) fout++;
if (fout) { console.error('FAIL: ' + fout + ' afwijkingen van ' + (getest + 1)); process.exit(1); }
console.log(`OK · ${getest} situaties en het totaalcijfer komen exact overeen met het voorbeeldrapport`);
