// Rooktest: node tests/smoke.js  (vereist Playwright + Chromium)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(), pg = await b.newPage(), errs = [];
  pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept());
  await pg.goto('file://' + path.resolve(__dirname, '../index.html'));
  const n = await pg.$$eval('#pt tbody tr', r => r.length);
  await pg.click('#pt tbody tr'); await pg.fill('input[data-k="inkomen1"]', '45.000');
  const c = await pg.textContent('.ring'); await pg.click('#fin');
  for (const v of ['adv', 'klant', 'kader', 'gv']) await pg.click(`nav button[data-v="${v}"]`);
  await b.close();
  if (errs.length || n < 1 || !/\d,\d/.test(c)) { console.error('FAIL', { n, c, errs }); process.exit(1); }
  console.log(`OK · ${n} leningen · cijfer ${c}`);
})();
