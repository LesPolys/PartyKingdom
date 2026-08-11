const { chromium } = require('playwright');
(async () => {
  const errors = [];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('file:///home/claude/party-kingdom-heartbeat.html?ts=6');
  await page.click('#startBtn');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 's3_roam.png' });

  // click-to-interact: click on the Old Mill from afar -> should walk + auto-harvest
  const millScreen = await page.evaluate(() => {
    const poi = game.player; // ensure cam ready
    const m = { x: 300, y: 700 };
    return { x: (m.x - cam.x) * cam.zoom, y: (m.y - cam.y) * cam.zoom };
  });
  await page.mouse.move(millScreen.x, millScreen.y);
  await page.waitForTimeout(100);
  await page.mouse.click(millScreen.x, millScreen.y);
  // wait for walk + channel + harvest (ts=6 accelerates)
  await page.waitForFunction(() => game.player.res.prov >= 1 || game.state !== 'roam', null, { timeout: 30000 }).catch(()=>{});
  const prov = await page.evaluate(() => game.player.res.prov);
  await page.screenshot({ path: 's3_harvest.png' });

  // open dev tools, edit a dilemma, queue it
  await page.click('#devBtn');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    document.getElementById('dJson').value = JSON.stringify({id:'test1',cat:'Dev',title:'Dev Card',text:'Test.',aye:{label:'Yes',fx:{crown:1}},nay:{label:'No',fx:{way:-1}}});
  });
  await page.click('#dApply');
  await page.click('#dPlayNext');
  const forced = await page.evaluate(() => game.forcedNext);
  // skip phase via dev
  await page.click('button[data-t="game"]');
  await page.click('#gSkip');
  await page.waitForFunction(() => game.state === 'council', null, { timeout: 15000 });
  const title = await page.evaluate(() => game.dilemma.title);
  await page.waitForFunction(() => game.phaseT >= game.phaseDur * 0.4, null, { timeout: 15000 });
  await page.evaluate(() => { game.player.x = 610; game.player.y = 820; game.player.res.power = 5; });
  await page.keyboard.press(' ');
  await page.keyboard.press(' ');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 's3_council.png' });
  const committed = await page.evaluate(() => game.player.committed);
  // war map
  await page.keyboard.press('m');
  await page.waitForTimeout(900);
  await page.screenshot({ path: 's3_warmap.png' });
  // run to end
  await page.click('#devBtn'); // close dev
  await page.evaluate(() => { RUNTIME.ts = 40; });
  await page.waitForFunction(() => game.state === 'end', null, { timeout: 120000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 's3_end.png' });
  console.log('prov after click-harvest:', prov, '| forcedNext:', forced, '| council card:', title, '| committed:', committed);
  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(2); });
