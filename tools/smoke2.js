const { chromium } = require('playwright');
(async () => {
  const errors = [];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto('file:///home/claude/party-kingdom-heartbeat.html?ts=5');
  await page.click('#startBtn');
  await page.waitForTimeout(500);
  // click-to-move: click toward the Old Mill area on screen
  const before = await page.evaluate(() => ({ x: game.player.x, y: game.player.y }));
  await page.mouse.click(300, 300);
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({ x: game.player.x, y: game.player.y, mt: game.player.moveTarget }));
  // zoom out to war map
  await page.keyboard.press('m');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'shot_warmap.png' });
  const z1 = await page.evaluate(() => cam.zoom);
  // zoom back
  await page.keyboard.press('m');
  await page.waitForTimeout(800);
  const z2 = await page.evaluate(() => cam.zoom);
  // wheel zoom
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(500);
  const z3 = await page.evaluate(() => cam.zoom);
  console.log('moved:', before, '->', { x: after.x, y: after.y }, 'target:', after.mt);
  console.log('warmap zoom:', z1.toFixed(3), 'back:', z2.toFixed(3), 'wheel-out:', z3.toFixed(3));
  console.log('ERRORS:', errors.length ? errors : 'none');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch(e => { console.error('FATAL', e); process.exit(2); });
