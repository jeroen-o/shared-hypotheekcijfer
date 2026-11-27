// Rooktest consumententool: node tests/consument.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const blok = f => { const s = fs.readFileSync(path.resolve(__dirname, '..', f), 'utf8'); const a = s.indexOf('/* Rekenkern Shared'); return s.slice(a, s.indexOf('</script>', a)).trim(); };
if (blok('geldverstrekker.html') !== blok('index.html')) { console.error('FAIL: rekenkern in index.html wijkt af van geldverstrekker.html'); process.exit(1); }
(async () => {
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 390, height: 844 } }), errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '../index.html'));
  await pg.click('#anon'); await pg.click('#start');
  await pg.click('[data-seg="partner"][data-v="true"]');
  await pg.fill('[data-k="geboortejaar1"]', '1964'); await pg.fill('[data-k="inkomen1"]', '58000');
  await pg.fill('[data-k="geboortejaar2"]', '1966'); await pg.fill('[data-k="inkomen2"]', '24000');
  await pg.click('#verder');
  await pg.fill('[data-d="bedrag"]', '240000'); await pg.fill('[data-d="rente"]', '1,9');
  await pg.fill('[data-d="rvpJaar"]', '2028'); await pg.fill('[data-d="eindJaar"]', '2041'); await pg.fill('[data-d="startJaar"]', '2011');
  await pg.click('#verder');
  await pg.fill('[data-k="waarde"]', '425000'); await pg.fill('[data-k="bouwjaar"]', '1938'); await pg.selectOption('[data-k="grond"]', 'veen');
  await pg.click('#verder'); await pg.click('#verder');
  const c = await pg.textContent('.ring b'), w = await pg.evaluate(() => document.documentElement.scrollWidth);
  if (process.argv[2]) await pg.screenshot({ path: process.argv[2], fullPage: true });
  // Demo-pagina: inlog bovenaan, homepage: inlog onderaan
  const volgorde = async u => { await pg.goto(u); return pg.evaluate(() => { const a = document.getElementById('login'), b = document.getElementById('anon'); return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 'inlog-eerst' : 'anon-eerst'; }); };
  const base = 'file://' + path.resolve(__dirname, '../index.html');
  await pg.goto('about:blank');
  if (await volgorde(base + '#demo') !== 'inlog-eerst') errs.push('demo: inlog niet bovenaan');
  await pg.goto('about:blank');
  if (await volgorde(base) !== 'inlog-eerst') errs.push('homepage: zonder-inlog-blok niet onder de inlog');
  await pg.click('#anon'); await pg.click('#start'); await pg.click('[data-seg="partner"][data-v="true"]');
  await pg.fill('[data-k="geboortejaar1"]', '1964'); await pg.fill('[data-k="inkomen1"]', '58000'); await pg.fill('[data-k="geboortejaar2"]', '1966'); await pg.fill('[data-k="inkomen2"]', '24000'); await pg.click('#verder');
  await pg.fill('[data-d="bedrag"]', '240000'); await pg.fill('[data-d="rente"]', '1,9'); await pg.fill('[data-d="rvpJaar"]', '2028'); await pg.fill('[data-d="eindJaar"]', '2041'); await pg.click('#verder');
  await pg.fill('[data-k="waarde"]', '425000'); await pg.click('#verder'); await pg.click('#verder');
  // Inlogflow: consument deelt, adviseur ziet en bespreekt
  await pg.click('#uit'); await pg.click('[data-tab="consument"]');
  await pg.fill('#lc', 'hc-9999'); await pg.fill('#lg', '1964'); await pg.click('#login');
  if (!(await pg.textContent('#err')).length) errs.push('foute code geaccepteerd');
  await pg.fill('#lc', 'hc-4821'); await pg.click('#login');
  await pg.click('#start'); for (let i = 0; i < 4; i++) await pg.click('#verder');
  await pg.click('#deel');
  await pg.click('#uit'); await pg.click('[data-tab="adviseur"]');
  await pg.fill('#le', 'jdevries@demo.nl'); await pg.fill('#lw', 'demo'); await pg.click('#login');
  const status = await pg.textContent('.card .badge');
  if (!/Gedeeld/.test(status)) errs.push('status niet gedeeld: ' + status);
  await pg.click('[data-a="cijfer"]'); await pg.fill('#bericht', 'Laten we je pensioen bespreken.'); await pg.click('#besproken');
  await pg.click('#uit'); await pg.click('[data-tab="consument"]'); await pg.fill('#lc', 'HC-4821'); await pg.fill('#lg', '1966'); await pg.click('#login');
  if (!/pensioen bespreken/.test(await pg.textContent('#app'))) errs.push('bericht adviseur niet zichtbaar voor partner-login');
  if (process.argv[2]) await pg.screenshot({ path: process.argv[2].replace('.png', '-welkom.png'), fullPage: true });
  await b.close();
  if (errs.length || !/\d,\d/.test(c) || w > 390) { console.error('FAIL', { c, w, errs }); process.exit(1); }
  console.log(`OK · consumentencijfer ${c} · breedte ${w}px`);
})();
