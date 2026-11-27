// Controle rekenkern tegen het voorbeeldrapport "Je hypotheekcijfer nu en later" (Hans en Petra Kelder): node tests/kelder.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const s = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8'), a = s.indexOf('/* Rekenkern Shared');
const ctx = {}; vm.createContext(ctx); vm.runInContext(s.slice(a, s.indexOf('</script>', a)) + ';this.berekenDossier=berekenDossier;', ctx);
const k = { naam1: 'Hans Kelder', naam2: 'Petra Kelder', partner: true, geboortejaar1: 1980, geboortejaar2: 1982, inkomen1: 54432, inkomen2: 18000, pensioen1: 22500, pensioen2: 14000,
  eigenGeld: 5000, studieBedrag: 15000, studieStelsel: 'oud', studieEind: 2045, kredietBedrag: 2000, kredietEind: 2045, leaseMaand: 300, leaseEind: 2029,
  orv1: 50000, orv2: 0, nabestaanden2: 9000, nabestaanden: 0, waarde: 350000, woz: 350000, bouwjaar: 1990, grond: 'zand', energielabel: 'geen',
  delen: [{ vorm: 'aflossingsvrij', saldo: 100000, rente: 2.0, restLooptijd: 168, rvpEindJaar: 2030, aftrekEindJaar: 2031, box: 1 },
          { vorm: 'annuitair', saldo: 100000, rente: 3.5, restLooptijd: 288, rvpEindJaar: 2034, aftrekEindJaar: 2050, box: 1 }] };
const r = ctx.berekenDossier(k);
const verwacht = { 'Huidige situatie': 202888, 'Einde rentevaste periode 2030': 258772, 'Einde hypotheekrenteaftrek 2031': 224236, 'Einde rentevaste periode 2034': 224236,
  'Petra Kelder bereikt de AOW-leeftijd 2049': 136333, 'Arbeidsongeschiktheid Hans Kelder': 127147, 'Arbeidsongeschiktheid Petra Kelder': 170603,
  'Overlijden Hans Kelder': 5402, 'Overlijden Petra Kelder': 138664, 'Scheiding – Hans Kelder houdt het huis': 138664, 'Scheiding – Petra Kelder houdt het huis': 0 };
let fout = 0;
r.scen.forEach(x => {
  const key = x.groep === 'moment' ? `${x.titel} ${x.jaar}` : x.titel, v = verwacht[key];
  const ok = v == null ? '' : Math.abs(x.maxH - v) <= 2 ? 'OK ' : (fout++, 'AFW');
  console.log(`${ok.padEnd(4)}${key.padEnd(48)} max ${Math.round(x.maxH).toString().padStart(7)} ruimte ${Math.round(x.ruimte).toString().padStart(8)} cijfer ${x.cijfer}${v != null ? '  (rapport ' + v + ')' : ''}`);
});
console.log('totaal', r.totaal);
if (fout) { console.error('FAIL: ' + fout + ' afwijkingen'); process.exit(1); }
console.log('OK · rekenkern komt overeen met het voorbeeldrapport');
