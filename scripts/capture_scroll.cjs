const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(3000);

  const scrollHeights = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      maxScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
    };
  });
  console.log('Scroll metrics:', scrollHeights);

  const testPoints = [0.0, 0.20, 0.35, 0.55, 0.62, 0.68, 0.74, 0.82];
  if (!fs.existsSync('test-shots')) fs.mkdirSync('test-shots');

  for (const p of testPoints) {
    const scrollY = scrollHeights.maxScroll * p;
    await page.evaluate((y) => {
      window.scrollTo(0, y);
    }, scrollY);
    // Wait for GSAP / smooth scroll / camera lerp to catch up
    await page.waitForTimeout(1400);

    const data = await page.evaluate(() => {
      const h = window.__STUDIO?.laptopHinge;
      const screenMat = window.__STUDIO?.laptopScreenMat;
      const camera = window.__THREE_CAMERA;
      return {
        hingeRotX: h ? h.rotation.x : null,
        hasMap: screenMat ? !!screenMat.map : false,
        camPos: camera ? [camera.position.x, camera.position.y, camera.position.z] : null
      };
    });

    console.log('p:', p, 'hingeRotX:', data.hingeRotX, 'camPos:', data.camPos);
    await page.screenshot({ path: 'test-shots/shot_' + Math.round(p * 100) + '.png' });
  }

  await browser.close();
  console.log('Screenshots saved to test-shots/');
})();
