const { chromium } = require('playwright');
(async () => {
  const errors = [];
  const exePath = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch({ executablePath: exePath, args: ['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  // heavy time-scale so a whole Reign runs in seconds
  await page.goto('file:///home/claude/party-kingdom-heartbeat.html?ts=40');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shot_menu.png' });

  await page.click('#startBtn');           // Quick preset default
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shot_roam.png' });

  // simulate some movement + harvest attempts
  await page.keyboard.down('a'); await page.waitForTimeout(400); await page.keyboard.up('a');
  await page.keyboard.press('e');
  await page.keyboard.down('w'); await page.waitForTimeout(300); await page.keyboard.up('w');

  // wait until council, then screenshot
  await page.waitForFunction(() => window.game.state === 'council', null, { timeout: 30000 });
  await page.screenshot({ path: 'shot_council.png' });
  // stand player on Aye platform programmatically & commit during bidding
  await page.waitForFunction(() => window.game.phaseT >= window.game.phaseDur * 0.4, null, { timeout: 20000 });
  await page.evaluate(() => { game.player.x = 610; game.player.y = 820; game.player.res.power = 5; });
  await page.keyboard.press(' ');
  await page.keyboard.press(' ');
  const committed = await page.evaluate(() => game.player.committed);
  await page.screenshot({ path: 'shot_bidding.png' });

  // run to the end of the reign
  await page.waitForFunction(() => window.game.state === 'end', null, { timeout: 120000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'shot_end.png' });

  const summary = await page.evaluate(() => ({
    season: game.season, banners: game.banners, ruin: game.ruin,
    outcomes: game.outcomes,
    actors: game.actors.map(a => ({ n: a.short, res: a.res, stats: a.stats })),
  }));
  console.log('player committed:', committed);
  console.log(JSON.stringify(summary, null, 1));
  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(2); });
